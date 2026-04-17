const Consumer = require("../models/Consumer");
const Listing = require("../models/Listing");
const ExchangeRequest = require("../models/ExchangeRequest");
const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");
const { toGeoPoint, parseCoordinate } = require("../utils/geo");
const { createNotification, listNotificationsForUser, markNotificationRead } = require("./notificationService");
const { applyTrustDelta } = require("./trustService");

function generateSerialNumber() {
  return `CYL-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;
}

async function enrichUserFromConsumer(user) {
  const consumer = await Consumer.findById(user.consumer_id);

  if (consumer && !user.full_name) {
    user.full_name = consumer.full_name;
  }

  return consumer;
}

async function createListingForUser(user, payload) {
  const consumer = await enrichUserFromConsumer(user);

  if (!consumer) {
    throw new ApiError(404, "Consumer profile not found for authenticated user");
  }

  const activeListing = await Listing.findOne({
    provider_user_id: user._id,
    status: { $in: ["ACTIVE", "RESERVED"] },
  });

  if (activeListing) {
    throw new ApiError(409, "You already have an active listing");
  }

  const availableFrom = new Date(payload.available_from);
  const availableTo = new Date(payload.available_to);

  if (Number.isNaN(availableFrom.getTime()) || Number.isNaN(availableTo.getTime())) {
    throw new ApiError(400, "available_from and available_to must be valid datetimes");
  }

  if (availableTo <= availableFrom) {
    throw new ApiError(400, "available_to must be after available_from");
  }

  const point = toGeoPoint(payload.longitude, payload.latitude);

  user.location = point;
  user.location_label = payload.location_label;
  user.stats.listings_created += 1;
  await user.save();

  const listing = await Listing.create({
    provider_user_id: user._id,
    provider_consumer_id: consumer._id,
    serial_number: payload.serial_number || generateSerialNumber(),
    location_label: payload.location_label,
    location: point,
    available_from: availableFrom,
    available_to: availableTo,
    radius_km: Number(payload.radius_km || 3),
    notes: payload.notes || null,
  });

  await createNotification({
    userId: user._id,
    type: "LISTING_CREATED",
    title: "Listing published",
    body: `Your cylinder listing is now visible near ${payload.location_label}.`,
    metadata: { listingId: listing._id.toString() },
  });

  return listing;
}

async function listAvailableListings({ user, longitude, latitude, radiusKm = 3 }) {
  const lng = parseCoordinate(longitude, "longitude");
  const lat = parseCoordinate(latitude, "latitude");
  const radiusInMeters = Number(radiusKm) * 1000;

  const listings = await Listing.find({
    provider_user_id: { $ne: user._id },
    status: "ACTIVE",
    available_to: { $gte: new Date() },
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: radiusInMeters,
      },
    },
  })
    .populate("provider_user_id", "full_name trust_score location_label")
    .sort({ available_from: 1, createdAt: -1 });

  return listings;
}

async function getUserListings(userId) {
  return Listing.find({ provider_user_id: userId })
    .sort({ createdAt: -1 });
}

async function cancelListing(user, listingId) {
  const listing = await Listing.findOne({
    _id: listingId,
    provider_user_id: user._id,
  });

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.status === "COMPLETED") {
    throw new ApiError(409, "Completed listings cannot be cancelled");
  }

  listing.status = "CANCELLED";
  await listing.save();

  await ExchangeRequest.updateMany(
    { listing_id: listing._id, status: { $in: ["PENDING", "ACCEPTED"] } },
    { $set: { status: "CANCELLED" } }
  );

  return listing;
}

async function createExchangeRequest(user, payload) {
  const listing = await Listing.findById(payload.listing_id).populate(
    "provider_user_id",
    "full_name trust_score"
  );

  if (!listing || listing.status !== "ACTIVE") {
    throw new ApiError(404, "Active listing not found");
  }

  if (String(listing.provider_user_id._id) === String(user._id)) {
    throw new ApiError(400, "You cannot request your own listing");
  }

  const existing = await ExchangeRequest.findOne({
    listing_id: listing._id,
    requester_user_id: user._id,
    status: { $in: ["PENDING", "ACCEPTED"] },
  });

  if (existing) {
    throw new ApiError(409, "You already have an active request for this listing");
  }

  if (user.trust_score < Number(process.env.MIN_REQUEST_TRUST_SCORE || 40)) {
    throw new ApiError(403, "Trust score too low to request a cylinder");
  }

  const request = await ExchangeRequest.create({
    listing_id: listing._id,
    provider_user_id: listing.provider_user_id._id,
    requester_user_id: user._id,
    urgency: payload.urgency || "medium",
    message: payload.message || null,
    requested_location_label: payload.location_label || null,
    requested_location:
      payload.longitude !== undefined && payload.latitude !== undefined
        ? toGeoPoint(payload.longitude, payload.latitude)
        : undefined,
  });

  listing.request_count += 1;
  await listing.save();

  user.stats.requests_made += 1;
  await user.save();

  await createNotification({
    userId: listing.provider_user_id._id,
    type: "REQUEST_RECEIVED",
    title: "New cylinder request",
    body: `${user.full_name || user.phone} requested your listing near ${listing.location_label}.`,
    metadata: {
      requestId: request._id.toString(),
      listingId: listing._id.toString(),
      requesterId: user._id.toString(),
    },
  });

  return request;
}

async function listRequestsForUser(user, role, status) {
  const filter = {};

  if (role === "provider") {
    filter.provider_user_id = user._id;
  } else if (role === "requester") {
    filter.requester_user_id = user._id;
  } else {
    filter.$or = [
      { provider_user_id: user._id },
      { requester_user_id: user._id },
    ];
  }

  if (status) {
    filter.status = status;
  }

  return ExchangeRequest.find(filter)
    .populate("listing_id")
    .populate("provider_user_id", "full_name trust_score phone")
    .populate("requester_user_id", "full_name trust_score phone")
    .sort({ createdAt: -1 });
}

async function respondToRequest(user, requestId, payload) {
  const request = await ExchangeRequest.findOne({
    _id: requestId,
    provider_user_id: user._id,
  })
    .populate("listing_id")
    .populate("requester_user_id", "full_name");

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (request.status !== "PENDING") {
    throw new ApiError(409, "Only pending requests can be responded to");
  }

  const action = payload.action;
  if (!["accept", "reject"].includes(action)) {
    throw new ApiError(400, "action must be accept or reject");
  }

  request.status = action === "accept" ? "ACCEPTED" : "REJECTED";
  request.provider_response_note = payload.note || null;
  await request.save();

  if (action === "accept") {
    request.listing_id.status = "RESERVED";
    request.listing_id.selected_request_id = request._id;
    await request.listing_id.save();

    await ExchangeRequest.updateMany(
      {
        listing_id: request.listing_id._id,
        _id: { $ne: request._id },
        status: "PENDING",
      },
      { $set: { status: "REJECTED", provider_response_note: "Listing reserved for another requester" } }
    );
  }

  await createNotification({
    userId: request.requester_user_id._id,
    type: action === "accept" ? "REQUEST_ACCEPTED" : "REQUEST_REJECTED",
    title: action === "accept" ? "Request accepted" : "Request declined",
    body:
      action === "accept"
        ? `Your cylinder request has been accepted for ${request.listing_id.location_label}.`
        : `Your cylinder request was declined for ${request.listing_id.location_label}.`,
    metadata: {
      requestId: request._id.toString(),
      listingId: request.listing_id._id.toString(),
    },
  });

  return request;
}

async function completeExchange(user, requestId) {
  const request = await ExchangeRequest.findById(requestId)
    .populate("listing_id")
    .populate("provider_user_id")
    .populate("requester_user_id");

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  const isParticipant =
    String(request.provider_user_id._id) === String(user._id) ||
    String(request.requester_user_id._id) === String(user._id);

  if (!isParticipant) {
    throw new ApiError(403, "Only exchange participants can complete the exchange");
  }

  if (request.status !== "ACCEPTED") {
    throw new ApiError(409, "Only accepted requests can be completed");
  }

  request.status = "COMPLETED";
  request.completed_at = new Date();
  await request.save();

  request.listing_id.status = "COMPLETED";
  await request.listing_id.save();

  request.provider_user_id.stats.lends_completed += 1;
  request.requester_user_id.stats.borrows_completed += 1;
  await request.provider_user_id.save();
  await request.requester_user_id.save();

  await Promise.all([
    applyTrustDelta({
      userId: request.provider_user_id._id,
      delta: 3,
      reason: "Completed cylinder lend",
      exchangeRequestId: request._id,
    }),
    applyTrustDelta({
      userId: request.requester_user_id._id,
      delta: 2,
      reason: "Completed cylinder borrow",
      exchangeRequestId: request._id,
    }),
  ]);

  await Promise.all([
    createNotification({
      userId: request.provider_user_id._id,
      type: "EXCHANGE_COMPLETED",
      title: "Exchange completed",
      body: `Your exchange with ${request.requester_user_id.full_name || request.requester_user_id.phone} is marked complete.`,
      metadata: { requestId: request._id.toString() },
    }),
    createNotification({
      userId: request.requester_user_id._id,
      type: "EXCHANGE_COMPLETED",
      title: "Exchange completed",
      body: `Your exchange with ${request.provider_user_id.full_name || request.provider_user_id.phone} is marked complete.`,
      metadata: { requestId: request._id.toString() },
    }),
  ]);

  return request;
}

async function getProfileSummary(user) {
  const recentNotifications = await Notification.find({ user_id: user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  const activeRequests = await ExchangeRequest.countDocuments({
    requester_user_id: user._id,
    status: { $in: ["PENDING", "ACCEPTED"] },
  });

  return {
    id: user._id,
    name: user.full_name || user.phone,
    location: user.location_label,
    trustScore: user.trust_score,
    activeRequests,
    cylindersShared: user.stats.lends_completed,
    joinDate: user.createdAt,
    stats: user.stats,
    recentNotifications,
  };
}

async function getHistoryForUser(user) {
  const requests = await ExchangeRequest.find({
    $or: [{ provider_user_id: user._id }, { requester_user_id: user._id }],
    status: { $in: ["COMPLETED", "CANCELLED", "REJECTED", "ACCEPTED", "PENDING"] },
  })
    .populate("provider_user_id", "full_name")
    .populate("requester_user_id", "full_name")
    .sort({ updatedAt: -1 });

  return requests;
}

module.exports = {
  createListingForUser,
  listAvailableListings,
  getUserListings,
  cancelListing,
  createExchangeRequest,
  listRequestsForUser,
  respondToRequest,
  completeExchange,
  getProfileSummary,
  getHistoryForUser,
  listNotificationsForUser,
  markNotificationRead,
};
