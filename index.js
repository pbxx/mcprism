const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {MCProxy} = require("./mcproxy.js")
const os = require('node:os');

console.log(os.networkInterfaces())

var globalState = {
  serverList: [],
  activeServerIndex: -1
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 700,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    //frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("dist/index.html");
  // Open the DevTools.
  win.webContents.openDevTools({ mode: "detach" })
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



ipcMain.on('toMain', (event, arg) => {
  console.log(arg) // prints "ping" in the Node console
  // works like `send`, but returning a message back
  // to the renderer that sent the original message
  if (arg.command == 'addServer') {
    //add a server to saved servers
    var serverObject = { name: arg.name, address: arg.address, active: false }
    globalState.serverList.push(serverObject)
    event.reply('fromMain', { command: 'updateState', state: globalState })

    
  } else if (arg.command == 'deleteServer') {
    //handle deletion request
    //currently just shut down active proxy set
    globalState.serverList.splice(arg.index, 1)
    event.reply('fromMain', { command: 'updateState', state: globalState })

  } else if (arg.command == "activateProxy") {
    
    activateProxy(arg.index, "10.88.0.117", () => {
      event.reply('fromMain', { command: 'updateState', state: globalState })

    })

    
  } else if (arg.command == "deactivateProxy") {
    deactivateProxy((response) => {
      //proxy deactivated
      event.reply('fromMain', { command: 'updateState', state: globalState })
    })


  } else if (arg.command == "closeWindow") {
    //event.sender.close()
    BrowserWindow.getAllWindows()[event.sender.id-1].close()
  } else if (arg.command == "minimizeWindow") {
    //event.sender.minimize()
    BrowserWindow.getAllWindows()[event.sender.id-1].minimize()
    //console.log(event.sender.id)

  }
})

var activeServer = null;

function activateProxy(index, interface, callback) {
  if (globalState.activeServerIndex == -1) {
    console.log(`IM RUNNING`)
    activeServer = new MCProxy({verbose: true, host: globalState.serverList[index].address, interface}, (response) => {
      console.log(response)

      globalState.activeServerIndex = index //set active server globally

      if (callback) {
        callback(response)
      }

    })
    globalState.serverList[index].active = true
  } else {
    //there is already an active proxy
  }
}

function deactivateProxy(callback) {
  //var activeServer = globalState.serverList[globalState.activeServerIndex]
  activeServer.close(() => {
    //all proxies closed
    console.log(`All proxies closed successfully!`)

    globalState.serverList[globalState.activeServerIndex].active = false //set the active flag to false
    globalState.activeServerIndex = -1 //set activeServer to null to prepare for re-activation
    activeServer = null

    if (callback) {
      callback(`All proxies closed successfully!`)
    }
  })
}
