const express = require("express");
const Router = express.Router();

const { catchAsync } = require("../utils/index");
const {
  getAllInstitution,
  getInstitution,
  saveReview,
} = require("../controllers/home");

Router.route("/").get(catchAsync(getAllInstitution));

Router.route("/:institutionID").get(catchAsync(getInstitution));

Router.route("/:institutionID/review").post(catchAsync(saveReview));

module.exports = Router;
