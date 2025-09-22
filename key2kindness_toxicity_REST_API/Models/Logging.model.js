const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoggingSchema = new Schema({

  timestamp: {
    type: Date,
    required: false
  },
  eventID: {
    type: Number,
    required: false
  },
    eventType: {
    type: String,
    required: false
  },
  taskID: {
    type: Number,
    required: false
  },
  stimuli: {
    type: String,
    required: false
  },
  groupID: {
    type: Number,
    required: false
  },
  userID: {
    type: Number,
    required: false
  },
  toxic: {
    type: Number,
    required: false
  },
    probability: {
    type: Number,
    required: false
  },
    platform: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: false
  }

});

const Logging = mongoose.model('logging', LoggingSchema);
module.exports = Logging;
