const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const db = async () => {
  mongoose.connect("mongodb://localhost:27017/yelp-camp");
};

const titleSample = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInt1000 = () => Math.floor(Math.random() * 1000);

db()
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const locationIndex = getRandomInt1000();
    const camp = new Campground({
      location: `${cities[locationIndex].city}, ${cities[locationIndex].state}`,
      title: `${titleSample(descriptors)} ${titleSample(places)}`,
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
