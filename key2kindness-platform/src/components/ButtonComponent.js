import React from 'react';
import { postLog } from '../logging';
import { id, group } from '../pages/LoginPage.js';
import { Debug } from "./KeyboardComponent";
import { TIMING_DELAY } from "./TaskComponent";
let lastString;
export default class ButtonComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonCounter: TIMING_DELAY,  // delay in seconds
            intervalId: "",
            Style_class: "genButton_grey mt5",
            btn_disable: true,
            buttonText: "Send in " + TIMING_DELAY + " seconds"
        };
    }

    timer = () => {
        var newCount = this.state.buttonCounter - 1;
        if (newCount > 0) {
            this.setState({ buttonText: "Send in " + newCount + " seconds", buttonCounter: newCount });
        } else {
            clearInterval(this.state.intervalId);
            this.setState({ buttonText: "Send", btn_disable: false, Style_class: "genButton_light_brown mt5" });
        }
    }
    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
    }
    componentDidMount() {
        var intervalId = setInterval(this.timer, 1000);
        this.setState({ intervalId: intervalId });
    }

    render() {

        return (

            <button disabled={this.state.btn_disable} className={this.state.Style_class} onClick={() => { this.props.submit() }}>{this.state.buttonText}</button>
        );

    }

}

