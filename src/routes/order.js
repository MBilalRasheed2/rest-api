const express = require("express");

const router = express.Router();

const { requiredProfile, requiredUser } = require("../controller/common/auth");

const { addOrder } = require("../controller/order");

router.post("/order/add", requiredProfile, requiredUser, addOrder);



module.exports = router;
