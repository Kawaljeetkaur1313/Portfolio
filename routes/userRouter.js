const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController");

// GET register page
userRouter.get("/register", UserController.Register);

// Handle register form submission
userRouter.post("/register", UserController.RegisterUser);

// GET login page
userRouter.get("/login", UserController.Login);

// Handle login form submission
userRouter.post("/login", UserController.LoginUser);

//GET logout
userRouter.post("/logout",UserController.Logout);

//GET profile page
userRouter.get("/profile",UserController.Profile);

module.exports = userRouter;
