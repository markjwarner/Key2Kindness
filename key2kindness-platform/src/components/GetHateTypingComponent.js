// src/components/App.js

import React from "react";
import { postLog } from "../logging";
import { group, id, platform, getCachedIds } from "../pages/LoginPage";
import { TOXICITY_THRESHOLD} from "./TaskComponent";
// using axios here for the HTTPS requests.
import axios from 'axios';
import MessageTimerComponent from "./MessageTimerComponent";
const dotenv = require('dotenv').config();

// the lastString checks the current input into the text field. 
// This is used in the render to avoid the getToxicity function being called for no reason.
let lastString;
//variables to store the response from the API
let insult;
let threat;
let severe_toxicity;
let identity_attack;
let profanity;

//The base url of the API
export const API_URL = 
 "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + process.env.REACT_APP_API_KEY
 console.log(API_URL)

class GetHateTypingComponent extends React.Component {

  constructor(props) {
    super(props);
    var interventionLogged = localStorage.getItem('interventionLogged') === null ? false : JSON.parse(localStorage.getItem("interventionLogged"));

    this.state = {
      prob: 0.0,
      insult: 0.0,
      threat: 0.0,
      severe_toxicity: 0.0,
      identity_attack: 0.0,
      profanity: 0.0,
      HateStatus: "not hate",
      interventionType: Number(group),
      interventionLogged: interventionLogged
    };

  }


  getStyle = (props) => {
    let returnVal = props.showHide ? { display: 'flex' } : { display: 'none' };
    return returnVal;
  };
  getProb = () => { return this.state.prob } //returns the toxicity score

  getToxicity = async (comment) => {
    await axios.post(API_URL, {
      // below is the required input for the perspective API
      comment: {
        text: comment,
      },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {},
        INSULT: {},
        THREAT: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        PROFANITY: {}

      }
    })
      // axios uses.then() to read the response into a variable (here that's names response)
      .then(response => {

        // the atributescores inside the response are read into intends (i.e. toxicity, insult, threat)
        const intents = response.data.attributeScores;
        var updateHateData = this.props.updateHateData;
        let eventType;
        this.state.HateStatus = (TOXICITY_THRESHOLD - intents['TOXICITY'].summaryScore.value) < 0 ? "hate" : "not hate"

        // Previosly been logged
        if (this.state.interventionLogged === false) {
          
          if (this.state.HateStatus === "hate") { // Hateful and  NOT previously logged
            eventType = "intervention"
            this.setState({
              interventionLogged: true,
            }); 
          }   
          else { // NOT hateful NOT previously logged
            eventType = "hate-monitor"
          }
        }
        // Previously logged
        else {
          // Hateful, Previously logged
          if (this.state.HateStatus === "hate") {
            eventType = "hate-monitor"
          }
          // NOT Hateful, Previously logged
          else {
            eventType = "hate-monitor"
            this.setState({
              interventionLogged: false,
            }); 
          }
        }

        console.log(eventType)

        updateHateData('prob', intents['TOXICITY'].summaryScore.value)
        updateHateData('insult', intents['INSULT'].summaryScore.value)
        updateHateData('threat', intents['THREAT'].summaryScore.value)
        updateHateData('severe_toxicity', intents['SEVERE_TOXICITY'].summaryScore.value)
        updateHateData('identity_attack', intents['IDENTITY_ATTACK'].summaryScore.value)
        updateHateData('profanity', intents['PROFANITY'].summaryScore.value)
        updateHateData('HateStatus', this.state.HateStatus)

        //log the state on server
        let uniqueID = new Date().getTime();
        postLog({
          "timestamp": uniqueID,
          "eventID": 2,
          "eventType": eventType,
          "groupID": group,
          "userID": id,
          "message": this.props.textBeforeCursor,
          "toxic": this.state.HateStatus == "hate" ? "1" : "0",
          "probability": intents['TOXICITY'].summaryScore.value,
          "platform": this.props.platform,
          "stimuli": this.props.stimuli,
          "insult_prob": intents['INSULT'].summaryScore.value,
          "threat_prob": intents['THREAT'].summaryScore.value,
          "severetoxicity_prob": intents['SEVERE_TOXICITY'].summaryScore.value,
          "identityattack_prob": intents['IDENTITY_ATTACK'].summaryScore.value,
          "profanity_prob": intents['PROFANITY'].summaryScore.value
        }).then(x => {
          console.log("Log: " + this.state.HateStatus + " detected");

          this.setState({
            prob: intents['TOXICITY'].summaryScore.value
          });

        });

      })
      .catch((error) => {
        // The perspective request failed, put some defensive logic here!
        console.log(error);
      });
  };

  render() {

    // we don't want the getToxicity function to run without a change in input, so this checks for that
    if ((lastString !== this.props.textBeforeCursor) && !(this.props.practice)) {
      if(this.props.textBeforeCursor===""){
        this.setState({
          prob: 0,
          HateStatus:  "not hate",
          interventionLogged: false
        });
      }
      if (this.props.textBeforeCursor.charAt(this.props.textBeforeCursor.length - 1) == " " || this.props.textBeforeCursor.charAt(this.props.textBeforeCursor.length - 1) == "." || this.props.textBeforeCursor.charAt(this.props.textBeforeCursor.length - 1) == "!" || this.props.textBeforeCursor.charAt(this.props.textBeforeCursor.length - 1) == "?") {
        this.getToxicity(this.props.textBeforeCursor);
      }
    }

    lastString = this.props.textBeforeCursor;

    if (this.state.interventionType == 1) {
      return (
        // return three divs each displaying the value of the intent
        <div style={this.getStyle(this.props)} className={this.props.classNameProp + " intervention"}>
          {this.state.HateStatus === "hate" ? <div className="hate_red"><b>Caution: </b>Your message may be considered inappropriate. You should delete it and start again</div> : null}

        </div>
      );
    }
    else if (this.state.interventionType == 2) {
      return (
        <div className="blank"> {this.state.HateStatus === "hate" ? <MessageTimerComponent hateProb={(this.getProb() * 100).toFixed(1) + "%"}/> : null}</div>
      );
    }
    else if (this.state.interventionType == 4) {
      return (
        <div className="blank"> {this.state.HateStatus === "hate" ? <MessageTimerComponent hateProb={(this.getProb() * 100).toFixed(1) + "%"} /> : null}</div>
      );
    }


    else if (this.state.interventionType == 3) {
      return (
        // return three divs each displaying the value of the intent
        <div style={this.getStyle(this.props)} className={this.props.classNameProp + " intervention"}>
          {this.state.HateStatus === "hate" ? <div className="hate_red"><b>Caution: </b>Your message is {(this.getProb() * 100).toFixed(1) + "%"} likely to be inappropriate. You should edit your message to be more appropriate.</div> : null}
        </div>
      );
    }
    else {
      return (null);

    }
    // }
  }
}

export default GetHateTypingComponent;