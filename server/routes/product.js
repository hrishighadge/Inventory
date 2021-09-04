const express = require("express");
const router = express.Router();
const { upload } = require("../config/fileupload");

//import middlewares
const authAdmin = require("../middlewares/authAdmin");

//import controller function
const {
  addProduct,
  deleteProducts,
  getProducts,
  getProduct,
  searchProduct,
  updateProduct,
} = require("../controllers/product");

// @route POST api/product
// @desc adds product
// @access admin
router.post("/", authAdmin, upload.array("product_image"), addProduct);

// @route DELETE api/product
// @desc deletes product
// @access admin
router.delete("/:id", authAdmin, deleteProducts);

// @route PUT api/product
// @desc updates product
// @access admin
router.put("/:id", authAdmin, upload.array("product_image"), updateProduct);

// @route GET api/product
// @desc gets all the products
// @access public
router.get("/", getProducts);

// @route GET api/product
// @desc gets product by id
// @access public
router.get("/:id", getProduct);


// @route GET api/product
// @desc search product
// @access public
router.get("/search/:query", searchProduct);

module.exports = router;
