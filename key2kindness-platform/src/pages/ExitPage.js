import React, {Component} from 'react';
import {group, id} from "../pages/LoginPage";
import {getLogs} from '../logging';
import {getCachedIds} from "./LoginPage";
import { Helmet } from "react-helmet";
document.body.style.backgroundColor = 'white';

/*
    Last page in the process, the displayed button takes the user back to qualtrics using their id and group
 */
export default class ExitPage extends Component {

    render() {
        const height100 = {
            height: '100vh',
            paddingTop: '5vh',
            backgroundColor: '#E9E9E9'
        };

  //      const url = 'https://nupsych.qualtrics.com/jfe/form/SV_4MDNcYedPXhcyMJ?userid='+id+'&groupid='+group;    this is the real exit survey
          const url = 'https://nupsych.qualtrics.com/jfe/form/SV_2adX5A0Ok0ZxDvw?userid='+id+'&groupid='+group;    // this is the pilot exit survey
        return(
            <div style={height100}>

                <Helmet 
                  script={[{ 
                  type: 'text/javascript', 
                  innerHTML: 'window.location.replace("https://nupsych.qualtrics.com/jfe/form/SV_2adX5A0Ok0ZxDvw?userid=' + id + '&groupid=' + group + '")' 
                  }]} 
                    />
                <h3 className="center-text">Thank you for completing the tasks. You will now be redirected to the exit survey.</h3>
                  
            </div>
        );
    }
}
