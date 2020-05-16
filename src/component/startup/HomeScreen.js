import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import Store from '../../../savefile_process/Store'
import gamename from '../../img/gamename.png'

const electron = window.require('electron');
const { ipcRenderer } = electron;

export class HomeScreen extends Component {

    state = {
        data: null,
        hideResetConfirm: true,
    }
    componentDidMount = () =>{
        // ask the localstorage process to start and retrieve data from there
        ipcRenderer.send('START_LOCALSTORAGE_VIA_MAIN');
        ipcRenderer.on('RETURN-FROM-LOCALSTORAGE-PROCESS', this.handleReturnData);
    }

    handleReturnData = (event, args) =>{
        this.setState({data: args})
    }

    reset = () =>{
        let defaultData = {
            levels:[{
                code: ''
            }],
            currentLevel:0,
            playerName: 'PLAYER'
        }
        ipcRenderer.send('SAVE-DATA-REQUEST-FROM-RENDERER', defaultData);
        this.setState({data: defaultData, hideResetConfirm: true})
    }

    render() {
        return (
            <div className='home-container'>
                <div className='game-title'>
                    <img src={gamename} style={{width:'118%',height:'161%',marginTop:'7%'}} />
                </div>
                <div className='home-menu'>
                    <div className='home-menu-content'>
                        <div className='home-menu-player-span'>
                            Hello 
                        </div>
                        <input className='home-menu-player-input' 
                        value={this.state.data === null ? "player" : this.state.data.playerName}
                        maxLength='50'
                        onChange={(e)=>{
                            let data = this.state.data
                            data.playerName = e.target.value
                            // store player name in local file
                            ipcRenderer.send('SAVE-DATA-REQUEST-FROM-RENDERER', data);
                            this.setState({data: data})
                        }}
                        /> 
                        
                    </div>
                    <div className='home-menu-content'>
                        <button className='home-menu-button'>
                            <Link to={{pathname:'/playground', state: {store:this.state.data}}}
                                style={{display:'block', textDecoration:'none', color:'black'}}
                            >
                                PLAY
                            </Link>
                        </button>
                    </div>
                    <div className='home-menu-content'>
                        <button className='home-menu-button' onClick={()=>{this.setState({hideResetConfirm: false})}}>
                            RESET
                        </button>
                    </div>
                    <div className='home-menu-content'>
                        <button className='home-menu-button'>
                            EXIT
                        </button>
                    </div>
                </div>
                <div className='reset-confirmation' hidden={this.state.hideResetConfirm}>
                    <p>Your record will be removed</p>
                    <p>This is not undoable</p>
                    <br />
                    <p>Are you sure?</p>
                    <button className='reset-yes reset-button' onClick={this.reset}>
                        Yes
                    </button>
                    <button className='reset-no reset-button' 
                        onClick={()=>{this.setState({hideResetConfirm: true})}}
                    >
                        No
                    </button>
                </div>
            </div>
        )
    }
}

export default HomeScreen
