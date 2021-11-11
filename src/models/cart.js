const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "NewProduct",
                required: true
            },
            quantity: {
                type: Number, required: true
            }
        }
    ]
});

module.exports = mongoose.model("NewCart", cartSchema);