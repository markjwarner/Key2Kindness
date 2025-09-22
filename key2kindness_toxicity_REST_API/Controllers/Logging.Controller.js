const createError = require('http-errors');
const mongoose = require('mongoose');

const Logging = require('../Models/Logging.model');

module.exports = {

  createNewLog: async (req, res, next) => {
    try {
      const log = new Logging(req.body);
      const result = await log.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }

  }

   
};
