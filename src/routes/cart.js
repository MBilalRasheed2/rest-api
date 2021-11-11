const express = require("express");
const router = express.Router();

const { requiredProfile, requiredUser } = require("../controller/common/auth");
const { addToCart, getCartItem, removeCart } = require("../controller/cart");
router.post("/cart/add", requiredProfile, requiredUser, addToCart);
router.post("/cart/get", requiredProfile, requiredUser, getCartItem);
router.post("/cart/remove", requiredProfile, requiredUser, removeCart);


module.exports = router;
