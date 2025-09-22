import React, { Component } from 'react';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { isAndroid, isIOS } from 'react-device-detect';

class KeyboardComponent extends Component {

    constructor(props) {
        super(props);

        var layoutName = localStorage.getItem('layoutName') === null ? "shift" : JSON.parse(localStorage.getItem("layoutName"));

        this.keypad = React.createRef();
        this.state = {
            mergeDisplay: true,
            layoutName: layoutName,
            layoutIOS: {
                default: [
                    "q w e r t y u i o p",
                    "{separator} a s d f g h j k l {separator}",
                    "{shift} z x c v b n m {backspace}",
                    "{numbers} {space} {hideKbd}"
                ],
                shift: [
                    "Q W E R T Y U I O P",
                    "{separator} A S D F G H J K L {separator}",
                    "{darkshift} Z X C V B N M {backspace}",
                    "{numbers} {space} {hideKbd}"
                ],
                numbers: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "- / : ; ( ) £ & @ ”",
                    "{symbols} . , ? ! ’ {backspace}",
                    "{abc} {space} {hideKbd}"
                ],
                symbols: [
                    "[ ] { } # % ^ * + =",
                    "_ \\ | ~ < > € $ ¥ •",
                    "{moresymbols} . , ? ! ’ {backspace}",
                    "{abc} {space} {hideKbd}"
                ],
                moresymbols: [
                    "` √ π ÷ × ¶ ∆ ¢ ^ °",
                    "© ® ™ ✓ ' \" ± ¿ – ·",
                    "{numbers} . , ? ! ’ {backspace}",
                    "{abc} {space} {hideKbd}"
                ],

            },
            layoutAndroid: {
                default: [
                    "q w e r t y u i o p",
                    "{separator} a s d f g h j k l {separator}",
                    "{shift} z x c v b n m {backspace}",
                    "{numbers} , {space} . {hideKbd}"
                ],
                shift: [
                    "Q W E R T Y U I O P",
                    "{separator} A S D F G H J K L {separator}",
                    "{darkshift} Z X C V B N M {backspace}",
                    "{numbers} , {space} . {hideKbd}"
                ],
                numbers: [
                    "1 2 3 4 5 6 7 8 9 0",
                    "@ # £ _ & - + ( ) /",
                    "{symbols} {separator} * \" ' : ; ! ? {separator} {backspace}",
                    "{abc} , {space} . {hideKbd}"
                ],
                symbols: [
                    "~ ` | • √ π ÷ × ¶ ∆",
                    "€ $ ¥ ¢ ^ ° = { } \\",
                    "{numbers} {separator} % © ® ™ ✓ [ ] {separator} {backspace}",
                    "{abc} < {space} > {hideKbd}"
                ]
            },
            displayIOS: {
                "{numbers}": "123",
                "{ent}": "return",
                "{escape}": "esc ⎋",
                "{tab}": "tab ⇥",
                "{backspace}": "⌫",
                "{capslock}": "caps lock ⇪",
                "{shift}": "⇧",
                "{darkshift}": "⬆︎",
                "{controlleft}": "ctrl ⌃",
                "{controlright}": "ctrl ⌃",
                "{altleft}": "alt ⌥",
                "{altright}": "alt ⌥",
                "{metaleft}": "cmd ⌘",
                "{metaright}": "cmd ⌘",
                "{abc}": "ABC",
                "{hideKbd}": `<img src="Images/hideKB.png" alt="hide kyboard" style="height: 1.2rem;"></img>`,
                "{symbols}": `#+=`,
                "{moresymbols}": `π±°`,
                "{separator}": ` `
            },
            displayAndroid: {
                "{numbers}": "?123",
                "{ent}": "return",
                "{escape}": "esc ⎋",
                "{tab}": "tab ⇥",
                "{backspace}": "⌫",
                "{capslock}": "caps lock ⇪",
                "{shift}": "⇧",
                "{darkshift}": "⬆︎",
                "{controlleft}": "ctrl ⌃",
                "{controlright}": "ctrl ⌃",
                "{altleft}": "alt ⌥",
                "{altright}": "alt ⌥",
                "{metaleft}": "cmd ⌘",
                "{metaright}": "cmd ⌘",
                "{abc}": "ABC",
                "{hideKbd}": `<img src="Images/hideKB.png" alt="hide kyboard" style="height: 1.2rem;"></img>`,
                "{symbols}": `=\\<`,
                "{moresymbols}": `π±°`,
                "{separator}": ` `
            }
        }
    }

    /*
        Function returns the class for the keyboard based on whether the showHide prop. If showHide is true,
        reveal the keyboard etc.
     */
    getStyle = (props) => {
        let returnVal = props.showHide ? 'revealKB ' : 'kbhide ';
        return returnVal;
    };

    /* When a key is pressed, checks if it's a shift/caps lock/layout changing key and handles that*/
    onKeyPress(button) {
        if (button === "{separator}") return
        /**
         * If you want to handle the shift and caps lock buttons
         */
        //if (button === "{shift}" || button === "{darkshift}" || button === "{lock}") this.handleShift(button);
        if (button === "{numbers}" || button === "{abc}" || button === "{symbols}" || button === "{moresymbols}") {
            this.handleNumbers(button);
        }

        else if (button === "{shift}" || button === "{darkshift}" || button === "{lock}") {
            this.handleShift(button);
        }
        else if (this.state.layoutName === "shift") {
            this.setState({ layoutName: "default" })
            this.props.onKeyPress(button)
        }
        else {
            this.props.onKeyPress(button)
        }

        localStorage.setItem("layoutName", JSON.stringify(this.state.layoutName));

    }


    /* Handle changing the layout between shift/capslock layout and default */
    handleShift = (button) => {
        this.props.onKeyPress(button)
        const layoutName = this.state.layoutName;
        this.setState({
            layoutName: layoutName === "default" ? "shift" : "default"
        });
    };

    /* Handle changing the layout between default/numbers/symbols */
    handleNumbers(button) {
        const currentLayout = this.state.layoutName;
        let numbersToggle
        switch (currentLayout) {
            case "default": case "shift":
                numbersToggle = "numbers";
                break;
            case "numbers":
                numbersToggle = button === "{abc}" ? "default" : "symbols";
                break;
            case "symbols":
                if (isIOS) numbersToggle = button === "{abc}" ? "default" : "moresymbols";
                else numbersToggle = button === "{abc}" ? "default" : "numbers";
                break;
            case "moresymbols":
                numbersToggle = button === "{abc}" ? "default" : "numbers";
                break;
        }

        this.setState({
            layoutName: numbersToggle
        });
    }


    render() {
        // Set to shift if required
        let layout = ((this.state.layoutName == "default") && this.props.setshift) ? ("shift") : (this.state.layoutName)

        return (
            //the container for the whole keyboard, styled based on the props.showHide value
            <div className={this.getStyle(this.props) + this.props.classNameProp + " button"}
                ref={this.keypad}
                id="keypad">
                <Keyboard
                    onKeyPress={button => this.onKeyPress(button)}
                    mergeDisplay={this.state.mergeDisplay}
                    layoutName={layout}//{this.state.layoutName}
                    layout={isIOS ? this.state.layoutIOS : this.state.layoutAndroid}
                    display={isIOS ? this.state.displayIOS : this.state.displayAndroid}

                />
            </div>
        );

    }

}


export default KeyboardComponent;
