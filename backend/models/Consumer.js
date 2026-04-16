const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
    agency_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agency',
        required: true
    },
    passbook_number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return v.length === 17;
            },
            message: props => `${props.value} is not a valid 17-digit passbook number!`
        }
    },
    full_name: {
        type: String,
        required: true
    },
    registered_phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    secondary_phone: {
        type: String,
        default: null
    },
    is_registered: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Consumer', consumerSchema);