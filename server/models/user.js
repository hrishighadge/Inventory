const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    default: "",
  },
  user_cart: {
    type: Array,
    default: [],
  },
});

module.exports = Users = mongoose.model("users", UserSchema);
