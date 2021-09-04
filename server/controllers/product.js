const Products = require("../models/products");
const fs = require("fs");
const path = require("path");
const stocksTransaction = require("./updateStock");

exports.addProduct = (req, res) => {
  //console.log(req.body);
  let img_path = "uploads/default-product-img.png";
  if (req.files.length !== 0) {
    img_path = `uploads/${req.files[0].filename}`;
  }
  const newProduct = new Products({
    part_number: req.body.part_number,
    product_description:
      req.body.product_description !== "null"
        ? req.body.product_description
        : "",
    product_name: req.body.product_name,
    product_image: img_path,
    prod_details: JSON.parse(req.body.prod_details),
    stock: JSON.parse(req.body.stock),
    unit_cost: JSON.parse(req.body.unit_cost),
    selling_price: JSON.parse(req.body.selling_price),
  });
  // console.log(newProduct);

  newProduct
    .save()
    .then((product) => {
      if (product.stock > 0) {
        const transaction = {
          part_number: product.part_number,
          type: "in",
          client: "New Product",
          quantity: product.stock,
          stock_balance: product.stock,
        };
        stocksTransaction(transaction);
      }
      res.json(product);
    })
    .catch((err) => console.log(err));
};

exports.deleteProducts = (req, res) => {
  // console.log(JSON.parse(req.params.id));
  // res.json({ success: true });

  Products.updateMany(
    {
      _id: { $in: JSON.parse(req.params.id)["id"] },
    },
    { is_deleted: true }
  )
    .then((item) => res.json({ success: true }))
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
};

exports.updateProduct = (req, res) => {
  var update = {};
  if (req.files.length !== 0) {
    Products.find({ _id: req.params.id }, { product_image: 1 }).then((prod) => {
      //console.log(prod);
      if (prod[0].product_image !== "uploads/default-product-img.png") {
        fs.unlink(
          path.join(__dirname, "../", `/${prod[0].product_image}`),
          (err) => {
            if (err) throw err;
            // console.log("file deleted");
          }
        );
      }
    });
    update["product_image"] = `uploads/${req.files[0].filename}`;
  }
  //console.log(req.files);
  for (const [key, value] of Object.entries(req.body)) {
    if (value !== "null") {
      if (
        key === "prod_details" ||
        key === "stock" ||
        key === "selling_price" ||
        key === "unit_cost"
      ) {
        update[key] = JSON.parse(value);
      } else if (key !== "product_image") {
        update[key] = value;
      }
    }
  }
  // console.log(update);
  Products.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: update,
    },
    { returnNewDocument: true }
  )
    .then((product) => {
      // console.log(product);
      const stockUpdate = update.stock - product.stock;
      // console.log(stockUpdate);
      if (stockUpdate != 0 && update.stock >= 0) {
        const transaction = {
          part_number: product.part_number,
          type: stockUpdate > 0 ? "in" : "out",
          client:
            req.body.inputValue != "" && stockUpdate < 0
              ? `${req.body.inputValue
                  .charAt(0)
                  .toUpperCase()}${req.body.inputValue.substr(1).toLowerCase()}`
              : "Admin",
          quantity: Math.abs(stockUpdate),
          stock_balance: update.stock,
        };
        stocksTransaction(transaction);
      }
      res.status(200).json({ sucess: true });
    })
    .catch((err) => {
      res.json({ success: false });
    });
};

exports.getProducts = (req, res) => {
  Products.find({ is_deleted: { $ne: true } })
    .sort({ register_date: -1 })
    .then((products) => res.json(products))
    .catch((err) => res.sendStatus(500));
};

exports.getProduct = (req, res) => {
  var id = JSON.parse(req.params.id)["id"];
  Products.find({
    _id: { $in: id },
  })
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

exports.searchProduct = (req, res) => {
  Products.find({
    $or: [
      {
        part_number: {
          $regex: req.params.query,
          $options: "i",
        },
      },
    ],
    is_deleted: false,
  })
    .then((articles) => res.json(articles))
    .catch((err) => res.sendStatus(500));
};
