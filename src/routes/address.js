const express = require('express');
const router = express.Router();
const { addAddress,removeAddress,getAddress } = require('../controller/address')
const { requiredProfile, requiredUser } = require('../controller/common/auth')
router.post('/address/add', requiredProfile, requiredUser, addAddress);
router.post('/address/remove', requiredProfile, requiredUser, removeAddress);
router.post('/address/get', requiredProfile, requiredUser, getAddress);

module.exports = router;
