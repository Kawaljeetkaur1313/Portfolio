const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");
const aboutRouter = require("./routes/aboutRouter");
const projectRouter = require("./routes/projectRouter");
const contactRouter = require("./routes/contactRouter");

const app = express();
const PORT = 3000;

const cors = require('cors');
const mongoose  = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const db = mongoose.connection;

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));

// Set up session management
app.use(
  require("express-session")({
    secret: "a long time ago in a galaxy far far away",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const RequestService = require('./services/RequestService');

app.use((req, res, next) => {
  const reqInfo = RequestService.reqHelper(req);
  
  res.locals.authenticated = reqInfo.authenticated;
  res.locals.username = reqInfo.username;
  res.locals.roles = reqInfo.roles ;
  res.locals.rolePermitted = reqInfo.rolePermitted;
  next();
});



// tell Express where to find our templates (views)
app.set("views", path.join(__dirname, "views"));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Routes
app.use("/", indexRouter);
app.use(userRouter);
app.use("/about", aboutRouter);
app.use("/projects", projectRouter);
app.use("/contact", contactRouter);

// 404 Handler
app.use((req, res) => {
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
