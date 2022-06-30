const mongoose = require("mongoose");
const {
  institutionSchema,
  processedReviewSchema,
} = require("../models/schemas");

module.exports.getAllInstitution = async (req, res) => {
  let finalLocation;
  const { location } = req.query;
  if (!location) finalLocation = "Dehradun";
  else finalLocation = location;

  const metadataDB = mongoose.createConnection(process.env.METADATA_DB_URL);
  const Institution = metadataDB.model("Institution", institutionSchema);

  const productionDB = mongoose.createConnection(process.env.PRODUCTION_DB_URL);
  const ProcessedReview = productionDB.model(
    "ProcessedReview",
    processedReviewSchema
  );

  const institutions = await Institution.find({
    cityName: finalLocation,
  }).populate("review", "", ProcessedReview);

  const finalRatings = [];

  for (let i = 0; i < institutions.length; i++) {
    const institution = institutions[i];

    let counter = 0;
    let sum = 0;
    for (let i = 0; i < institution.review.length; i++) {
      sum += institution.review[i].rating;
      counter++;
    }

    const finalRating = Math.round((sum / counter) * 10) / 10;
    if (!finalRating) finalRatings.push("Not Determined");
    else finalRatings.push(`${finalRating}`);
  }

  res.render("index", { institutions, finalRatings });
};

module.exports.getInstitution = async (req, res) => {
  const { institutionID } = req.params;

  const metadataDB = mongoose.createConnection(process.env.METADATA_DB_URL);
  const Institution = metadataDB.model("Institution", institutionSchema);

  const productionDB = mongoose.createConnection(process.env.PRODUCTION_DB_URL);
  const ProcessedReview = productionDB.model(
    "ProcessedReview",
    processedReviewSchema
  );

  let institution = await Institution.findOne({
    _id: institutionID,
  }).populate("review", "", ProcessedReview);

  let counter = 0;
  let sum = 0;
  for (let i = 0; i < institution.review.length; i++) {
    sum += institution.review[i].rating;
    counter++;
  }

  const finalRating = Math.round((sum / counter) * 10) / 10;

  res.render("hospital", { institution, finalRating });
};

module.exports.saveReview = async (req, res) => {
  const metadataDB = mongoose.createConnection(process.env.METADATA_DB_URL);
  const Institution = metadataDB.model("Institution", institutionSchema);

  const productionDB = mongoose.createConnection(process.env.PRODUCTION_DB_URL);
  const ProcessedReview = productionDB.model(
    "ProcessedReview",
    processedReviewSchema
  );

  const { institutionID } = req.params;

  const institution = await Institution.findOne({ _id: institutionID });

  const { reviewerName, reviewText, rating } = req.body;
  const newReview = new ProcessedReview({
    reviewerName,
    reviewText,
    rating,
    domain: "Self",
    institutionID: institutionID,
  });

  await newReview.save();

  const oldReview = await ProcessedReview.findOne({
    reviewerName,
    reviewText,
    rating,
    domain: "Self",
    institutionID: institutionID,
  });

  institution.review.push(oldReview._id);

  await Institution.updateOne(
    { _id: institutionID },
    {
      review: institution.review,
    }
  );

  res.redirect(("/" + institutionID));
};
