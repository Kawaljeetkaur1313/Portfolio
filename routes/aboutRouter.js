const express = require("express");
const aboutRouter = express.Router();
const path = require("path");
const { aboutPage } = require("../controllers/aboutController");
 
aboutRouter.get('/', aboutPage);

module.exports =  aboutRouter;