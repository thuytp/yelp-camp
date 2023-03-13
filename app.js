const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { campgroundSchema } = require("./schemas");

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

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new.ejs");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show.ejs", { campground });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(req.params.id, { ...campground });
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { err });
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
