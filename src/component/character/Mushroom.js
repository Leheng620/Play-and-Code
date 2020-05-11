import React, { Component } from 'react'
import mushroomYellow from '../sprite/mushroom_yellow.png'


export default class Mushroom extends Component {
    render() {
        return (
            <div style={this.props.hasSprite? {} : {}}>
   
                <img className='mushroom'
                    src={mushroomYellow} 
                     />

            </div>
        )
    }
}
