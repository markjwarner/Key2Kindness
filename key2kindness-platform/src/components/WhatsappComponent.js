import React from "react";
import { Component } from "react";
import Scenario_DescriptionComponent from "./Scenario_DescriptionComponent";
import { ConsoleView, isIOS } from "react-device-detect";


let previous_showHideKeyboard;
let conversationClassName = "";
let scrolldistance;

class WhatsappComponent extends React.Component {

    constructor(props) {
        super(props);
        previous_showHideKeyboard = this.props.showHideKeyboard;

        this.state = {
            deviceDate: new Date(),
            messageTime: new Date(),
            inputValue: '',
            scenario_hidden: false,

        };
    }

    hideScenario = () => {
        this.setState({
            scenario_hidden: true,
        });
    }



    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentDidUpdate(prevProps, prevState) {
        // Auto scroll to bottom when the keyboard is opened

        if(this.props.showHideKeyboard === true && previous_showHideKeyboard === false){
           if (document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight - (isIOS === true ? 310 : 350) >= (isIOS === true ? 265 : 300)){
            scrolldistance = (isIOS === true ? 265 : 300)
           }
           else {
            scrolldistance = document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight - (isIOS === true ? 310 : 350)
           }
           window.scrollTo({
             top: document.documentElement.scrollTop + (isIOS === true ? 265 : 300),
             behavior: 'smooth',
           }); 

           previous_showHideKeyboard = true
        }
        else if (this.props.showHideKeyboard === true && previous_showHideKeyboard === true) {
            previous_showHideKeyboard = true
        }
        else if (this.props.showHideKeyboard === false && previous_showHideKeyboard === true) {
           window.scrollTo({ 
             top: document.documentElement.scrollTop - scrolldistance,
             behavior: 'smooth',
           }); 

            previous_showHideKeyboard = false
        }
        else {
            previous_showHideKeyboard = false
        }

    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            deviceDate: new Date(),
        });
    }

    render() {

    let ClickDivClass = isIOS === true ? "ClickDiv_iOS" : "ClickDiv_Android"
        // here we need to adjust the conversation css to move it up when the keyboard is open
    if (this.props.showHideKeyboard === true){
       if (isIOS === true) { conversationClassName = "conversation-container-show-iOS"; }
        else { conversationClassName = "conversation-container-show-Android"; }
    }
    else { conversationClassName = "conversation-container-hide"}


        let avatar_name = this.props.thread.name;
        let avatar_status = this.props.thread.status;
        let avatar_url = this.props.thread.avatar_url;
        let thread_type = this.props.thread.type;
        let print_thread = [] // where we're putting the formatted messages

        this.props.thread.messages.forEach((message) => {

            let message_type = "message " + message.type;
            let message_sender = message.name;
            let message_time = message.time;
            let the_message = message.message;
            let nameStyle = {
              color: message.name_colour,
              'font-weight': 'bold',
            };

            if (message_type === "message sent") {
                print_thread.push(<div className={message_type}>
                    <span>{the_message}</span>
                    <span className="metadata">
                        <span className="time">{message_time}
                            <span className="tick"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7" /></svg></span>
                        </span>
                    </span>
                </div>)
            }
            else if(message_type === "message received") {
                if(thread_type === "group"){
                    print_thread.push(<div className={message_type}>
                        <span style={nameStyle}>{message_sender}</span><br></br>
                        <span>{the_message}</span>
                        <span className="metadata">
                            <span className="time">{message_time}
                            </span>
                        </span>
                    </div>)
                }
                else {
                    print_thread.push(<div className={message_type}>
                        <span>{the_message}</span>
                        <span className="metadata">
                        <span className="time">{message_time}
                        </span>
                        </span>
                    </div>)    
                }
            }
        })

        return (
            <div>
                <div className="page"> {/* center */}
                    {/*<div className="marvel-device nexus5"> {/*size and the shape of the infterface*/}
                    <div className={ClickDivClass} onClick={() => { this.props.openKB() }}></div>
                    <div className="screen"> {/* Color of icons in top to Green */}
                        <div className="screen-container" >
                            <div className="chat">
                                <div className="chat-container">
                                    <div className="user-bar"> {/* in this div is for whole user bar */}
                                        <div className="back">
                                            <i className="zmdi zmdi-arrow-left"></i>
                                        </div>
                                        <div className="avatar">
                                            <img src={avatar_url} alt="Avatar" />
                                        </div>
                                        <div className="name">
                                            <span>{avatar_name}</span>
                                            <span className="status">{avatar_status}</span>
                                        </div>
                                        
                                    </div>
                                    <div className="conversation"> {/* in this div is for whole conversation */}
                                    
                                        <div className={conversationClassName} >
                                            {print_thread}
                                        </div>
                                        {/*
                                            <form className="conversation-compose"> {/* this is the whole bottom
                                                <div className="emoji">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="smiley" x="3147" y="3209"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965zM5.95 12.965c-.027-.307-.132 5.218 6.062 5.55 6.066-.25 6.066-5.55 6.066-5.55-6.078 1.416-12.13 0-12.13 0zm11.362 1.108s-.67 1.96-5.05 1.96c-3.506 0-5.39-1.165-5.608-1.96 0 0 5.912 1.055 10.658 0zM11.804 1.01C5.61 1.01.978 6.034.978 12.23s4.826 10.76 11.02 10.76S23.02 18.424 23.02 12.23c0-6.197-5.02-11.22-11.216-11.22zM12 21.355c-5.273 0-9.38-3.886-9.38-9.16 0-5.272 3.94-9.547 9.214-9.547a9.548 9.548 0 0 1 9.548 9.548c0 5.272-4.11 9.16-9.382 9.16zm3.108-9.75c.795 0 1.44-.88 1.44-1.963s-.645-1.96-1.44-1.96c-.795 0-1.44.878-1.44 1.96s.645 1.963 1.44 1.963z" fill="#7d8489"/></svg>
                                                </div>
                                                <input className="input-msg" name="input" placeholder="Type a message" autocomplete="off" autofocus></input>{/* this is the type message
                                                <div className="photo">
                                                    <i className="zmdi zmdi-camera"></i>
                                                </div>
                                                <button className="send">
                                                    <div className="circle">
                                                        <i className="zmdi zmdi-mail-send"></i>
                                                    </div>   
                                                </button>
                                            </form>
                                            */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default WhatsappComponent;
