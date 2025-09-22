import React, {useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom'
import TaskPage from './pages/TaskPage.js'
import {id, group, getCachedIds} from './pages/LoginPage.js'
import LoginPage from './pages/LoginPage.js'
import {postLog} from './logging'
import ExitPage from "./pages/ExitPage";
import PracticeTask from "./pages/PracticeTask";
import ErrorPage from "./pages/ErrorPage";
import FastClick from 'fastclick';


class App extends Component{

    //extracts the user id and group id from the url for a redirect to /
    getUrl = () =>{
        let urlParams;
        try {
            urlParams = window.location.search;
            if(urlParams!==""){
                urlParams = urlParams.substring(1, urlParams.length);
                return urlParams;
            }
            else{
                return window.location.href;
            }
        }
        catch (e){
            return window.location.href;
        }

    };



    render() {
        //fastclick library is assigned to the page - this prevents default actions on double taps for mobile devices
        FastClick.attach(document.body);

        //if browser back button is pressed then the default action is overridden
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function(event) {
            window.history.go(1);
        };


        /*
            The getCachedIds function will return true if group and user id's can be found in localstorage, false if not.
            This then reroutes to the error screen if no id is found but this is disabled as it's at times temperamental and
            routes erroneously.
         */
        if(!getCachedIds()){
            // window.location.href = '/error';
        }



        return (
            //react router switch to route to the correct
            <Router>
                <Switch>
                    <Redirect from={this.getUrl()}  to='/'/>
                    <Route path="/" exact component={LoginPage}/>
                    <Route path="/task" exact={true} component={TaskPage}/>
                    <Route path="/exit" exact={true} component={ExitPage}/>
                    <Route path="/practice" exact={true} component={PracticeTask}/>
                    <Route path="/error" exact={true} component={ErrorPage}/>
                </Switch>
            </Router>
        )
    }



}

export default App
