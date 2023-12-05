// importing required packages
const express = require("express");
const app = express();
require("dotenv").config();
const passport = require("passport");

// Middlewares
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
// in a callback function cb the first argument is triggered on error and second on success
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// database connection
require("./model/index");

app.get("/", (req, res) => {
  res.send("Connected SuccessFully");
});

// google login here
let userProfile;
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
  }),
  function (req, res) {
    res.send("Logged in Successfully");
  }
);

// PORT connection
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server has started at port ${PORT}`);
});
