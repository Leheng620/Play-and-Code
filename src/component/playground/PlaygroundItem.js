import React, { Component } from 'react'
import LittleMan from '../character/LittleMan'
import Mushroom from '../character/Mushroom'
import { SpriteCode, Facing, itemCode } from '../constants/CgameConstant'
import grass from '../sprite/grass.jpg'
import water1 from '../sprite/water1.jpg'
import water2 from '../sprite/water2.jpg'
import water3 from '../sprite/water3.jpg'
import water4 from '../sprite/water4.jpg'
import block1 from '../sprite/block1.jpg'
import regularDoorV from '../sprite/doorvregular.png'
import regularDoorH from '../sprite/doorhregular.png'
import passwordDoorV from '../sprite/doorvpassword.png'
import passwordDoorH from '../sprite/doorhpassword.png'
import regularDoorVopen from '../sprite/doorvregularopen.png'
import regularDoorHopen from '../sprite/doorhregularopen.png'
import passwordDoorVopen from '../sprite/doorvpasswordopen.png'
import passwordDoorHopen from '../sprite/doorhpasswordopen.png'

export class PlaygroundItem extends Component {

    // Get the character on the grid
    getSprite = () =>{
        switch(this.props.sprite){
            case Facing.EAST: 
                return (<LittleMan direction={'face-right'} />)
            case Facing.SOUTH: 
                return (<LittleMan direction={''} />)
            case Facing.WEST: 
                return (<LittleMan direction={'face-left'} />)
            case Facing.NORTH: 
                return (<LittleMan direction={'face-up'} />)
        }
    }

    getMushroom = () =>{
        if(this.props.item == itemCode.MUSHROOM_YELLOW && this.props.sprite < 0){
            return(<Mushroom hasSprite={true} />);
        }else if(this.props.item == itemCode.MUSHROOM_YELLOW){
            return(<Mushroom hasSprite={false} />);
        }
    }    

    // Get the type of the grid, could be grass or block or something else
    getItemType = () =>{
        switch (this.props.sprite) {
            case SpriteCode.GRASS:
                return grass;
            case SpriteCode.WATER1:
                return water1;
            case SpriteCode.WATER2:
                return water2;
            case SpriteCode.WATER3:
                return water3;
            case SpriteCode.WATER4:
                return water4;
            case SpriteCode.BLOCK:
                return block1;
            case SpriteCode.RVDOOR:
                return regularDoorV;
            case SpriteCode.RVDOORO:
                return regularDoorVopen;
            case SpriteCode.RHDOOR:
                return regularDoorH;
            case SpriteCode.RHDOORO:
                return regularDoorHopen;
        
            default:
                return grass;
        }
    }
    
    render() {
        let textureType = {
            backgroundImage: `url(${this.getItemType()})`,
        }
        return (
            <div className='playground-item' style={textureType}>
                {this.getMushroom()}
                {this.getSprite()}
            </div>
        )
    }
}

export default PlaygroundItem
