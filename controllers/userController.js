const User = require("../models/user");
const UserData = require("../data/UserData");
const _userData = new UserData();
const passport = require("passport");
const RequestService = require("../services/RequestService");

// Display registration form
exports.Register = async function (req, res) {
  const reqInfo = RequestService.reqHelper(req);
  res.render("register", { errorMessage: "", user: {}, reqInfo: reqInfo });
};

// Handle registration form submission
exports.RegisterUser = async function (req, res) {
  console.log("register post");
  const { firstName, lastName, username, password, passwordConfirm } = req.body;

  // Ensure email is valid
  if (!username) {
    const reqInfo = RequestService.reqHelper(req);
    return res.render("register", {
      user: { firstName, lastName, username },
      errorMessage: "Email is required.",
      reqInfo: reqInfo,
    });
  }

  if (password !== passwordConfirm) {
    const reqInfo = RequestService.reqHelper(req);
    return res.render("register", {
      user: { firstName, lastName, username },
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo,
    });
  }

  // Create the user object without setting 'username' manually
  const newUser = new User({
    username,
    email: username, 
    firstName,
    lastName,
  });

  console.log("Registering new user:", newUser);

  // Register user with passport-local-mongoose
  User.register(newUser, password, function (err, account) {
    if (err) {
      console.error("Registration error:", err.message);
      const reqInfo = RequestService.reqHelper(req);
      return res.render("register", {
        user: newUser,
        errorMessage: err.message,
        reqInfo: reqInfo,
      });
    }

    console.log("User registered:", account);

    // Authenticate and redirect to home page
    passport.authenticate("local")(req, res, function () {
      res.redirect("/"); // Redirect to home page after successful registration
    });
  });
};

// Display login form
exports.Login = async function (req, res) {
  const reqInfo = RequestService.reqHelper(req);
  const errorMessage = req.query.errorMessage;
  res.render("login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
  });
};

// Handle login submission
exports.LoginUser = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login?errorMessage=Invalid login.");

    req.logIn(user, async (err) => {
      if (err) return next(err);

      // Fetch roles from UserData and set them in the session
      const roles = await _userData.getRolesByUsername(user.username);
      req.session.roles = roles; // Store roles in session
      req.session.save(); // Ensure the session is saved immediately after updating roles

      return res.redirect("/"); // Redirect to the homepage after login
    });
  })(req, res, next);
};


// Logout and redirect to login screen
exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log("Logout error:", err);
      return next(err);
    }

    const reqInfo = RequestService.reqHelper(req);
    
    res.redirect("/");

    res.render("login", {
      user: {},
      isLoggedIn: false,
      errorMessage: "",
      reqInfo: reqInfo,
    });
  });
};

// Display profile page
exports.Profile = async function (req, res) {
  const reqInfo = RequestService.reqHelper(req);

  if (!reqInfo.authenticated) {
    return res.redirect(
      "/login?errorMessage=You must be logged in to view this page."
    );
  }

  // Fetch user roles and info
  const roles = await _userData.getRolesByUsername(reqInfo.username);
  req.session.roles = roles;
  reqInfo.roles = roles;

  const userInfo = await _userData.getUserByUsername(reqInfo.username);

  res.render("profile", {
    reqInfo: reqInfo,
    userInfo: userInfo,
  });
};
