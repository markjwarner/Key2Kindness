const express = require('express');
const router = express.Router();

const LoggingController = require('../Controllers/Logging.Controller');

//Create a new product
router.post('/', LoggingController.createNewLog);

module.exports = router;