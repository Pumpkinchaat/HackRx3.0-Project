const express = require("express");
const Router = express.Router();

const { catchAsync } = require("../utils/index");
const { registerUser, loginUser, isLoggedIn } = require("../controllers/auth");

Router.route("/register").post(catchAsync(registerUser));
Router.route("/login").post(catchAsync(loginUser));

module.exports = Router;
