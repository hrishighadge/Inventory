const mongoose = require("mongoose");
const schema = mongoose.Schema;

const NotificationSchema = new schema({
  message: {
    type: String,
    required: true,
  },
  orderID:{
    type: String,
  },
  markAsRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Orders = mongoose.model("notification", NotificationSchema);