import React,{ Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Playground from './component/playground/Playground'
import HomeScreen from './component/startup/HomeScreen'

import bg from './img/background1.jpg'

import './cgame.css'
//import './App.css';
//import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />


class App extends Component{
  render(){
    return (
        <BrowserRouter>
            <div>
              <Switch>
                <Route exact path='/' component={HomeScreen} />
                <Route path='/playground' component={Playground} />
              </Switch>
            </div>
        </BrowserRouter>
    );
  }
}
export default App;
