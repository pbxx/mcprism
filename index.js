const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {MCProxy} = require("./mcproxy.js")

var serverList = []

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

var activeProxy = null

ipcMain.on('toMain', (event, arg) => {
  console.log(arg) // prints "ping" in the Node console
  // works like `send`, but returning a message back
  // to the renderer that sent the original message
  if (arg.command == 'addServer') {
    //add a server to saved servers
    var serverObject = { name: arg.name, address: arg.address }
    serverList.push(serverObject)
    if (!activeProxy) {
      activeProxy = new MCProxy({verbose: true, host: arg.address, interface: "10.88.0.117"}, (response) => {
        console.log(response)
      })
    }
    event.reply('fromMain', { command: 'updateServers', serverList })
  } else if (arg.command == 'deleteServer') {
    //handle deletion request
    //currently just shut down active proxy set
    activeProxy.close(() => {
      //all proxies closed
      console.log(`All proxies closed successfully!`)
      activeProxy = null

    })

  }
})

