const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true }
});

const portfolioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stocks: [stockSchema]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
