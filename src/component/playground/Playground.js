import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PlaygroundProperty, SpriteCode, Facing } from '../constants/CgameConstant'
import { PlaygroundRow } from "./PlaygroundRow";
import CodePanel from './CodePanel'
import { readLevel as tempBoard, totalLevels, levelData} from '../../level/LevelReader'
import mushroomYellow from '../sprite/mushroom_yellow.png'

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
                <img src={mushroomYellow} />
                {(props.target-props.remaining) + '/' + props.target}
            </div>
        </div>
    )
}

export class Playground extends Component {

    // a playgroundBoard is 15 x 10 matrix, each represent a grid
    state = {
        playgroundBoard : tempBoard(0).playgroundBoard,
        itemBoard : tempBoard(0).itemBoard,
        playerx: 0, // initial position of the character
        playery: 0,
        direction: -1, // initial facing direction of character
        interval: null,
        speed: 0.6,
        target: 2, // the target amount of mushroom
        remaining: 0,
        success : false, // indicate if level successfully complete
        failed: {taskFailed: false, error: ""}, // indicate if current attempt has failed
        currentLevel: 0,
        currentLevelLimit: 0,
        totalLevelLimit: 0,
        code: "",
        defaultCode: "",
        title: "",
        guide: "",
        showMenu: false,
        doors: [],
        random : true,
        playerName: "",
        running: false,
    }

    componentDidMount = () =>{
        // console.log(this.props)
        const data = this.props.location.state.store
        let playgroundBoard = JSON.parse(JSON.stringify(tempBoard(data.currentLevel).playgroundBoard))
        let itemBoard = JSON.parse(JSON.stringify(tempBoard(data.currentLevel).itemBoard))
        
        //}
        this.setState({
            playgroundBoard: playgroundBoard, 
            itemBoard : itemBoard, 
            playerx: tempBoard(data.currentLevel).playerInfo.x, 
            playery: tempBoard(data.currentLevel).playerInfo.y, 
            direction: tempBoard(data.currentLevel).playerInfo.direction,
            target : tempBoard(data.currentLevel).levelMission.target,
            remaining : tempBoard(data.currentLevel).levelMission.target,
            title : tempBoard(data.currentLevel).title,
            guide : tempBoard(data.currentLevel).guide,
            currentLevel: data.currentLevel,
            currentLevelLimit: data.levels.length,
            totalLevelLimit: totalLevels,
            success: false,
            failed: {taskFailed: false, error: ""},
            code: data.levels[data.currentLevel].code,
            defaultCode: data.levels[data.currentLevel].code,
            random: tempBoard(data.currentLevel).random,
            playerName : data.playerName,
        })
    }

    /*
        Get the new position of the character if move_forward is called
    */
    moveForward = (x, y, d) =>{
        let nx, ny, nd;
        switch (d) {
            case -1: // go right one step
                nx = x;
                ny = y+1;
                nd = d;
                break;
            case -2: // go down one step
                nx = x+1;
                ny = y;
                nd = d;
                break;
            case -3: // go left one step
                nx = x;
                ny = y-1;
                nd = d;
                break;
            case -4: // go up one step
                nx = x-1;
                ny = y;
                nd = d;
        }
        return [nx, ny, nd]

    }

    /*
        When the player hits run, python code will be sent to the background 
        process and the script will be interpreted. The result return with a
        encoded message, and this function will be invoked and parse the encoded
        message.
    */
    parseScript = (e, args) =>{
        const data = this.props.location.state.store
        this.setState({
            itemBoard : JSON.parse(JSON.stringify(tempBoard(data.currentLevel).itemBoard)), 
            playerx: tempBoard(data.currentLevel).playerInfo.x, 
            playery: tempBoard(data.currentLevel).playerInfo.y, 
            direction: tempBoard(data.currentLevel).playerInfo.direction,
            target : tempBoard(data.currentLevel).levelMission.target,
            remaining : tempBoard(data.currentLevel).levelMission.target,
            success : false,
            failed: {
                taskFailed:false,
                error: ""
            }
        }, ()=>{
            let code = args.message; // encoded message of the character movement
            if(args.error){
                this.setState({failed: {taskFailed: false, error: code}, running:false})
                return;
            }
            let i = 0;
            let speed = this.state.speed;
            let interval = setInterval(()=>{
                if(i === code.length){
                    if(this.state.remaining === 0){ // result is correct
                        let currentLevelLimit = this.state.currentLevelLimit
                        let currentLevel = this.state.currentLevel
                        if(currentLevelLimit !== this.state.totalLevelLimit){
                            if(currentLevel === currentLevelLimit - 1){
                                this.storeData(null, null, null, 1) // unlock new level
                                this.setState({success: true, currentLevelLimit: currentLevelLimit+1, running: false})
                            }
                            else{
                                this.setState({success:true, running: false})
                            }
                        }else{
                            this.setState({success: true, running: false})
                        }
                    }else{
                        this.setState({failed: {taskFailed:true, error:""}, running:false})
                    }
                    clearInterval(interval);
                }
                // this.setState({board:state[i]},()=>{i++})
                let newState = this.nextStep(code[i]);
                this.setState({interval: interval})
                this.setState(newState, ()=>{i++})
            }, (1-speed)*1000)
        })
    }

