const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrderSchema = new schema({
  buyername: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  shipping_address: {
    type: Object,
    address_line1: {
      type: String,
      required: true,
    },
    address_line2: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
  },
  order_status: {
    type: String,
    required:true,
  },

  total_amount: {
    type: Number,
    required: true,
  },
  payment_details: {
    //to be discussed
    type: Object,
    transaction_id: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    payment_received: {
      type: Boolean,
      required: true,
    },
  },
  products_ordered: [{
    product_id: {type: String,required: true},
    quantity: {type: Number,required: true},
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Orders = mongoose.model("orders", OrderSchema);
