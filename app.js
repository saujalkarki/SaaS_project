// importing required packages
const express = require("express");
const app = express();
require("dotenv").config();
const passport = require("passport");
const { users } = require("./model/index");
const jwt = require("jsonwebtoken");
const generateToken = require("./services/generateToken");
const organizationRoute = require("./routes/organizationRoute");

// setting view engine
app.set("view engine", "ejs");

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
  res.render("home.ejs");
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
      console.log(profile);
      userProfile = profile;
      console.log(userProfile);
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
  async function (req, res) {
    const userGoogleEmail = userProfile.emails[0].value;
    // check if google lay deko email already table ma exists xa ki nae vanerw
    const user = await users.findOne({
      where: {
        email: userGoogleEmail,
      },
    });
    if (user) {
      // token generate garney
      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/organization");
    } else {
      // register the user
      const user = await users.create({
        email: userGoogleEmail,
        googleId: userProfile.id,
        username: userProfile.displayName,
      });

      const token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/organization");
    }
  }
);

// routes middlewares
app.use("/", organizationRoute);

// PORT connection
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server has started at port ${PORT}`);
});
