import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useLocation, useParams} from 'react-router-dom'
import '../App.css';
import KeyboardComponent from "../components/KeyboardComponent";
import TextBoxComponent from '../components/TextBoxComponent';
import TextRecComponent from "../components/TextRecComponent";
import {group, id, getCachedIds} from "../pages/LoginPage";
import {postLog} from "../logging";
import TaskComponent from "../components/TaskComponent";
var fontCase = 'lowercase';
let selectedIndex;

class TaskPage extends Component {


    render() {

        /*
        Returns the task component with the practice prop set to false. This informs the component to present the task UI as
        opposed to the practice task UI.
         */

        return (
            <TaskComponent history={this.props.history} practice={false}/>
        );
    }
}

export default TaskPage;
