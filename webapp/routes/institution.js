const express = require("express");
const Router = express.Router();

const { catchAsync } = require("../utils/index");

Router.route("/:institution_id");

module.exports = Router;
