const mongoose = require("mongoose");
const Review = require("./review");

const CampgroundSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imageUrl: String,
  description: String,
  location: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc.reviews) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
