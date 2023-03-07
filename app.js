const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

main()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/make-campground", (req, res) => {
  const camp = new Campground({
    title: "My backyard",
    description: "First campground",
    price: "$0",
  });
  camp.save();
  res.send(camp);
});

app.listen(3000, () => console.log("Serving on port 3000"));
