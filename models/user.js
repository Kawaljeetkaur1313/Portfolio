const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, 
    required: true, // Ensures username gets stored
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: String,
  lastName: String,
  roles: {
    type: Array,
    default: ["user"],
  },
});

// Use email as the username
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", userSchema);
module.exports = User;
