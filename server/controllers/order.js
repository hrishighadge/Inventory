const Orders = require("../models/orders");
const Products = require("../models/products");
const Notification = require("../models/notification");
const sendEmail = require("../sendmail");
const stocksTransaction = require("./updateStock");

const updateStocks = function (products) {
  // console.log("inside", products);
  products.forEach((product) => {
    Products.findOneAndUpdate(
      { _id: product.product_id },
      {
        $inc: { stock: -product.quantity },
      },
      { returnNewDocument: true }
    ).then((prod) => {
      // console.log(product);
      const transaction = {
        part_number: prod.part_number,
        type: "out",
        client: "Online Checkout",
        quantity: product.quantity,
        stock_balance: prod.stock - product.quantity,
      };
      stocksTransaction(transaction);
    });
  });
};
exports.getOrders = (req, res) => {
  Orders.find()
    .sort({ timestamp: -1 })
    .then((orders) => res.json(orders))
    .catch((err) => res.sendStatus(500));
};

exports.searchOrders = (req, res) => {
  const Query = `${req.params.query.charAt(0).toUpperCase()}${req.params.query
    .substr(1)
    .toLowerCase()}`;
  if (
    Query == "Processed" ||
    Query == "Pending" ||
    Query == "Rejected" ||
    Query == "Delivered" ||
    Query == "Shipped" ||
    Query == "En-route"
  ) {
    Orders.find({ order_status: Query })
      .then((orders) => res.json(orders))
      .catch((err) => res.json(0));
  } else {
    Orders.find({ _id: req.params.query })
      .then((orders) => res.json(orders))
      .catch((err) => res.json(0));
  }
  //console.log(Query, typeof Query);
};
exports.getOrder = (req, res) => {
  Orders.findById(req.params.id)
    .then((order) => res.json(order))
    .catch((err) => res.json(0));
};

exports.placeOrder = (req, res) => {
  // console.log(JSON.stringify(req.body))
  // console.log(req.body);
  const newOrder = new Orders({
    buyername: req.body.buyername,
    phone: req.body.phone,
    email: req.body.email,
    shipping_address: req.body.shipping_address,
    order_status: "Pending",
    total_amount: req.body.total_amount,
    payment_details: req.body.payment_details,
    products_ordered: req.body.products_ordered,
  });
  newOrder
    .save()
    .then((order) => {
      // console.log(order);
      Notification({
        message: "You have a new order",
        orderID: order._id,
      }).save();
      sendEmail(order.buyername, order.email, order._id, order.order_status);
      res.status(200).json(order);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500);
    });
};

exports.updateOrder = (req, res) => {
  Orders.findById(req.params.order_id).then((order) => {
    sendEmail(order.buyername, order.email, order._id, req.body.status);
    if (order.order_status == "Pending" && req.body.status == "Processed") {
      console.log("inside");
      updateStocks(order.products_ordered);
    }
    Orders.updateOne(
      { _id: req.params.order_id },
      {
        $set: {
          order_status: req.body.status,
        },
      }
    )
      .then(() => res.status(200).json({ sucess: true }))
      .catch((err) => {
        res.status(500).json({ success: false });
      });
  });
};
