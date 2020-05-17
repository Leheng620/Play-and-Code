const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

class Store {
    constructor(opts) {
        // Get the application's current directory
        // const userDataPath = electron.remote.app.getPath('appData');
        const userDataPath = electron.remote.app.getAppPath();
        // We'll use the `fileName` property to set the file name and path.join to bring it all together as a string
        // const userDirectoryPath = path.join(userDataPath, 'playandcode')
        // if (!fs.existsSync(userDirectoryPath)){
        //     fs.mkdirSync(userDirectoryPath);
        // }
        // this.path = path.join(userDirectoryPath, opts.fileName + '.json');
        this.path = path.join(userDataPath, opts.fileName + '.json');
        this.path = path.normalize(this.path)
        // console.log(this.path)
        // this.data = parseDataFile(this.path, opts.defaults);
        this.defaults = opts.defaults
        this.data = null
    }
    
    // This will just return the property on the `data` object
    get(key) {
        return this.data[key];
    }
    
    // ...and this will set it
    set(key, val) {
        this.data[key] = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    setALL(val) {
        this.data = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}

function parseDataFile(filePath, defaults) {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch(error) {
        // if there was some kind of error, return the passed in defaults instead.
        return defaults;
    }
}
const defaultData = {
    levels:[{
        code: ''
    }],
    currentLevel:0,
    playerName: 'PLAYER'
}
const store = new Store({fileName:'playandcode',defaults: defaultData})
ipcRenderer.send('LOCALSTORAGE-READY');

function readFromLocalStorage(){
    store.data = parseDataFile(store.path, store.defaults);
    ipcRenderer.send('RETURN-FROM-LOCALSTORAGE', store.data)
}

ipcRenderer.on('START-PROCESSING-LOCALSTORAGE', readFromLocalStorage);

function saveData(event, args){
    store.setALL(args);
    console.log(store.data)
}
ipcRenderer.on('SAVE-DATA-REQUEST-TO-LOCAL-STORAGE', saveData)


