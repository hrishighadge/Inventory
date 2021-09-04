const constants = require("../constants.js");
const jwt = require("jsonwebtoken");

function authAdmin(req, res, next) {
  const token = req.headers["authorization"];
  //console.log(req.headers);
  //check for token
  if (!token)
    return res.status(401).json({ msg: "No token, Authorisation Denied..." });

  //verify token
  try {
    const decoded = jwt.verify(token, constants.jwtSecret);

    //add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    // console.log(e);
    res.status(401).json({ msg: "Token is not valid" });
  }
}
module.exports = authAdmin;
