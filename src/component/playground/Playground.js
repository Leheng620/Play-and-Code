import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PlaygroundProperty } from '../constants/CgameConstant'
import { PlaygroundItem } from "./PlaygroundItem";
import { PlaygroundRow } from "./PlaygroundRow";
import LittleMan from '../character/LittleMan'
import CodePanel from './CodePanel'
import * as tempBoard from '../../level/LevelReader'

function LevelHeader(props){
    return(
        <div className='playground-header'>
            <div className='level-name'>

            </div>
            <div className='level-progress'>

            </div>
        </div>
    )
}

export class Playground extends Component {

    // a playgroundBoard is 15 x 10 matrix, each represent a grid
    state = {
        playgroudBoard : tempBoard.board,
        playerx: 0, // initial position of the character
        playery: 0,
        direction: -1, // initial facing direction of character
        interval: null,
        speed: 0.6
    }

    componentDidMount = () =>{
        this.setState({
            playgroudBoard: JSON.parse(JSON.stringify(tempBoard.board)), 
            playerx: tempBoard.playerInfo.x, 
            playery: tempBoard.playerInfo.y, 
            direction: tempBoard.playerInfo.direction
        })
    }

    moveForward = (x, y, d) =>{
        let nx, ny, nd;
        switch (d) {
            case -1: // go right one step
            case -6:
                nx = x;
                ny = y+1;
                nd = d;
                break;
            case -2: // go down one step
            case -7:
                nx = x+1;
                ny = y;
                nd = d;
                break;
            case -3: // go left one step
            case -8:
                nx = x;
                ny = y-1;
                nd = d;
                break;
            case -4: // go up one step
            case -9:
                nx = x-1;
                ny = y;
                nd = d;
        }
        return [nx, ny, nd]

    }

    parseScript = (e, args) =>{
        this.setState({
            playgroudBoard: JSON.parse(JSON.stringify(tempBoard.board)), 
            playerx: tempBoard.playerInfo.x, 
            playery: tempBoard.playerInfo.y, 
            direction: tempBoard.playerInfo.direction
        }, ()=>{
            let code = args.message; // encoded message of the character movement
            let i = 0;
            let speed = this.state.speed;
            let interval = setInterval(()=>{
                if(i === code.length){
                    clearInterval(interval);
                }
                // this.setState({board:state[i]},()=>{i++})
                let newState = this.nextStep(code[i]);
                this.setState(newState, ()=>{i++})
            }, (1-speed)*1000)
        })
    }

    nextStep = (code) =>{
        let x = this.state.playerx;
        let y = this.state.playery;
        let d = this.state.direction;
        let nx, ny, nd;
        let move = false
        let pickup = false;
        // console.log(x, y, d)
        switch (code) {
            case 'F': // move forward one step
                // check where is the character facing
                let re = this.moveForward(x,y,d);
                move = true;
                nx = re[0]
                ny = re[1]
                nd = re[2]
                break;
            case 'L': // turn left
                nx = x
                ny = y
                if(d < -4){
                    nd = d + 1 == -4 ? -9 : d + 1;
                }else{
                    nd = d + 1 == 0 ? -4 : d + 1;
                }
                break;
            case 'R': // turn right
                nx = x
                ny = y
                if(d < -4){
                    nd = d - 1 == -10 ? -5 : d - 1;
                }else{
                    nd = d - 1 == -5 ? -1 : d - 1;
                }
                break;
            case 'P': // pickup
                nx = x
                ny = y
                nd = d
                pickup = true
            default:
                break;
        }
        if(this.isValidStep(nx, ny)){
            let board = this.state.playgroudBoard;
            if(move){
                if(board[x][y] < -4){
                    board[x][y] = -5
                }else{
                    board[x][y] = 0
                }
            }
            if(pickup && board[nx][ny] <= -5){
                board[nx][ny]-=5;
            }
            nd = this.containMushroom(board, nx, ny, nd);
            console.log(nx, ny, nd, code)
            board[nx][ny] = nd;
            return({
                playerx: nx,
                playery: ny,
                playgroudBoard: board,
                direction: nd
            })
        }else{
            return this.state
        }
    }

    // check if next step is valid
    isValidStep = (x, y) =>{
        let board = this.state.playgroudBoard;
        if(x >= 0 && x < PlaygroundProperty.ROW && y >= 0 && y < PlaygroundProperty.COL && board[x][y] >= -9 && board[x][y] <= 0){
            return true;
        }else{
            return false;
        }
    }

    // if the next step contains mushroom, need to adjust the value of the board
    containMushroom = (board, x, y, nd) =>{
        if(board[x][y] === -5){
            if(nd > -5){
                nd-=5;
            }
        }else{
            if(nd < -5){
                nd += 5;
            }
        }
        return nd;
    }

    // generate component <PlaygroundRow>
    getPlaygroundItemRow = () =>{
        let pg = []
        for(let i = 0; i < PlaygroundProperty.ROW; i++){
            pg.push(
                <PlaygroundRow 
                key={i} 
                playgroudBoardRow={this.state.playgroudBoard[i]}
                 
                />
            )
        }
        return pg;
    }

    render() {
        return (
        <div className='background'>
          {/* <img src={bg} style={{width:'100%', height:'100%'}} /> */}
            
            <LevelHeader />
            
            <CodePanel parseScript={this.parseScript} />

            <div className='playground-container'>
                <div className='playground-wrapper'>
                    {this.getPlaygroundItemRow()}
                </div>
                {/* <Link to={'/'}>aaa</Link> */}
                <button onClick={()=>{this.props.history.goBack()}}>aaaa</button>
            </div>
        </div>
        )
    }
}
export default Playground
