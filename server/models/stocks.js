const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProdStockSchema = new schema({
  part_number: {
    type: String,
    required: true,
  },
  type: {
    //in or out
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  stock_balance: {
    type: Number,
    required: true,
  },
});

module.exports = Users = mongoose.model("stocks", ProdStockSchema);