    /*
        Determine the next step according to the encoded message from background process
        Return a new state of the next step
    */
    nextStep = (code) =>{
        let x = this.state.playerx;
        let y = this.state.playery;
        let d = this.state.direction;
        let nx, ny, nd;
        let move = false
        let pickup = false;
        let button = false;
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
                nd = d + 1 == 0 ? -4 : d + 1;
                break;
            case 'R': // turn right
                nx = x
                ny = y
                nd = d - 1 == -5 ? -1 : d - 1;
                break;
            case 'P': // pickup
                nx = x
                ny = y
                nd = d
                pickup = true
                break;
            case 'B':
                nx = x
                ny = y
                nd = d
                button = true
            default:
                break;
        }
        // console.log(code, nx, ny, move)
        if(this.isValidStep(nx, ny)){
            let board = this.state.playgroundBoard;
            let itemBoard = this.state.itemBoard;
            let remaining = this.state.remaining
            if(move){
                board[x][y] = 0
            }
            if(pickup && itemBoard[nx][ny] == 1){
                itemBoard[nx][ny] = 0;
                remaining --;
            }
            if(button){
                board = this.openDoor(board, nx, ny, nd)
            }
            // console.log(nx, ny, nd, code)
            board[nx][ny] = nd;
            return({
                playerx: nx,
                playery: ny,
                playgroundBoard: board,
                itemBoard: itemBoard,
                direction: nd,
                remaining : remaining,
            })
        }else{
            return this.state
        }
    }

    // check if next step is valid
    isValidStep = (x, y) =>{
        let board = this.state.playgroundBoard;
        if(x >= 0 && x < PlaygroundProperty.ROW && y >= 0 && y < PlaygroundProperty.COL 
            && ((board[x][y] >= Facing.NORTH && board[x][y] <= 0) || 
            (board[x][y] == SpriteCode.RVDOORO || board[x][y] == SpriteCode.RHDOORO)) ){
            return true;
        }else{
            return false;
        }
    }

    openDoor = (board, x, y, d) =>{
        let re = this.moveForward(x, y, d)
        let nx = re[0]
        let ny = re[1]
        let nd = re[2]
        if(nx >= 0 && nx < PlaygroundProperty.ROW && ny >= 0 && ny < PlaygroundProperty.COL){
            if((nd === Facing.NORTH || nd === Facing.SOUTH)&&
                (board[nx][ny] === SpriteCode.RHDOOR || board[nx][ny] === SpriteCode.RHDOORO)){
                board[nx][ny] = board[nx][ny] === SpriteCode.RHDOOR ? SpriteCode.RHDOORO : SpriteCode.RHDOOR
            }else if((nd === Facing.EAST || nd === Facing.WEST)&&
            (board[nx][ny] === SpriteCode.RVDOOR || board[nx][ny] === SpriteCode.RVDOORO)){
                board[nx][ny] = board[nx][ny] === SpriteCode.RVDOOR ? SpriteCode.RVDOORO : SpriteCode.RVDOOR
            }
        }
        return board
    }

    /*
        Cancel running script
    */
    cancelRunning = () =>{
        if(this.state.interval != null){
            clearInterval(this.state.interval)
            this.setState({interval: null, running: false})
        }
    }

    reset = ()=>{
        const data = this.props.location.state.store
        let playgroundBoard = JSON.parse(JSON.stringify(tempBoard(data.currentLevel).playgroundBoard))
        this.setState({
            playgroundBoard: playgroundBoard,
            itemBoard : JSON.parse(JSON.stringify(tempBoard(data.currentLevel).itemBoard)), 
            playerx: tempBoard(data.currentLevel).playerInfo.x, 
            playery: tempBoard(data.currentLevel).playerInfo.y, 
            direction: tempBoard(data.currentLevel).playerInfo.direction,
            target : tempBoard(data.currentLevel).levelMission.target,
            remaining : tempBoard(data.currentLevel).levelMission.target,
            success : false,
            failed: {
                taskFailed:false,
                error: ""
            }
        })
    }

    // generate component <PlaygroundRow>
    getPlaygroundItemRow = () =>{
        let pg = []
        for(let i = 0; i < PlaygroundProperty.ROW; i++){
            pg.push(
                <PlaygroundRow 
                key={i} 
                playgroundBoardRow={this.state.playgroundBoard[i]}
                itemBoardRow = {this.state.itemBoard[i]}
                 
                />
            )
        }
        return pg;
    }

    // To see if the current task succeeds or not, get the corresponding
    // block content and button.
    getErrorMessage = () =>{
        let success = this.state.success
        let codeError = this.state.failed.error=="" ? false : true
        let failed = this.state.failed.taskFailed
        if(success || codeError || failed){
            if(success){
                return(
                    <div className='block-input' hidden={false}>
                        <div className='block-content'>
                            Congratulations!
                            <br />
                            {this.state.playerName}
                        </div>
                        <button className='block-button' onClick={()=>{this.setState({success:false})}}>
                            Close
                        </button>
                    </div>
                )
            }else if(codeError){
                return(
                    <div className='block-input' hidden={false}>
                        <div className='block-content'>
                            {this.state.failed.error + "."}
                            <br />
                            Pleace check the code carefully!
                        </div>
                        <button className='block-button' onClick={()=>{this.setState({failed:{taskFailed:false, error:''}})}}>
                            Close
                        </button>
                    </div>
                )
            }else{
                return(
                    <div className='block-input' hidden={false}>
                        <div className='block-content'>
                            You didn't finish the mission!
                            <br />
                            Please Check your code and try again!
                        </div>
                        <button className='block-button' onClick={()=>{this.setState({failed:{taskFailed:false, error:''}})}}>
                            Close
                        </button>
                    </div>
                )
            }
        }
    }

    /*
        Get the option component of the dropdown menu
    */
    getDropdownOptions = () =>{
        let levels = levelData
        let levelList = []
        let currentLevel = this.state.currentLevel
        let currentLevelLimit = this.state.currentLevelLimit
        for(let i = 0; i < levels.length; i++){
            levelList.push(
            <option disabled={i >= currentLevelLimit} key={i}>
                {levels[i].title}
            </option>
            )
        }
        return levelList
    }

    /*
        Get the sound effect
    */
   getSoundEffect = () =>{
       let soundEffect = this.state.soundEffect
       let result = []
       return result
   }

    /*
        This function is called when the code is run, and it will randomize
        the condition of all doors if the flag random is turn on
    */
    randomizeDoor = () =>{
        const data = this.props.location.state.store
           
        let playgroundBoard = JSON.parse(JSON.stringify(tempBoard(data.currentLevel).playgroundBoard))
        let ran = this.state.random
        let doors = []
        for(let i = 0; i < PlaygroundProperty.ROW; i++){
            for(let j = 0; j < PlaygroundProperty.COL; j++){
                // it is a door
                if(playgroundBoard[i][j] >= 6 && playgroundBoard[i][j] <= 9){
                    if(ran){    
                        let door = playgroundBoard[i][j]
                        let newDoor
                        if(door === SpriteCode.RVDOOR || door === SpriteCode.RVDOORO){
                            newDoor = Math.floor(Math.random()*2+SpriteCode.RVDOOR)
                            playgroundBoard[i][j] = newDoor
                        }else{
                            newDoor = Math.floor(Math.random()*2+SpriteCode.RHDOOR)
                            playgroundBoard[i][j] = newDoor
                        }
                        doors.push(newDoor)
                    }else{
                        doors.push(playgroundBoard[i][j]);
                    }
                }
            }
        }
        this.setState({doors: doors, playgroundBoard: playgroundBoard, defaultCode: this.state.code, running: true})
        return doors
    }

    /*
        When code is entered, save it to the local data file.
    */
    processEnterCode = (editor, data, value) => {

        // console.log(editor)
        // console.log(data)
        // console.log(value)
        this.setState({code:value}, ()=>{
            this.storeData(this.state.code, null, null, null)
        })
    }

    /*
        Change the running speed
    */
   changeSpeed = (e) =>{
        this.setState({speed: Number(e.target.value)})
   }

    /*
        Store any changed data into local data file
    */
    storeData = (codeChange, currentLevelChange, playerNameChange, currentLevelLimitChange) =>{
        const data = this.props.location.state.store
        if(codeChange !== null){
            data.levels[data.currentLevel].code = codeChange
        }
        if(currentLevelChange !== null){
            data.currentLevel = currentLevelChange
        }
        if(playerNameChange !== null){
            data.playerName = playerNameChange
        }
        if(currentLevelLimitChange !== null){
            data.levels.push({code:""})
        }
        ipcRenderer.send('SAVE-DATA-REQUEST-FROM-RENDERER', data);
    }

    navigateLevel = (level) =>{
        this.storeData(null, level, null, null)
        const data = this.props.location.state.store
        let next = level
        let playgroundBoard = JSON.parse(JSON.stringify(tempBoard(next).playgroundBoard))
        let itemBoard = JSON.parse(JSON.stringify(tempBoard(next).itemBoard))
        let defaultCode = data.levels[next].code
        // console.log(defaultCode)
        this.setState({
            playgroundBoard: playgroundBoard, 
            itemBoard : itemBoard, 
            playerx: tempBoard(next).playerInfo.x, 
            playery: tempBoard(next).playerInfo.y, 
            direction: tempBoard(next).playerInfo.direction,
            target : tempBoard(next).levelMission.target,
            remaining : tempBoard(next).levelMission.target,
            title : tempBoard(next).title,
            guide : tempBoard(next).guide,
            currentLevel: next,
            success: false,
            failed: {taskFailed: false, error: ""},
            code: data.levels[next].code,
            defaultCode: defaultCode,
            random: tempBoard(next).random,
        })
    }

    render() {
        // console.log(this.props.location.state.store)
        // console.log(this.state.code)
        return (
        <div className='background'>
          {/* <img src={bg} style={{width:'100%', height:'100%'}} /> */}
            <div className='top-right'>
                <button className='level-navigator top-right-item' 
                disabled={this.state.currentLevel===0}
                onClick={()=>{
                    this.navigateLevel(this.state.currentLevel-1)
                }}
                >
                    previous
                </button>
                <div className='menu-tricker top-right-item' 
                    onClick={()=>{this.setState({showMenu:true})}}>
                    menu
                </div>
                <button className='level-navigator top-right-item' 
                    disabled={this.state.currentLevel===this.state.currentLevelLimit-1}
                    onClick={()=>{
                        this.navigateLevel(this.state.currentLevel+1)
                    }}
                >
                    next
                </button>
            </div>
            
            <LevelHeader title={this.state.title} target={this.state.target} remaining={this.state.remaining} />
            
            <CodePanel parseScript={this.parseScript} processEnterCode={this.processEnterCode}
                defaultCode={this.state.defaultCode} code={this.state.code} guide={this.state.guide} 
                doors={this.state.doors} randomizeDoor={this.randomizeDoor} cancelRunning={this.cancelRunning}
                running={this.state.running} speed={this.state.speed} changeSpeed={this.changeSpeed}
                reset={this.reset}
            />

            {this.getErrorMessage()}

            <div className='playground-container'>
                <div className='playground-wrapper'>
                    {this.getPlaygroundItemRow()}
                </div>
                {/* <Link to={'/'}>aaa</Link> */}
                {/* <button onClick={()=>{this.props.history.goBack()}}>aaaa</button> */}
                {/* <Link to={'/'}>aaa</Link> */}
            </div>

            <div className='menu-block' hidden={!this.state.showMenu}></div>
            <div className='menu' hidden={!this.state.showMenu}>
                <div className='menu-content'>
                    <span style={{top:'25%', fontSize:'172%',position:'relative',fontWeight:'800'}}>MENU</span>
                </div>
                <div className='menu-content'>
                    <button className='menu-button'>
                        <Link className='link-to-home' style={{display:'block', color:'black',textDecoration:'none'}} to={'/'}>MAIN MENU</Link>
                    </button>
                </div>
                <div className='menu-content'>
                    <label style={{top: '20%',position:'relative',fontSize:'140%'}} htmlFor='dropdown-levels'>Levels: </label>
                    <select className='dropdown-levels' value={this.state.title} 
                    onChange={(e)=>{this.navigateLevel(e.target.selectedIndex)}}>
                        {this.getDropdownOptions()}
                    </select>
                </div>
                <div className='menu-content'>
                    <button className='menu-button' onClick={()=>{this.setState({showMenu:false})}}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
        )
    }
}
export default Playground
