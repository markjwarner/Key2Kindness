import React, { Component } from 'react';
let thread_type;
class TextBoxComponent extends Component {

    constructor(props) {
        super(props);
    }

    //when submitting the response, if its the last image route to the exit screen
    getEnterMethod = () => {
           this.props.submit()
    };

    //change the colour of the character counter based on whether the user has entered too many letters
    getCharStyle = () => {
        return this.props.charCount < 0 ? { color: 'red' } : { color: 'black' }
    };


    render() {
        let { result } = this.props;

        //get whether the box is visible or not
        function getStyle(props) {
            let returnVal = ""
            if(props.thread_type == "whatsapp"){
                returnVal = props.showHide ? 'revealTB' : 'hideTB_WA'  
            }
            else {
                returnVal = props.showHide ? 'revealTB' : 'hideTB'
            }

            return returnVal;
        }

        const alignLeft = { textAlign: 'left' };

        //

        let words = []
        let word = []
        result.forEach((char) => {
            word.push(<span className={char.props.className} id={char.props.id}>{char.props.children}</span>)
            if (char.props.children == "\xa0") {
                words.push(<li className='wordItem'><ul className='wordList'>{word}</ul></li>)
                word = []
            }
        });
        words.push(<li className='wordItem'><ul className='wordList'>{word}</ul></li>)

        return (

            <div className={getStyle(this.props) + " " + this.props.classNameProp + " result"}>
                <div className="inputFooterWrapper">
                    <ul id="inputBox" className='textInput' onClick={() => { this.props.openKB() }}>

                        {words}

                    </ul>
                    <button onClick={e => { this.getEnterMethod() }} className='genButton goBtn'>Reply</button>
                </div>
            </div>
        )
            ;
    }
}


export default TextBoxComponent;
