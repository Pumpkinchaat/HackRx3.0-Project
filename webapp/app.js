if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//importing the important packages
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const methodOverride = require("method-override");

//requiring the local resources
const {
  institutionSchema,
  unProcessedReviewSchema,
  processedReviewSchema,
} = require("./models/schemas");

const { ExpressError } = require("./utils/index");

const homeRouter = require("./routes/home");

//connecting the Production and the metadata DB
const connectDB = async () => {
  const metadataDB = await mongoose.createConnection(
    process.env.METADATA_DB_URL
  );
  const supportingDB = await mongoose.createConnection(
    process.env.SUPPORTING_DB_URL
  );
  const productionDB = await mongoose.createConnection(
    process.env.PRODUCTION_DB_URL
  );

  console.log(
    "[INFO] The databased {production / supporting / metadata} has been connected"
  );

  const Institution = metadataDB.model("Institution", institutionSchema);
  const UnProcessedReview = supportingDB.model(
    "UnProcessedReview",
    unProcessedReviewSchema
  );
  const ProcessedReview = productionDB.model(
    "ProcessedReview",
    processedReviewSchema
  );

  return {
    metadataDB,
    supportingDB,
    productionDB,
    Institution,
    UnProcessedReview,
    ProcessedReview,
  };
};

connectDB(); //this will run the connection funciton

const app = express(); //the backend app

//configuring options for EJS {front end}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//getting form data from backend
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//serving the assets in the public folder
app.use(express.static(path.join(__dirname, "/public")));

//loading the res object
app.use((req, res, next) => {
  res.locals.mode = process.env.NODE_ENV;
  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.success = req.success;
  req.success = null;
  res.locals.fail = req.fail;
  req.fail = null;
  next();
});

app.use("/", homeRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError("Sorry , Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serving on port ${process.env.PORT || 3000}`);
});
