// schemas/TrackingSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackingSchema = new Schema({
    // Dirección ETH que se está rastreando
    address: {
        type: String,
        required: true,
        index: true
    },
    // Hash de la transacción
    hash: {
        type: String,
        required: true,
        unique: true
    },
    // Dirección del remitente
    from: {
        type: String,
        required: true
    },
    // Dirección del destinatario
    to: {
        type: String,
        required: true
    },
    // Valor de la transacción en Wei
    value: {
        type: String,
        required: true
    },
    // Timestamp de la transacción
    timestamp: {
        type: Number,
        required: true,
        index: true
    },
    // Gas usado
    gasUsed: {
        type: Number,
        required: true
    },
    // Precio del gas
    gasPrice: {
        type: String,
        required: true
    },
    // Estado de la transacción (0=fallida, 1=exitosa)
    status: {
        type: Number,
        enum: [0, 1],
        required: true
    }
}, {
    timestamps: true, // Añade createdAt y updatedAt
    versionKey: false // Elimina el campo __v
});

// Índice compuesto para búsquedas por dirección y timestamp
trackingSchema.index({ address: 1, timestamp: -1 });

module.exports = mongoose.model('Tracking', trackingSchema);