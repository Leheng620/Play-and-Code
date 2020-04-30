import React, { Component } from 'react'
import LittleMan from '../character/LittleMan'
import grass from '../sprite/grass.jpg'
import water1 from '../sprite/water1.jpg'
import block1 from '../sprite/block1.jpg'

export class PlaygroundItem extends Component {

    // Get the character on the grid
    getSprite = () =>{
        switch(this.props.item){
            case 1: return (<LittleMan />)
        }
    }

    // Get the type of the grid, could be grass or block or something else
    getItemType = () =>{

        const bg = {
            // margin: 0,
            // padding: 0,
            // display: 'inline-block',
            // width: 40 + 'px',
            // height: 40 + 'px',
            // marginLeft: 1 + 'px',
            backgroundImage: `url(${grass})`
        }
        return bg
    }
    
    render() {
        let textureType = this.getItemType();
        return (
            <div className='playground-item' style={textureType}>
                {this.getSprite()}
            </div>
        )
    }
}

export default PlaygroundItem
