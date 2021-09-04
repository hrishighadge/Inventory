const Products = require("./models/products");
const fs = require("fs");
const constants = require("./constants");
const path = require("path");
var parse = require("csv-parse");
const mongoose = require("mongoose");
const stocksTransaction = require("./controllers/updateStock");

var csvData = [];
fs.createReadStream("./inventory.csv")
  .pipe(parse({ delimiter: "," }))
  .on("data", function (csvrow) {
    console.log(csvrow);
    //do something with csvrow
    csvData.push(csvrow);
  })
  .on("end", function () {
    //do something with csvData

    mongoose
      .connect(constants.uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("CONNECTED TO DATABASE!");
      })
      .catch(() => {
        console.log("DATABASE CONNECTION FAILED!");
      });
    for (i = 0; i < csvData.length; i++) {
      let img_path = "uploads/default-product-img.png";
      let sp = csvData[i][3] * 1.4;
      console.log(csvData[i][3]);
      const newProduct = new Products({
        part_number: csvData[i][1],
        product_name: csvData[i][0],
        product_image: img_path,
        stock: csvData[i][2],
        unit_cost: csvData[i][3],
        selling_price: sp.toFixed(2),
      });
      // console.log(newProduct);

      newProduct
        .save()
        .then((product) => {
          const transaction = {
            part_number: product.part_number,
            type: "in",
            client: "New Product",
            quantity: product.stock,
            stock_balance: product.stock,
          };
          stocksTransaction(transaction);
          res.json(product);
        })
        .catch((err) => console.log(err));
    }
    //   console.log(csvData);
  });
