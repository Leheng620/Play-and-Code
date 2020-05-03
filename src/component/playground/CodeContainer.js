import React, { Component } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/material.css';


export class CodeContainer extends Component {
    render() {
        return (
            <div className='code-container' style={{height: this.props.height + 'px'}}>
                <CodeMirror className='default'
                value='abc'
                options={{
                  mode: 'python',
                  theme: 'eclipse',
                  lineNumbers: true,
                  viewportMargin: Infinity,
                  lineWrapping: true,
                }}
                // onChange={(editor, data, value) => {
                //     console.log(editor)
                //     console.log(data)
                //     console.log(value)
                // }}
                >

                </CodeMirror>
            </div>
            
        )
    }
}

export default CodeContainer
