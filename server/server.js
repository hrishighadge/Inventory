const express = require("express");
const constants = require("./constants");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());

var port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//All Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/product"));
app.use("/api/order", require("./routes/order"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/notification", require("./routes/notification"));

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

app.listen(port, () => {
  console.log(`server started listning on port ${port}!`);
});
