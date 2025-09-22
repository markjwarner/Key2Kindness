import React, { Component } from 'react';
import BtnComponent from "./ButtonComponent";

class Scenario_DescriptionComponent extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        if (this.props.scenario_status === true) {
            return (
                <div className="fullscreen-container">
                    <div className={"popUp_scenario"}>
                        <div ><p><b>Task Scenario</b></p>{this.props.scenario}</div>
                        <div>   <button onClick={() => { this.props.hide_scenario() }} className="genButton_grey mt5">{"Continue"}</button></div>
                    </div>
                </div>

            );
        }
        else {
            return null
        }
    }
}
export default Scenario_DescriptionComponent;
