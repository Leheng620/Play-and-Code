import React, { Component } from 'react'
import LittleMan from '../character/LittleMan'
import Mushroom from '../character/Mushroom'
import grass from '../sprite/grass.jpg'
import water1 from '../sprite/water1.jpg'
import block1 from '../sprite/block1.jpg'

export class PlaygroundItem extends Component {

    // Get the character on the grid
    getSprite = () =>{
        switch(this.props.item){
            case -1: 
            case -6:
                return (<LittleMan direction={'face-right'} />)
            case -2: 
            case -7:
                return (<LittleMan direction={''} />)
            case -3: 
            case -8:
                return (<LittleMan direction={'face-left'} />)
            case -4: 
            case -9:
                return (<LittleMan direction={'face-up'} />)
        }
    }

    getMushroom = () =>{
        if(this.props.item <= -6 && this.props.item >= -9 ){
            return(<Mushroom hasSprite={true} />);
        }else if(this.props.item == -5){
            return(<Mushroom hasSprite={false} />);
        }
    }    

    // Get the type of the grid, could be grass or block or something else
    getItemType = () =>{
        switch (this.props.item) {
            case 0:
                return grass;
            case 1:
                return water1;
            case 2:
                return block1;
        
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
