const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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

ipcMain.on('toMain', (event, arg) => {
  console.log(arg) // prints "ping" in the Node console
  // works like `send`, but returning a message back
  // to the renderer that sent the original message
  if (arg.command == 'addServer') {
    var serverObject = { name: arg.name, address: arg.address }
    serverList.push(serverObject)
    event.reply('fromMain', { command: 'updateServers', serverList })
  }
})

