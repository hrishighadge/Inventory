const express = require("express");
const router = express.Router();

//import middlewares
const authAdmin = require("../middlewares/authAdmin");

//import controller functions
const {
  getNotification,
  markNotification,
} = require("../controllers/notification");

// @route GET api/order
// @desc gets all orders details
// @access admin
router.get("/", authAdmin, getNotification);

// @route GET api/order
// @desc gets all orders details
// @access admin
router.put("/", authAdmin, markNotification);

module.exports = router;
