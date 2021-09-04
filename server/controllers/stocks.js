const Stocks = require("../models/stocks");
const Products = require("../models/products");

exports.downloadReport = (req, res) => {
  let end_date = new Date(req.params.end_date);
  end_date.setDate(end_date.getDate() + 1);
  Stocks.aggregate([
    {
      $match: {
        timestamp: {
          $lte: end_date,
          $gte: new Date(req.params.start_date),
        },
      },
    },
    {
      $group: {
        _id: "$part_number",
        result: {
          $push: {
            type: "$type",
            qty: "$quantity",
          },
        },
      },
    },
    {
      $project: {
        res: {
          $reduce: {
            input: "$result",
            initialValue: {
              in_qty: 0,
              out_qty: 0,
            },
            in: {
              in_qty: {
                $cond: {
                  if: {
                    $eq: ["$$this.type", "in"],
                  },
                  then: {
                    $add: ["$$value.in_qty", "$$this.qty"],
                  },
                  else: {
                    $add: ["$$value.in_qty", 0],
                  },
                },
              },
              out_qty: {
                $cond: {
                  if: {
                    $eq: ["$$this.type", "out"],
                  },
                  then: {
                    $add: ["$$value.out_qty", "$$this.qty"],
                  },
                  else: {
                    $add: ["$$value.out_qty", 0],
                  },
                },
              },
            },
          },
        },
      },
    },
  ])
    .then((overview) => {
      Products.find(
        {},
        { part_number: 1, product_name: 1, stock: 1, _id: 0 }
      ).then((product) => {
        console.log(product);
        Stocks.aggregate([
          {
            $match: {
              timestamp: {
                $lte: end_date,
                $gte: new Date(req.params.start_date),
              },
              type: "out",
              client: {
                $nin: ["Admin", "Online Checkout"],
              },
            },
          },
          {
            $group: {
              _id: {
                part_number: "$part_number",
                client: "$client",
              },
              out_qty: {
                $sum: "$quantity",
              },
            },
          },
        ]).then((summary) => {
          res.json({
            overview,
            product,
            summary,
          });
        });
      });
    })
    .catch((err) => {
      console.log("err", err);
    });
};
