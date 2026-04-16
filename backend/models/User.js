const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    consumer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true // Will be hashed via bcrypt
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);