const OrderModel = require('../models/order')
const CartModel = require('../models/cart')
exports.addOrder = (req, res) => {
    // const { cartItems } = req.body;
    const user = req.user._id;
    const { address } = req.body;
    let total = 0;

    CartModel
        .findOneAndDelete({ user: user })
        .populate('items.product', '_id slug price')
        .exec((cError, cCart) => {
            if (cError) {
                return res.status(400).json({ cError })
            }
            if (cCart) {
                let orderItems = [];
                if (cCart.items.length > 0) {
                    cCart.items.map(item => {
                        orderItems.push({
                            productId: item.product._id,
                            quantity: item.quantity,
                            payablePrice: parseInt(item.product.price)

                        })
                        total = total + (item.quantity * parseInt(item.product.price))
                    })
                }
                const orderModal = new OrderModel({
                    user,
                    items: orderItems,
                    address: "60eedaff740f602824758aac",
                    totalAmount: total
                });
                orderModal.save((oError, orderSaved) => {
                    if (orderSaved) {

                        return res.status(200).json({ orderSaved })
                    }
                    if (oError) {
                        return res.status(400).json({ oError })
                    }
                })

            }
        })




}