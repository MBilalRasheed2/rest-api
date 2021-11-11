const AddressModel = require('../models/address');

exports.addAddress = (req, res) => {
    const user = req.user._id;
    const {
        name,
        mNumber,
        pinCode,
        locality,
        addressAdd,
        cityDistrict,
        addressType,
    } = req.body;


    AddressModel.findOneAndUpdate({ user: user }, {
        "$push": {
            address: {
                name,
                mNumber,
                pinCode,
                locality,
                address: addressAdd,
                cityDistrict,
                addressType,
            }
        }
    }, {
        new: true, upsert: true
    }).exec((error, address) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (address) {
            return res.status(200).json({ address });
        }
    })

}
exports.removeAddress = (req, res) => {
    const user = req.user._id;
    const {
        _id
    } = req.body;


    AddressModel.findOneAndUpdate({ user: user }, {
        "$pull":
            { address: { _id } }

    }).exec((error, address) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (address) {
            return res.status(200).json({ address });
        }
    })

}
exports.getAddress = (req, res) => {
    const user = req.user._id;
    const {
        _id
    } = req.body;


    AddressModel.findOne({ user: user }).exec((error, address) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (address) {
            return res.status(200).json({ address });
        }
    })

}