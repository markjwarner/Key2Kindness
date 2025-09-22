import React, {Component} from "react";
import {group, id, getCachedIds} from "./LoginPage";
import TextBoxComponent from "../components/TextBoxComponent";
import TextRecComponent from "../components/TextRecComponent";
import ToolTipPopUp from "../components/ToolTipPopUp";
import TaskComponent from "../components/TaskComponent";


class PracticeTask extends Component {

/*
    Returns the task component with the practice prop set to true. This informs the component to present the practice task UI as
    opposed to the typical task UI.
  */
    render() {
        return (
           <TaskComponent history={this.props.history} practice={true}/>
        );
    }
}


export default PracticeTask;
