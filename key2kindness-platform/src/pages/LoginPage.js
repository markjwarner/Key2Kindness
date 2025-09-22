import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import {postLog, getLogs} from '../logging'
import TaskPage from "./TaskPage";
export let id, group, platform;
export let loggedData = [];
let showDetails = false;

function instructionsList(){

   let list = [];
   //list of instructions to be displayed in the UI
   let info = [
       <div className="infoText center-m">
           You will be shown a number of message threads.
       </div>,
       <div className="infoText center-m">
          Please respond to the <u>latest message</u> in the thread.
       </div>,
       <div className="infoText center-m">
           Before the real task, we will present a practice one.
       </div>,
       <div className="infoText center-m">
          We would like you to type "hello world" as a response to the next practice task.
       </div>

   ];

   //loop through and add the instruction number and instruction info to the list to be presented in the UI
   for(let i  = 0; i<4; i++){
       let number  = <div className="instructionNum center-m">{i+1}</div>;
       let information = info[i];
       let listItem = <div className="instructionBox">{number}{information}</div>;
       list.push(listItem);

   }

   //return this list for the component export
    return (<div>{list}</div>);
}

//check if there are ID's cached
export function getCachedIds(){
    id = localStorage.getItem('id');
    group = localStorage.getItem('group');
    if(id===null&&group===null){
        return false;
    }
    else{
        return true;
    }
}

function LoginPage(props){
        document.body.style.backgroundColor = '#E9E9E9';
        let urlParams = props.location.search;
        urlParams = urlParams.substring(1, urlParams.length);


        if(!getCachedIds()){
            // window.location.href = '/error';
        }

        if(urlParams!=undefined){
            try{

                id = urlParams.split('&')[0].includes('userid') ? urlParams.split('&')[0] : urlParams.split('&')[1];
                id = parseInt(id.split('=')[1]);
                group = urlParams.split('&')[0].includes('groupid') ? urlParams.split('&')[0] : urlParams.split('&')[1];
                group = parseInt(group.split("=")[1]);
                platform = urlParams.split('&')[0].includes('platform') ? urlParams.split('&')[1] : urlParams.split('&')[2];
                platform = parseInt(platform.split("=")[1]);
                localStorage.setItem('id', id);
                localStorage.setItem('group', group);
                localStorage.setItem('platform', platform);

                postLog({
                    "eventType": "login",
                    "groupID": group,
                    "userID": id
                }).then(x =>{console.log("posted login log")});
            }
            catch(e){
                //show the login screen?
            }

        }

        return (
            <div>
                {instructionsList()}
                <div className="center-m">
                    <Link onClick={()=>{postLog({
                        "eventType": "task-practice",
                        "groupID": group,
                        "userID": id
                    }).then(x =>{localStorage.clear()});}}>
                        <button className="genButton">Clear</button>
                    </Link>

                </div>
                <br/>
                <br/>
                <div className="center-m">
                    <Link onClick={()=>{postLog({
                        "eventType": "task-practice",
                        "groupID": group,
                        "userID": id
                    }).then(x =>{console.log("posted task log")}); /*openFullscreen();*/}} to="/task">
                        <button className="genButton">Start Task</button>
                    </Link>

                </div>
                <br/>
                <br/>
            </div>

        );
}


export default LoginPage
