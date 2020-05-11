import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PlaygroundProperty } from '../constants/CgameConstant'
import { PlaygroundItem } from "./PlaygroundItem";
import { PlaygroundRow } from "./PlaygroundRow";
import LittleMan from '../character/LittleMan'
import CodePanel from './CodePanel'
import tempBoard from '../../level/LevelReader'

function LevelHeader(props){
    return(
        <div className='playground-header'>
            <div className='level-name'>

            </div>
            <div className='level-progress'>

            </div>
        </div>
    )
}

export class Playground extends Component {

    // a playgroundBoard is 15 x 10 matrix, each represent a grid
    state = {
        playgroudBoard : tempBoard,
    }

    // generate component <PlaygroundRow>
    getPlaygroundItemRow = () =>{
        let pg = []
        for(let i = 0; i < PlaygroundProperty.ROW; i++){
            pg.push(
                <PlaygroundRow 
                key={i} 
                playgroudBoardRow={this.state.playgroudBoard[i]}
                 
                />
            )
        }
        return pg;
    }

    render() {
        console.log(this.props)
        return (
        <div className='background'>
          {/* <img src={bg} style={{width:'100%', height:'100%'}} /> */}
            
            <LevelHeader />
            
            <CodePanel />

            <div className='playground-container'>
                <div className='playground-wrapper'>
                    {this.getPlaygroundItemRow()}
                </div>
                {/* <Link to={'/'}>aaa</Link> */}
                <button onClick={()=>{this.props.history.goBack()}}>aaaa</button>
            </div>
        </div>
        )
    }
}
export default Playground
