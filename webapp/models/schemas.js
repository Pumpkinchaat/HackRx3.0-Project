/**
 * We won't be exporting models cause we are using multiple DBs,
 * so model for each one would be needed to define seperately
 */

const { Schema, model } = require("mongoose");

module.exports.institutionSchema = new Schema({
  name: String,
  address: String,
  cityName: String,
  type: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProcessedReview",
    },
  ],
});

module.exports.unProcessedReviewSchema = new Schema({
  reviewerName: String,
  reviewText: String,
  domain: String,
  institutionID: String,
});

module.exports.processedReviewSchema = new Schema({
  reviewerName: String,
  reviewText: String,
  domain: String,
  rating: Number,
  institutionID: String,
});

module.exports.userSchema = new Schema({
  username: {
    type: String,
    unique: [true, "The Username needs to be unique"],
    required: [true, "The Username is required"],
  },
  password: {
    type: String,
    required: [true, "The Password is required"],
  },
});
