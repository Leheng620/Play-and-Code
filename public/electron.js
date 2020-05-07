// Modules to control application life and create native browser window
const {app, BrowserWindow, screen} = require('electron')
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
    // default is false and will improve security preventing from accessing local file
    // This step is important if want to access local file!!!!!!!
    webPreferences: {
      nodeIntegration: true 
    }
  })

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

/* --------------------Start Background Process-------s------------- */
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
  
    hiddenWindow.webContents.openDevTools();
  
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
	mainWindow.webContents.send('RETURNED-FROM-PYTHON-SCRIPT', args.message);
});

// This listener only listens one time when the background process is first created
ipcMain.on('BACKGROUND_READY', (event, args) => {
	event.reply('START_PROCESSING', data);
});