const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    consumer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      trim: true,
      default: null,
    },
    trust_score: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
      index: true,
    },
    location_label: {
      type: String,
      trim: true,
      default: null,
    },
    location: {
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
    stats: {
      lends_completed: {
        type: Number,
        default: 0,
      },
      borrows_completed: {
        type: Number,
        default: 0,
      },
      requests_made: {
        type: Number,
        default: 0,
      },
      listings_created: {
        type: Number,
        default: 0,
      },
      cancellations: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
