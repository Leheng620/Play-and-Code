import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class HomeScreen extends Component {

    render() {
        return (
            <div className='home-container'>
                <Link to={{
                    pathname:'/playground', state: {gg:0}
                }}>
                    Click
                </Link>
            </div>
        )
    }
}

export default HomeScreen
