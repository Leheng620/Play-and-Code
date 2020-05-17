import React, { Component } from 'react'
import CodeContaienr from './CodeContainer'
import { Resizable } from 're-resizable'


export class CodePanel extends Component {

    state = {
        codeContainerHeight : 250,
        defaultHeight : 250,
    }

    formatGuide = () =>{
        if(this.props.guide == null) return null
        let guideList = this.props.guide.split("\n")
        let result = []
        for(let i = 0; i < guideList.length; i++){
            if(guideList[i][0] == "*"){
                guideList[i] = guideList[i].substring(1, guideList[i].length)
                result.push(<p  className='guide-content' style={{color:'#b92323'}}>{guideList[i]}</p>)
            }else{
                result.push(<p  className='guide-content'>{guideList[i]}</p>)
            }
        }
        return result
    }

    render() {
        return (
            <div className='code-panel'>
                <Resizable className='level-guide'
                    defaultSize={{width:416, height:250}}
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
                        
                        {this.formatGuide()}
                </Resizable>

                <CodeContaienr height={this.state.codeContainerHeight} parseScript={this.props.parseScript}
                    processEnterCode={this.props.processEnterCode} defaultCode={this.props.defaultCode}
                    code={this.props.code} doors={this.props.doors} randomizeDoor={this.props.randomizeDoor}
                    cancelRunning={this.props.cancelRunning} running={this.props.running}
                    speed={this.props.speed} changeSpeed={this.props.changeSpeed} reset={this.props.reset}
                />
            </div>
        )
    }
}

export default CodePanel
