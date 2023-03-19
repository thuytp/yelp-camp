const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgrounds = require("./routes/campground");
const reviews = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgrounds);

app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

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
