const bcrypt = require("bcryptjs");
const User = require("../models/user");
const constants = require("../constants.js");
const jwt = require("jsonwebtoken");

exports.UserSignup = (req, res) => {
  const { name, email, password } = req.body;
  //simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  //check if user already exists
  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "user already exists" });

    const newUser = new User({
      name,
      email,
      password,
    });
    //create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            constants.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
};

exports.UserLogin = (req, res) => {
  const { email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  //check if dont exist
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User Does Not Exist" });

      //validate user
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ msg: "Invalid Credentials" });
        jwt.sign(
          { id: user.id },
          constants.jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            });
          }
        );
      });
    })
    .catch((err) => {
      res.json({ login: "failure" });
    });
};

//exports.userLogout = (req, res) => {
//  req.session.destroy((err) => {
//    if (err) throw err;
//
//    res.clearCookie("inventory");
//    res.status(200).json({ logout: "Success" });
//  });
//};
