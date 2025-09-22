import React, { Component } from 'react';
import BtnComponent from "./ButtonComponent";
import { postLog } from "../logging";
import { group, id, platform, getCachedIds } from "../pages/LoginPage";

class GetHateOnSubmitComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            button_text: "",
            interventionType: Number(group),
            btn_disabled: true
        }
    }
    Text_on_PopUp() {
        switch (this.state.interventionType) {
            case 5:
                return "Your message may be considered inappropriate. You should delete it and start again.";
            case 6:
                return "Your message may be considered inappropriate. You should delete it and start again.";
            case 7:
                return "Your message is " + (this.props.prob * 100).toFixed(1) + "% likely to be inappropriate. You should delete it and start again.";
            case 8:
                return "Your message is " + (this.props.prob * 100).toFixed(1) + "% likely to be inappropriate. You should delete it and start again.";
        }
    }
    //log values on click
    logClick(val) {
        let uniqueID = new Date().getTime();
        postLog({
            "timestamp": uniqueID,
            "eventID": 2,
            "eventType": val,
            "groupID": group,
            "userID": id,
            "message": this.props.message,
            "toxic": this.props.hate_status === "hate" ? 1 : 0,
            "probability": this.props.prob,
            "insult_prob": this.props.insult,
            "threat_prob": this.props.threat,
            "severetoxicity_prob": this.props.severe_toxicity,
            "identityattack_prob": this.props.identity_attack,
            "profanity_prob": this.props.profanity,
            "platform": this.state.thread_type,
            "stimuli": this.state.thread_type === "whatsapp" ? this.state.whatsapp_current_msg : this.state.twitter_current_msg
        }).then(x => {
            console.log("Button press");
        })
    }




    render() {

        if (this.props.hate_status === "hate") {
            if (this.state.interventionType == 5 || this.state.interventionType == 7) {

                return (
                    <div className={this.props.classNameProp + " fullscreen-container"}>
                        <div style={{ bottom: '50%', left: '5vw' }} className={this.props.classNameProp + " interventionPopup"}>
                            <div >{this.Text_on_PopUp()}</div>
                            <div>   <button disabled={false} className="genButton_brown mt5" onClick={() => { this.props.nextAction(); this.logClick("revise") }}>{"Revise"}</button></div>
                            <div>  <button disabled={false} className="genButton_brown mt5" onClick={() => { this.props.reponse_type(); this.logClick("send") }}>{"Send"}</button></div>
                        </div>
                    </div>
                );
            }
            else if (this.state.interventionType == 6 || this.state.interventionType == 8) {

                if (this.props.pu === true) {
                    return (
                        <div className={this.props.classNameProp + " fullscreen-container"}>
                            <div style={{ bottom: '50%', left: '5vw' }} className={this.props.classNameProp + " interventionPopup"}>
                                <div ><p><b>Caution</b></p>{this.Text_on_PopUp()}</div>
                                <div>   <button disabled={false} className="genButton_brown mt5" onClick={() => { this.props.nextAction(); this.logClick("revise") }}>{"Revise"}</button></div>


                                <BtnComponent classNameProp={"genButton_brown mt5"}
                                    showHide={this.state.showHideKeyboard}
                                    // btn_disable={true}
                                    submit={() => { this.props.reponse_type() }}

                                />

                            </div>
                        </div>
                    );
                }
                else {

                    return null
                }
            }
            else {
                return (
                    <div style={this.props.position} className={this.props.classNameProp + " interventionPopup"}>
                        <div >{this.props.text}</div>
                        <div onClick={() => { this.props.nextAction(); this.logClick("send") }} className="genButton_brown mt5">{this.props.btntext}</div>

                    </div>
                );
            }
        }
        return null
    }
}


export default GetHateOnSubmitComponent;
