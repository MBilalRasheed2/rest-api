const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [
        {
            productId: {
                ref: "NewProduct",
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true

            },
            payablePrice: {
                type: Number,
                required: true
            }
        }
    ],
    address: {
        ref: "NewAddress",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("NewOrder", orderSchema);