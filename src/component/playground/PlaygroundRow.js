import React, { Component } from 'react'
import { PlaygroundItem } from "./PlaygroundItem";
import { PlaygroundProperty } from '../constants/CgameConstant'

export class PlaygroundRow extends Component {

    // Generate component <getPlaygroundItem>, it is the actual grid
    getPlaygroundItem = () =>{
        let pg = []
        for(let i = 0; i < PlaygroundProperty.COL; i++){
            pg.push(
                <PlaygroundItem col={i} item={this.props.playgroudBoardRow[i]} />
            )
        }
        return pg;
    }

    render() {
        return (
            <div className='playground-row'>
                {this.getPlaygroundItem()}
            </div>
        )
    }
}

export default PlaygroundRow
