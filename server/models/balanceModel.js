const mongoose = require('mongoose');
const { Schema } = mongoose;

const balanceSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    lastTransaction: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true 
});

// Índices para mejorar el rendimiento
balanceSchema.index({ address: 1 });
balanceSchema.index({ lastTransaction: -1 });

// Método para actualizar balance
balanceSchema.methods.updateBalance = async function(newBalance) {
    this.balance = newBalance;
    this.lastTransaction = Date.now();
    return await this.save();
};

// Método para obtener historial de balance
balanceSchema.methods.getBalanceHistory = async function(startDate, endDate) {
    return await this.model('Balance').find({
        address: this.address,
        lastTransaction: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ lastTransaction: -1 });
};

module.exports = mongoose.model('Balance', balanceSchema);