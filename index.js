const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {MCProxy} = require("./mcproxy.js")

var globals = {
  inactiveServerList: [],
  activeServer: null
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    //frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("dist/index.html");
  // Open the DevTools.
  win.webContents.openDevTools()
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
    var serverObject = { name: arg.name, address: arg.address }
    globals.inactiveServerList.push(serverObject)
    event.reply('fromMain', { command: 'updateServers', inactiveServerList: globals.inactiveServerList })

    
  } else if (arg.command == 'deleteServer') {
    //handle deletion request
    //currently just shut down active proxy set
    globals.inactiveServerList.splice(arg.index, 1)


  } else if (arg.command == "activateProxy") {
    activateProxy(arg.index, "10.88.0.117", () => {
      event.reply('fromMain', { command: 'updateStatus', proxyStatus: true, activeProxyAddress: globals.inactiveServerList[arg.index].address })
      
    })

    
  } else if (arg.command == "deactivateProxy") {
    deactivateProxy((response) => {
      //proxy deactivated
      event.reply('fromMain', { command: 'updateStatus', proxyStatus: false, activeProxyAddress: null })
    })


  }
})


function activateProxy(index, interface, callback) {
  if (!globals.activeServer) {
    var serverObj = {...globals.inactiveServerList[index]}
    var proxy = new MCProxy({verbose: true, host: serverObj.address, interface}, (response) => {
      console.log(response)

      globals.activeServer = {...serverObj, proxy, index} //set active server globally
      globals.inactiveServerList[index] = null //remove activated server from inactive list, but hold its place

      if (callback) {
        callback(response)
      }
    })
  }
}

function deactivateProxy(callback) {
  globals.activeServer.proxy.close(() => {
    //all proxies closed
    console.log(`All proxies closed successfully!`)
    //save the index for refilling the space in inactive servers
    var i = globals.activeServer.index
    //strip proxy and index from the server object
    delete globals.activeServer.proxy
    delete globals.activeServer.index

    globals.inactiveServerList[i] = globals.activeServer //put the once-active server object back into inactiveServerList

    globals.activeServer = null //set activeServer to null to prepare for re-activation

    if (callback) {
      callback(`All proxies closed successfully!`)
    }
  })
}

