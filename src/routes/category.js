const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const shortId = require('shortid');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortId.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage });
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require("../controller/category");
const { requiredProfile, requiredAdmin } = require("../controller/common/auth");
router.post("/category/add", requiredProfile, requiredAdmin, upload.single('categoryImage'), createCategory);
router.post("/category/update", requiredProfile, requiredAdmin, upload.single('categoryImage'), updateCategory);
router.get("/category/get", getAllCategories);
router.post("/category/delete", deleteCategory);


module.exports = router;
