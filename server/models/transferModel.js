const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        lowercase: true
    },
    to: {
        type: String,
        required: true,
        lowercase: true
    },
    amount: {
        type: String,
        required: true
    },
    txHash: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transfer', transferSchema);