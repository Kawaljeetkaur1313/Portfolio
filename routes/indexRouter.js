const express = require("express");
const indexRouter = express.Router();
const path = require("path");
const { indexPage } = require("../controllers/indexController");

indexRouter.get("/", indexPage);

module.exports =  indexRouter;