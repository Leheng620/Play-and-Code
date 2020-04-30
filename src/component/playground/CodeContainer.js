import React, { Component } from 'react'
import { Resizable } from 're-resizable'


export class CodeContainer extends Component {
    render() {
        return (
            <div className='code-container' style={{height: this.props.height + 'px'}}>

            </div>
            
        )
    }
}

export default CodeContainer
