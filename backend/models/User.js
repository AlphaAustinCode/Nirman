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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
