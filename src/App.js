import React,{ Component } from 'react'
import Playground from './Component/Playground'

import bg from './img/background1.jpg'

import './cgame.css'
//import './App.css';
//import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />


class App extends Component{
  render(){
    return (
        <div className='background'>
          {/* <img src={bg} style={{width:'100%', height:'100%'}} /> */}
          {/* <Playground />   */}

        </div>
    );
  }
}
export default App;
