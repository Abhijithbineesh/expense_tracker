const mongoose = require('mongoose');

// Define the Expense Schema
const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'gpay', 'credit'], // matching the form options
    }
});

module.exports = mongoose.model('Expense', expenseSchema);




