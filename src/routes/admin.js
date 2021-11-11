const express = require("express");
const router = express.Router();
const { createAdmin, signin, signout } = require("../controller/admin");

router.post("/admin/add", createAdmin);
router.post("/admin/signin", signin);
router.post("/admin/signout", signout);

module.exports = router;
