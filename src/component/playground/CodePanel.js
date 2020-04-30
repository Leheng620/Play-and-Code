import React, { Component } from 'react'
import CodeContaienr from './CodeContainer'
import { Resizable } from 're-resizable'


export class CodePanel extends Component {

    state = {
        codeContainerHeight : 250,
        defaultHeight : 250,
    }

    render() {
        return (
            <div className='code-panel'>
                <Resizable className='level-guide'
                    defaultSize={{width:323, height:250}}
                    minHeight={125}
                    maxHeight={375}    
                    enable={{ top:false, right:false, bottom:true, left:false, 
                        topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                    onResize={(e, direction, ref, delta)=>{
                        this.setState({codeContainerHeight: this.state.defaultHeight - delta.height})
                    }}
                    onResizeStop={(e,direction, ref, delta)=>{
                        this.setState({defaultHeight: this.state.codeContainerHeight})
                    }}
                    >

                </Resizable>

                <CodeContaienr height={this.state.codeContainerHeight} />
            </div>
        )
    }
}

export default CodePanel
