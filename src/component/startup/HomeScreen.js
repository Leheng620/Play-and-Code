import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import Store from '../../../savefile_process/Store'

const electron = window.require('electron');
const { ipcRenderer } = electron;

export class HomeScreen extends Component {

    state = {
        data: null
    }
    componentDidMount = () =>{
        // ask the localstorage process to start and retrieve data from there
        ipcRenderer.send('START_LOCALSTORAGE_VIA_MAIN');
        ipcRenderer.on('RETURN-FROM-LOCALSTORAGE-PROCESS', this.handleReturnData);
    }

    handleReturnData = (event, args) =>{
        this.setState({data: args})
    }

    render() {
        return (
            <div className='home-container'>
                <h1>Home Screen</h1>
                <Link to={{
                    pathname:'/playground', state: {store:this.state.data}
                }}>
                    Click
                </Link>
            </div>
        )
    }
}

export default HomeScreen
