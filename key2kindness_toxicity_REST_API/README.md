# RESTful API

This is a RESTful API built on Node.js and MongoDB. It is for the social research study platform key2kindness

Mongodb is required to be installed for this to work

to run:
npm install
npm start

The model currently allows for the following datatypes: 

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