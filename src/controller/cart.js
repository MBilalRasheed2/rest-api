const Cart = require('../models/cart');
function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        //you update code here

        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
}
exports.addToCart = (req, res) => {
    const { cartItems } = req.body;
    let promiseArray = [];
    Cart.findOne({ user: req.user._id }).exec((error, cart) => {
        if (error) {
            return res.status(400).json({ error })
        }
        if (cart) {
            req.body.cartItems.forEach((cartItem) => {
                const product = cartItem.product;
                const item = cart.items.find((c) => c.product == product);
                let condition, update;
                if (item) {
                    condition = { user: req.user._id, "items.product": product };
                    update = {
                        $set: {
                            "items.$": cartItem,
                        },
                    };
                } else {
                    condition = { user: req.user._id };
                    update = {
                        $push: {
                            "items": cartItem,
                        },
                    };
                }
                promiseArray.push(runUpdate(condition, update));
            });
            Promise.all(promiseArray)
                .then((response) => res.status(201).json({ response }))
                .catch((error) => res.status(400).json({ error }));
        } else {
            const cartItem = new Cart({ user: req.user._id, items: cartItems });
            cartItem.save((err, data) => {
                if (err) {
                    return res.status(400).json({ err })
                }
                if (data) {
                    return res.status(400).json({ data })
                }
            })
        }
    })


}

exports.getCartItem = (req, res) => {
    const user = req.user._id;
    Cart.findOne({ user: user })
        .populate("items.product", "_id name price productPictures")
        .exec((error, cart) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (cart) {
                let cartItem = {};
                cart.items.forEach(item => {
                    cartItem[item.product._id.toString()] = {
                        _id: item.product._id.toString(),
                        name: item.product.name,
                        price: item.product.price,
                        productPictures: item.product.productPictures,
                        quantity: item.quantity,

                    }
                })
                return res.status(200).json({ cartItem });
            }
        })

}

exports.removeCart = (req, res) => {
    const { _id } = req.body;
    const user = req.user._id;
    Cart.findOneAndUpdate({ user: user }, {
        "$pull": {
            items: {
                product: _id
            }
        }
    }).exec((error, cart) => {
        if (error) {
            return res.status(400).json({ error })
        }
        if (cart) {
            return res.status(200).json({ cart })
        }
    })
}