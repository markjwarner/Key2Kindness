import React from 'react';
import {postLog} from '../logging';
import {id, group} from '../pages/LoginPage.js';
import {Debug} from "./KeyboardComponent";
import {TIMING_DELAY} from "./TaskComponent";
import { ConsoleView, isIOS } from "react-device-detect";
let lastString;


export default class MessageTimerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonCounter: TIMING_DELAY,  //whether the keyboard and suggestions are visible  15-1(14)
            intervalId: "",
            buttonText:"",
            interventionType: Number(group),
            Style_class: isIOS === true ? "MessageDelay_iOS" : "MessageDelay_Android",
    };
}

componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
 }
componentDidMount() {

    if (this.state.buttonCounter === TIMING_DELAY || (this.state.buttonCounter > 1 && this.state.buttonCounter < TIMING_DELAY)){
        if(this.state.interventionType==2) {
            this.setState({buttonText:"Your message may be considered inappropriate and you should revise it. The keyboard will be enabled again in " + TIMING_DELAY + "s"})
        }
        else if(this.state.interventionType==4) {
            this.setState({ buttonText: "Your message is "+this.props.hateProb+"% likely to be inappropriate and you should revise it. The keyboard will be enabled again in " + TIMING_DELAY + "s"})
        }
    }

    var intervalId = setInterval(this.timer, 1000);
    this.setState({intervalId: intervalId}); 

}

timer=()=> {
    var newCount = this.state.buttonCounter - 1;
    localStorage.setItem("newCount", JSON.parse(newCount))

    if(newCount > 0) { 
        if(this.state.interventionType==2){
        this.setState({ buttonText: "Your message may be considered inappropriate and you should revise it. The keyboard will be enabled again in "+newCount+"s" ,buttonCounter:newCount });
        }
        else if(this.state.interventionType==4)
        {
            this.setState({ buttonText: "Your message is "+this.props.hateProb+" likely to be inappropriate and you should revise it. The keyboard will be enabled again in "+newCount+"s" ,buttonCounter:newCount });
        } 
    } else {
        clearInterval(this.state.intervalId);
        //this.setState({ buttonText: "Submit"});
        this.setState({Style_class: "kbhide"})
    }
 }

     render() {
       
        return (
            <div className={this.state.Style_class}><p><b>Caution</b></p>{this.state.buttonText}</div>     
    );

    }

}

