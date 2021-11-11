const express = require("express");
const router = express.Router();
const { createUser, signin, signout } = require("../controller/user");

router.post("/user/add", createUser);
router.post("/user/signin", signin);
router.post("/user/signout", signout);

module.exports = router;
