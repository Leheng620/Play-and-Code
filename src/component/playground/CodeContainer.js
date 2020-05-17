import React, { Component } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/material.css';

const electron = window.require('electron');
const { ipcRenderer } = electron;

export class CodeContainer extends Component {


    componentDidMount() {
        // This event listener is going to read the returned value from 
        // the background process which generates the output after running
        // the python script just sent.
        ipcRenderer.on('RETURNED-FROM-PYTHON-SCRIPT', this.handlePyscriptReturn);
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
        let doors = this.props.randomizeDoor()
        let code = this.props.code
        code = doors.toString() + "\ncodebegin\n" + code
        let msg = {
            args: [],
            code: code,
        }
        // console.log(msg)
        this.sendMessage(msg);
    }
    
    render() {
        // console.log(this.props.defaultCode)
        return (
            <div className='code-container' style={{height: this.props.height + 'px'}}>
                <div className='run-code-button-container'>
                    <button className='run-code-button' onClick={this.runCode} disabled={this.props.running}>
                        run
                    </button>
                    <button className='cancel-run-code-button' onClick={this.props.cancelRunning} disabled={!this.props.running}>
                        cancel
                    </button>
                    <button className='reset-run-code-button' onClick={this.props.reset} disabled={this.props.running} >
                        reset
                    </button>
                    <div className='run-speed'>
                        <label htmlFor='run-speed-slider' className='run-speed-slider-label'>Run Speed: </label>
                        <input name='run-speed-slider' className='run-speed-slider' type='range' min='0.3' max='0.9' step='0.05'
                            value={this.props.speed} onChange={this.props.changeSpeed} disabled={this.props.running}
                        />
                    </div>
                </div>
                <CodeMirror className='default'
                value={this.props.defaultCode}
                options={{
                  mode: 'python',
                  theme: 'eclipse',
                  lineNumbers: true,
                  viewportMargin: Infinity,
                  lineWrapping: true,
                  indentWithTabs: true,
                  indentUnit: 4
                }}
                onChange={(event, editor, value)=>{this.props.processEnterCode(event, editor, value)}}
                >

                </CodeMirror>
            </div>
            
        )
    }
}

export default CodeContainer
