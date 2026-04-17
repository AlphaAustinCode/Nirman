const mongoose = require("mongoose");

const consumerSchema = new mongoose.Schema(
  {
    agency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
      index: true,
    },
    passbook_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          return /^\d{17}$/.test(value);
        },
        message: "Passbook number must be exactly 17 digits",
      },
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    registered_phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    secondary_phone: {
      type: String,
      default: null,
      trim: true,
    },
    is_registered: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

consumerSchema.index({ agency_id: 1, passbook_number: 1 }, { unique: true });

module.exports = mongoose.model("Consumer", consumerSchema);
