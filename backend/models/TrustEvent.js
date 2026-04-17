const mongoose = require("mongoose");

const trustEventSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exchange_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest",
      default: null,
    },
    delta: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrustEvent", trustEventSchema);
