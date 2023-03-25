const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const campgroundsRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

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

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/user", async (req, res) => {
  const user = new User({
    email: "test@email.com",
    username: "something",
  });
  const newUser = await User.register(user, "monkey");
  res.send(newUser);
});

app.use("/campgrounds", campgroundsRoutes);

app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

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
