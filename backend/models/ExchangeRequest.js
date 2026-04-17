const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    provider_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requester_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
      ],
      default: "PENDING",
      index: true,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    message: {
      type: String,
      trim: true,
      default: null,
    },
    requested_location_label: {
      type: String,
      trim: true,
      default: null,
    },
    requested_location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: null,
      },
    },
    provider_response_note: {
      type: String,
      trim: true,
      default: null,
    },
    completed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

exchangeRequestSchema.index(
  { listing_id: 1, requester_user_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["PENDING", "ACCEPTED"] },
    },
  }
);

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);
