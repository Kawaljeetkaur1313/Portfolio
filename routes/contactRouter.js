const express = require('express');
const contactRouter = express.Router();
const path = require("path");
const { getContact, postContact } = require('../controllers/contactController');

contactRouter.get('/', getContact);
  
contactRouter.post('/', postContact);

module.exports = contactRouter;