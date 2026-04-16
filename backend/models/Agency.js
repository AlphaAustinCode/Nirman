const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
    {
        agencyId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        // Master list of valid passbook numbers for this agency
        validPassbooks: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Agency", agencySchema);