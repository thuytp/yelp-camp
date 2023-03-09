const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
}

main()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show.ejs", { campground });
});

app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  await Campground.create(campground);
  res.redirect("/campgrounds");
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { campground } = req.body;
  await Campground.findByIdAndUpdate(req.params.id, { ...campground });
  res.redirect(`/campgrounds/${req.params.id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

// app.get("/make-campground", (req, res) => {
//   const camp = new Campground({
//     title: "My backyard",
//     description: "First campground",
//     price: "$0",
//   });
//   camp.save();
//   res.send(camp);
// });

app.listen(3000, () => console.log("Serving on port 3000"));
