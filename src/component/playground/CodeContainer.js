import React, { Component } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/material.css';

const electron = window.require('electron');
const { ipcRenderer } = electron;

export class CodeContainer extends Component {

    state = {
        code: "",
        defaultCode: ""
    }

    componentDidMount() {
        // This event listener is going to read the returned value from 
        // the background process which generates the output after running
        // the python script just sent.
        ipcRenderer.on('RETURNED-FROM-PYTHON-SCRIPT', this.handlePyscriptReturn);
        this.setState({code: 'move_forward()\nmove_forward()\nturn_left()\nturn_right()', 
            defaultCode: 'move_forward()\nmove_forward()\nturn_left()\nturn_right()'
        })
    }
    
    /* 
        This function handles the result returned by background process
    */ 
    handlePyscriptReturn = (event, args) =>{
        this.props.parseScript(event, args)
    }

    /*
        It sends the code to background process
    */
    sendMessage = (msg) =>{
        // Send the script to background process via main process
        // This is going to be the code that player typed in so that
        // code will be intepreted using the python script that runs on
        // background process
		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', msg);
    }

    /*
        Event handler when user presses run.
    */
    runCode = () =>{
        let msg = {
            args: [],
            code: this.state.code,
        }
        console.log(msg)
        this.sendMessage(msg);
    }
    
    render() {
        return (
            <div className='code-container' style={{height: this.props.height + 'px'}}>
                <div className='run-code-button-container'>
                    <button className='run-code-button' onClick={this.runCode}>
                        run
                    </button>
                </div>
                <CodeMirror className='default'
                value={this.state.defaultCode}
                options={{
                  mode: 'python',
                  theme: 'eclipse',
                  lineNumbers: true,
                  viewportMargin: Infinity,
                  lineWrapping: true,
                  indentWithTabs: true,
                  indentUnit: 4
                }}
                onChange={(editor, data, value) => {

                    // console.log(editor)
                    // console.log(data)
                    // console.log(value)
                    this.setState({code:value})
                }}
                >

                </CodeMirror>
            </div>
            
        )
    }
}

export default CodeContainer
