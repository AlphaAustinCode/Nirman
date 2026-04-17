const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
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
} = require("../services/sharingService");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileSummary(req.user);
  res.status(200).json({ success: true, data: profile });
});

const createListing = asyncHandler(async (req, res) => {
  const listing = await createListingForUser(req.user, req.body);
  res.status(201).json({
    success: true,
    message: "Cylinder listing created successfully",
    data: listing,
  });
});

const getMyListings = asyncHandler(async (req, res) => {
  const listings = await getUserListings(req.user._id);
  res.status(200).json({ success: true, count: listings.length, data: listings });
});

const getAvailableListings = asyncHandler(async (req, res) => {
  const { longitude, latitude, radiusKm } = req.query;

  if (longitude === undefined || latitude === undefined) {
    throw new ApiError(400, "longitude and latitude are required");
  }

  const listings = await listAvailableListings({
    user: req.user,
    longitude,
    latitude,
    radiusKm: radiusKm || 3,
  });

  const mapped = listings.map((listing) => ({
    id: listing._id,
    providerName: listing.provider_user_id.full_name || "Verified User",
    distanceLabel: null,
    trustScore: listing.provider_user_id.trust_score,
    status: listing.status,
    location: listing.location_label,
    availableFrom: listing.available_from,
    availableTo: listing.available_to,
    radiusKm: listing.radius_km,
    lat: listing.location.coordinates[1],
    lng: listing.location.coordinates[0],
    serialNumber: listing.serial_number,
  }));

  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await cancelListing(req.user, req.params.id);
  res.status(200).json({
    success: true,
    message: "Listing cancelled successfully",
    data: listing,
  });
});

const createRequest = asyncHandler(async (req, res) => {
  const exchangeRequest = await createExchangeRequest(req.user, req.body);
  res.status(201).json({
    success: true,
    message: "Request sent to provider",
    data: exchangeRequest,
  });
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await listRequestsForUser(req.user, req.query.role, req.query.status);
  res.status(200).json({ success: true, count: requests.length, data: requests });
});

const respondRequest = asyncHandler(async (req, res) => {
  const result = await respondToRequest(req.user, req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: `Request ${req.body.action === "accept" ? "accepted" : "rejected"} successfully`,
    data: result,
  });
});

const completeRequest = asyncHandler(async (req, res) => {
  const result = await completeExchange(req.user, req.params.id);
  res.status(200).json({
    success: true,
    message: "Exchange completed successfully",
    data: result,
  });
});

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await listNotificationsForUser(req.user._id, Number(req.query.limit || 20));
  res.status(200).json({ success: true, count: notifications.length, data: notifications });
});

const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.id, req.user._id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({ success: true, data: notification });
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await getHistoryForUser(req.user);

  const mapped = history.map((entry) => {
    const isProvider = String(entry.provider_user_id._id) === String(req.user._id);
    const partner = isProvider ? entry.requester_user_id : entry.provider_user_id;

    return {
      id: entry._id,
      date: entry.updatedAt,
      type: isProvider ? "Lent" : "Borrowed",
      counterparty: partner?.full_name || "Verified User",
      status: entry.status,
      amount: "Exchange",
    };
  });

  res.status(200).json({ success: true, count: mapped.length, data: mapped });
});

module.exports = {
  getProfile,
  createListing,
  getMyListings,
  getAvailableListings,
  deleteListing,
  createRequest,
  getRequests,
  respondRequest,
  completeRequest,
  getNotifications,
  readNotification,
  getHistory,
};
