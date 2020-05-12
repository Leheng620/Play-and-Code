import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PlaygroundProperty } from '../constants/CgameConstant'
import { PlaygroundItem } from "./PlaygroundItem";
import { PlaygroundRow } from "./PlaygroundRow";
import LittleMan from '../character/LittleMan'
import CodePanel from './CodePanel'
import tempBoard from '../../level/LevelReader'

const electron = window.require('electron');
const { ipcRenderer } = electron;

function LevelHeader(props){
    return(
        <div className='playground-header'>
            <div className='level-name'>
                {/* {props.success ? "Fuck yea" : ""}
                {props.failed.taskFailed ? "Fuck IDIOT" : ""}
                {props.failed.error ? props.failed.error : ""} */}
                {props.title}
            </div>
            <div className='level-progress'>
                why
            </div>
        </div>
    )
}

export class Playground extends Component {

    // a playgroundBoard is 15 x 10 matrix, each represent a grid
    state = {
        playgroudBoard : tempBoard(0).playgroundBoard,
        playerx: 0, // initial position of the character
        playery: 0,
        direction: -1, // initial facing direction of character
        interval: null,
        speed: 0.6,
        target: 2, // the target amount of mushroom
        success : false, // indicate if level successfully complete
        failed: {taskFailed: false, error: ""}, // indicate if current attempt has failed
        currentLevel: 0,
        currentLevelLimit: 0,
        code: "",
        defaultCode: "",
        title: "",
        guide: "",
    }

    componentDidMount = () =>{
        // console.log(this.props)
        const data = this.props.location.state.store
        this.setState({
            playgroudBoard: JSON.parse(JSON.stringify(tempBoard(data.currentLevel).playgroundBoard)), 
            playerx: tempBoard(data.currentLevel).playerInfo.x, 
            playery: tempBoard(data.currentLevel).playerInfo.y, 
            direction: tempBoard(data.currentLevel).playerInfo.direction,
            target : tempBoard(data.currentLevel).levelMission.target,
            title : tempBoard(data.currentLevel).title,
            guide : tempBoard(data.currentLevel).guide,
            currentLevelLimit: data.levels.length,
            success: false,
            failed: {taskFailed: false, error: ""},
            code: data.levels[0].code,
            defaultCode: data.levels[0].code,
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
        const data = this.props.location.state.store
        this.setState({
            playgroudBoard: JSON.parse(JSON.stringify(tempBoard(data.currentLevel).playgroundBoard)), 
            playerx: tempBoard(data.currentLevel).playerInfo.x, 
            playery: tempBoard(data.currentLevel).playerInfo.y, 
            direction: tempBoard(data.currentLevel).playerInfo.direction,
            target : tempBoard(data.currentLevel).levelMission.target,
            success : false,
            failed: {
                taskFailed:false,
                error: ""
            }
        }, ()=>{
            let code = args.message; // encoded message of the character movement
            if(args.error){
                this.setState({failed: {taskFailed: false, error: code}})
                return;
            }
            let i = 0;
            let speed = this.state.speed;
            let interval = setInterval(()=>{
                if(i === code.length){
                    if(this.state.target === 0){
                        this.setState({success: true})
                    }else{
                        this.setState({failed: {taskFailed:true, error:false}})
                    }
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
            let target = this.state.target
            if(move){
                if(board[x][y] < -4){
                    board[x][y] = -5
                }else{
                    board[x][y] = 0
                }
            }
            if(pickup && board[nx][ny] <= -5){
                board[nx][ny]-=5;
                target --;
            }
            nd = this.containMushroom(board, nx, ny, nd);
            console.log(nx, ny, nd, code)
            board[nx][ny] = nd;
            return({
                playerx: nx,
                playery: ny,
                playgroudBoard: board,
                direction: nd,
                target : target
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

    processEnterCode = (editor, data, value) => {

        // console.log(editor)
        // console.log(data)
        // console.log(value)
        this.setState({code:value}, ()=>{
            this.storeData(this.state.code, null, null)
        })
    }

    storeData = (codeChange, currentLevelChange, playerNameChange) =>{
        const data = this.props.location.state.store
        if(codeChange){
            data.levels[data.currentLevel].code = codeChange
        }
        if(currentLevelChange){
            data.currentLevel = currentLevelChange
        }
        if(playerNameChange){
            data.playerName = playerNameChange
        }
        ipcRenderer.send('SAVE-DATA-REQUEST-FROM-RENDERER', data);
    }

    render() {
        // console.log(this.props)
        // console.log(this.state.code)
        return (
        <div className='background'>
          {/* <img src={bg} style={{width:'100%', height:'100%'}} /> */}
            <div className='top-right'>
                <button className='level-navigator top-right-item'>previous</button>
                <div className='menu-tricker top-right-item'>menu</div>
                <button className='level-navigator top-right-item'>next</button>
            </div>

            <div className='menu'></div>
            
            <LevelHeader title={this.state.title} />
            
            <CodePanel parseScript={this.parseScript} processEnterCode={this.processEnterCode}
                defaultCode={this.state.defaultCode} code={this.state.code} guide={this.state.guide}
            />

            <div></div>

            <div className='playground-container'>
                <div className='playground-wrapper'>
                    {this.getPlaygroundItemRow()}
                </div>
                {/* <Link to={'/'}>aaa</Link> */}
                {/* <button onClick={()=>{this.props.history.goBack()}}>aaaa</button> */}
                <Link to={'/'}>aaa</Link>
            </div>
        </div>
        )
    }
}
export default Playground
