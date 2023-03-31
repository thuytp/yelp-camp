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
  for (let i = 0; i < 200; i++) {
    const locationIndex = getRandomInt1000();
    const price = Math.floor(Math.random() * 23);
    const camp = new Campground({
      author: "641c70298cac832edee236c4",
      location: `${cities[locationIndex].city}, ${cities[locationIndex].state}`,
      title: `${titleSample(descriptors)} ${titleSample(places)}`,
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[locationIndex].longitude,
          cities[locationIndex].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur explicabo accusamus quas nihil esse dolorum, debitis voluptatem ipsum ratione dolores doloribus dolor. Perferendis incidunt asperiores, eveniet omnis eum fugit quibusdam.",
      images: [
        {
          url: "https://res.cloudinary.com/dopcvlunb/image/upload/v1679910517/YelpCamp/hoqki8rrc1ef2iwuqzqz.jpg",
          filename: "YelpCamp/hoqki8rrc1ef2iwuqzqz",
        },
        {
          url: "https://res.cloudinary.com/dopcvlunb/image/upload/v1679910519/YelpCamp/zx76jut3efxa7vx9qjye.jpg",
          filename: "YelpCamp/zx76jut3efxa7vx9qjye",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
