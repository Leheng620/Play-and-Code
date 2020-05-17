import React, { Component } from 'react'
import littleMan from '../sprite/littleman.png'
import littleManShadow from '../sprite/littleman_shadow.png'
// import '../../css/character.css'
export class LittleMan extends Component {
    render() {
        return (
            <div className="little-man">
   
                <img className="little-man-shadow pixelart" 
                    src={littleManShadow} 
                     />
                <img className={"little-man-spritesheet pixelart " + this.props.direction }
                    src={littleMan} 
                     />

            </div>
        )
    }
}

export default LittleMan
