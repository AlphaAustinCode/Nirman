const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
    agencyCode: { type: String, required: true, unique: true },
    agencyName: { type: String, required: true }
});

module.exports = mongoose.model('Agency', AgencySchema);
