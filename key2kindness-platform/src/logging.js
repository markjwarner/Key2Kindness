import {loggedData} from "./pages/LoginPage";

// using axios here for the HTTPS requests.
import axios from 'axios';

//The url of our logging RESTful API
export const API_URL =  process.env.REACT_APP_API_URL;
//  "http://localhost:4000/logging";

let lastLogTime = 0;

//function is exported so it can be accessed throughout the app
export async function postLog(eventData){
    //timestamp is generated for the logged event
    let timestamp = new Date();
    timestamp = timestamp.getTime();

    const data = {
      timestamp: eventData.timestamp,
      eventID: eventData.eventID,
      eventType: eventData.eventType,
      stimuli: eventData.stimuli,
      groupID: eventData.groupID,
      userID: eventData.userID,
      toxic: eventData.toxic,
      probability: eventData.probability,
      message: eventData.message,
      platform: eventData.platform,
      stimuli: eventData.stimuli,
      insult_prob: eventData.insult_prob,
      threat_prob: eventData.threat_prob,
      severetoxicity_prob: eventData.severetoxicity_prob,
      identityattack_prob: eventData.identityattack_prob,
      profanity_prob: eventData.profanity_prob,
    };

    axios
      .post(API_URL, data)
      .then(res => console.log(res))
      .catch(err => console.log(err));

  };