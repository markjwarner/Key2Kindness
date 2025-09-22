import React, { Component } from 'react';
class ToolTipPopUp extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            button_text: "",
            btn_disabled: true
        }
    }


    render() {

        return (
            <div style={this.props.position} className={this.props.classNameProp + " popUp"}>
                <div >{this.props.text}</div>
                <div onClick={() => { this.props.nextAction() }} className="genButton mt5">{this.props.btntext}</div>

            </div>
        );
    }
}



export default ToolTipPopUp;
