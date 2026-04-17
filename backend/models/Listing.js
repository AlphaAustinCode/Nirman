const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    provider_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider_consumer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    serial_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location_label: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    available_from: {
      type: Date,
      required: true,
      index: true,
    },
    available_to: {
      type: Date,
      required: true,
      index: true,
    },
    radius_km: {
      type: Number,
      default: 3,
      min: 0.5,
      max: 15,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RESERVED", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    request_count: {
      type: Number,
      default: 0,
    },
    selected_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Listing", listingSchema);
