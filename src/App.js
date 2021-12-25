import React,{ Component } from 'react'
import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'
import Playground from './component/playground/Playground'
import HomeScreen from './component/startup/HomeScreen'


import './css/cgame.css'
import './css/character.css'
//import './App.css';
//import logo from './logo.svg';
//<img src={logo} className="App-logo" alt="logo" />


class App extends Component{
  render(){
    return (
        <HashRouter>
            <div>
              <Switch>
                <Route exact path='/' component={HomeScreen} />
                <Route path='/playground' component={Playground} />
              </Switch>
            </div>
        </HashRouter>
    );
  }
}
export default App;
