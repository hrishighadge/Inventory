const Stocks = require("../models/stocks");

const stocksTransaction = function (transaction) {
  const newTransaction = new Stocks(transaction);
  newTransaction
    .save()
    .then((stock) => {
      console.log(stock);
    })
    .catch((err) => {
      console.log("stock didn't get tracked ", err);
    });
};

module.exports = stocksTransaction;
