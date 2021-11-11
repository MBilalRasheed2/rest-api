const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortId = require("shortid");
const { productCreate,
    getProductBySlug,
    getProductsByCategory,
    getProductsBySubCategory,
    getProductUpdate,
    getProductDelete,
    getSingleProduct,
    getAllProducts } = require("../controller/product");
const { requiredProfile, requiredAdmin } = require("../controller/common/auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, shortId.generate() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

router.get(
    "/product/get/all", requiredProfile, requiredAdmin,
    getAllProducts
);
router.post(
    "/product/create", requiredProfile, requiredAdmin,
    upload.array("picture"),
    productCreate
);
router.post(
    "/product/update", requiredProfile,
    requiredAdmin,
    upload.array("picture"),
    getProductUpdate
);
router.post(
    "/product/:slug",
    getProductBySlug
);
router.post(
    "/product/getmain/:category",
    getProductsByCategory
);
router.post(
    "/product/getsub/:category",
    getProductsBySubCategory
);
router.post(
    "/product/delete/:deleteId",
    requiredProfile, requiredAdmin, getProductDelete
);
router.post(
    "/product/get/:productId", getSingleProduct
);

module.exports = router;
