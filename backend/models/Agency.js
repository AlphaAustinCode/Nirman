const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agency_name: {
      type: String,
      required: true,
      trim: true,
    },
    agency_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Agency", agencySchema);
