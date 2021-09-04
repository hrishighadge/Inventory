const express = require("express");
const router = express.Router();

//import middlewares
const authAdmin = require("../middlewares/authAdmin");

//import controller functions
const {
  getOrders,
  placeOrder,
  updateOrder,
  getOrder,
  searchOrders,
} = require("../controllers/order");

// @route GET api/order
// @desc gets all orders details
// @access admin
router.get("/", authAdmin, getOrders);

// @route GET api/order/search/:query
// @desc gets all orders details
// @access admin
router.get("/search/:query", authAdmin, searchOrders);

// @route GET api/order/:id
// @desc gets all orders details
// @access public
router.get("/:id", getOrder);

// @route POST api/order
// @desc place an order
// @access public
router.post("/", placeOrder);

// @route PUT api/order/:order_id
// @desc update order status
// @access admin
router.put("/:order_id", authAdmin, updateOrder);

module.exports = router;
