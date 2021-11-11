const mongoose = require('mongoose');
const addressSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 10,
        max: 50,
        trim: true,
    },
    mNumber: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    locality: {
        type: String,
        required: true,
        min: 10,
        max: 50,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        min: 10,
        max: 50,
        trim: true,
    },
    cityDistrict: {
        type: String,
        required: true,
        trim: true,
    },
    addressType: {
        type: String,
        required: true,
        enum: ['home', 'work'],
        trim: true,
    }
}, {
    timestamps: true
});

const userAdressSchema = mongoose.Schema({
    user: {
        ref: "User",
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    address: [addressSchema]
},
    {
        timestamps: true
    });

module.exports=mongoose.model("NewAddress",userAdressSchema);