const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { userSchema } = require("../models/schemas");

let db;
try {
  db = mongoose.createConnection(process.env.METADATA_DB_URL);
} catch (err) {
  console.log("[INFO] Error connecting to the DB");
}

const User = db.model("User", userSchema);

module.exports.registerUser = async (req, res) => {
  //get the username and password and validate its existance
  const { username, password } = req.body;
  if (!username || !password) {
    req.fail = "Either the password or Username is not present";
    res.redirect("/");
  }

  //generate a new User doc and save it
  const newUser = new User({
    username,
    password: bcrypt.hashSync(password, 12),
  });
  await newUser.save();

  //prepare thee success flash
  req.success = `Welcome ${newUser.username}`;

  //generate a token and setup a cookie for session
  const token = jwt.sign({ _id: newUser._id }, process.env.SECRET);
  res.cookie("Authorization", `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 1000,
  });

  //load the user onto the request body
  req.user = newUser;

  //redirect to homepage
  res.redirect("/");
};

module.exports.loginUser = async (req, res) => {
  //get the username and password and validate its existance
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash("fail", "Either the password or Username is not present");
    res.redirect("/");
  }

  //search if a document with that username exists
  const oldUser = await User.findOne({ username });
  if (!oldUser) {
    req.flash("fail", "The User with the given Username doesnt exists");
    res.redirect("/");
  }

  const compare = bcrypt.compareSync(password, oldUser.password);
  if (!compare) {
    req.flash("fail", "Either the username OR the password was wrong");
    res.redirect("/");
  }

  //this point the password is confirmed
  req.flash("success", "You are now successfully logged in");

  const token = jwt.sign({ _id: oldUser._id }, process.env.SECRET);
  res.cookie("Authorization", `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 1000,
  });
  //now the cookie is also set

  req.user = oldUser;

  //redirecting the user back
  res.redirect("/");
};

module.exports.isLoggedIn = async (req, res, next) => {
  //getting the tokens
  if (!req.cookies.Authorization) {
    req.flash("Please Log In first");
    res.redirect("/");
  }

  const jwtToken = req.cookies.Authorization.split(" ")[1];
  if (!jwtToken) {
    req.flash("Please Log In first");
    res.redirect("/");
  }

  jwt.verify(jetToken, process.env.SECRET, async (err, Obj) => {
    if (err) {
      req.flash("Please Log In first");
      res.redirect("/");
    }

    const user = await Model.findById(Obj._id);
    if (!user) {
      req.flash("Please Log In first");
      res.redirect("/");
    }

    next();
  });
};
