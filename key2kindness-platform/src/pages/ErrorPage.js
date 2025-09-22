import React, {Component} from "react";
import {group, id} from "./LoginPage";


/*
    This page informs the user they have entered the app without a user id or group id
 */
class ErrorPage extends Component {

    render() {

        localStorage.clear();
        const style = {textAlign: 'center'};

        return (
            <h2 style={style}>Please use the compete URL provided to you</h2>
        );
    }
}


export default ErrorPage;
