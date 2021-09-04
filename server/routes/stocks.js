const express = require("express");
const router = express.Router();

//import middlewares
const authAdmin = require("../middlewares/authAdmin");

//import controller functions
const { downloadReport } = require("../controllers/stocks");

router.get("/:start_date/:end_date", authAdmin, downloadReport);
module.exports = router;
