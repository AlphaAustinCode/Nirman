const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    secondaryPhone: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    passbookNumber: { type: String, required: true },
    address: { type: String, required: true },
    trustScore: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
