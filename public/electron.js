// Modules to control application life and create native browser window
const {app, BrowserWindow, screen, Menu} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');

const { ipcMain } = require('electron')
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Get maximized window size
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width,
    height,
    resizable:false,
    icon:path.join(__dirname, './icon.png'),
    show: false, // in order to make the scale work, this step is important
    // default is false and will improve security preventing from accessing local file
    // This step is important if want to access local file!!!!!!!
    webPreferences: {
      nodeIntegration: true ,
    }
  })
  let zoomFactor = ((width / 1271.52 + height / 688.74) / 2).toFixed(2) // scale the app based on current window resolution
  mainWindow.once("ready-to-show", () => {
    mainWindow.webContents.zoomFactor = Number(zoomFactor);
    mainWindow.show();
  });
  
  Menu.setApplicationMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(
      isDev ? "http://localhost:3000" : 
      `file://${path.join(__dirname, "../build/index.html")}`
    )

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/* --------------------Start Background Run Script Process-------------------- */
// temporary variable to store data while background
// process is ready to start processing
let data = {
  args: undefined,
  code: undefined,
};

// a window object outside the function scope prevents
// the object from being garbage collected
let hiddenWindow = null;

/*
  This is a callback function called by the listener when receiving
  data from the UI process. The data is the code that player typed in
*/
function createProcess(event, msg){
  // create a new hidden window/process
  if(hiddenWindow == null){
    const backgroundFileUrl = url.format({
      pathname: path.join(__dirname, `/../runscript_process/background.html`),
      protocol: 'file:',
      slashes: true,
    });
    hiddenWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    hiddenWindow.loadURL(backgroundFileUrl);
  
    // hiddenWindow.webContents.openDevTools();
  
    hiddenWindow.on('closed', () => {
      hiddenWindow = null;
    });
  
    data.args = msg.args;
    data.code = msg.code;
  }else{
    // if process has created, send data to the background process
    data.args = msg.args;
    data.code = msg.code;
    hiddenWindow.webContents.send('START_PROCESSING', data);
  }
}
// This event listener will listen for request
// from visible renderer process
ipcMain.on('START_BACKGROUND_VIA_MAIN', createProcess);

// This event listener will listen for data being sent back
// from the background renderer process, then return the result to the UI(React) process
ipcMain.on('RETURN-FROM-BACKGROUND', (event, args) => {
	mainWindow.webContents.send('RETURNED-FROM-PYTHON-SCRIPT', args);
});

// This listener only listens one time when the background process is first created
ipcMain.on('BACKGROUND_READY', (event, args) => {
	event.reply('START_PROCESSING', data);
});


/* --------------------Start Background Localstorage Process-------------------- */
let localStorageWindow = null
function createLocalStorageProcess(){
   // create a new hidden window/process
   if(localStorageWindow == null){
    const backgroundFileUrl = url.format({
      pathname: path.join(__dirname, `/../localstorage_process/localstorage.html`),
      protocol: 'file:',
      slashes: true,
    });
    localStorageWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    localStorageWindow.loadURL(backgroundFileUrl);
  
    // localStorageWindow.webContents.openDevTools();
  
    localStorageWindow.on('closed', () => {
      localStorageWindow = null;
    });
  
  }else{
    // if process has created, send data to the background process
    localStorageWindow.webContents.send('START-PROCESSING-LOCALSTORAGE');
  }
}
ipcMain.on('START_LOCALSTORAGE_VIA_MAIN', createLocalStorageProcess)

ipcMain.on('LOCALSTORAGE-READY', (event)=>{
    event.reply('START-PROCESSING-LOCALSTORAGE')
})

ipcMain.on('RETURN-FROM-LOCALSTORAGE', (event, args)=>{
    mainWindow.webContents.send('RETURN-FROM-LOCALSTORAGE-PROCESS',args)
})

function saveData(event, args){
    localStorageWindow.webContents.send('SAVE-DATA-REQUEST-TO-LOCAL-STORAGE', args)
}
ipcMain.on('SAVE-DATA-REQUEST-FROM-RENDERER', saveData);