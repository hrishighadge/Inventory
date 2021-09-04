const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create schema
const ProductSchema = new schema({
  part_number: {
    type: String,
    required: true,
    trim: true,
  },
  product_description: {
    type: String,
    trim: true,
  },
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  product_image: {
    type: String,
    default: "uploads/default-product-img.png", //path of default image
  },
  prod_details: {
    type: Array,
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    minimum: 0,
  },
  unit_cost: {
    type: Number,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Products = mongoose.model("products", ProductSchema);
