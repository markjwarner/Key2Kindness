import React from 'react';
import {postLog} from '../logging';
import {id, group} from '../pages/LoginPage.js';
import {Debug} from "./KeyboardComponent";
let lastString;


export default class TextRecComponent extends React.Component {

    constructor(props) {
        super(props);
        //set the original suggestions as hello world hello
        this.state = {
            suggestions: this.props.practice ? ["hello", "world", "hello"] : ["", "", ""]
        };
    }


    //fetch request to the text rec api
   getSuggestions = async() =>{
        const response = await fetch('https://python-dot-north-aimc.nw.r.appspot.com/get_text_suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
               "input_text" : this.props.textBeforeCursor,
               "sentiment_bias" : group
           })

        });
        const data = await response.json();
        //if the response is different to the last suggestions and isn't blank, update the component ui
        if(JSON.stringify(this.state.suggestions)!==(JSON.stringify(data.suggestions))){
            this.setState({
                suggestions : data.suggestions
            });
            postLog({
                "taskid": this.props.id,
                "eventType": "suggestion-update",
                "groupId": group,
                "userID": id,
                "input_text" : this.props.textBeforeCursor,
                "suggestions" : data.suggestions,
                "stimuli" : JSON.stringify(this.props.stimuli)
            }).then(x =>{console.log("posted suggestion-update log")});
        }
    };


//log the selection of a word

    logWordEvent = (suggestion, props) => {
        postLog({
            "taskid": this.props.id,
            "eventType": "select-suggestion",
            "groupId": group,
            "userID": id,
            "suggestion" : suggestion,
            "stimuli" : JSON.stringify(this.props.stimuli)
        }).then(x =>{console.log("posted select-suggestion log")});

        this.props.getEnterMethod(suggestion);

    };


    //show hide styling
    getStyle = (props) => {
        let returnVal = props.showHide ? 'revealKB ' : 'kbhide ';
        return returnVal;
    };

     render() {
         if ((lastString!==this.props.textBeforeCursor) && !(this.props.practice)){
             //this.getSuggestions();
         }

         lastString=this.props.textBeforeCursor;
        return (
            <div id="recWrap" className={this.getStyle(this.props) + this.props.classNameProp + " suggestion-body"}>
              <div onClick={() => {this.logWordEvent(this.state.suggestions[0],this.props)}} className="suggestion">{this.state.suggestions[0]}</div>
              <div onClick={() => {this.logWordEvent(this.state.suggestions[1],this.props)}} className="suggestion">{this.state.suggestions[1]}</div>
              <div onClick={() => {this.logWordEvent(this.state.suggestions[2],this.props)}} className="suggestion">{this.state.suggestions[2]}</div>
            </div>
    );

    }

}
