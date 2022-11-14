const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {MCProxy} = require("./mcproxy.js")
const os = require('node:os');
const fs = require('node:fs');

var globalState = {
  serverList: [],
  activeServerIndex: -1,
  interfaceList: [],
  selectedInterface: {}
}

var activeServer = null;

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

// APP INIT
init()
.then(() => {
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
  
  
  // IPC HANDLERS
  ipcMain.on('toMain', (event, arg) => {
    console.log(arg) // prints "ping" in the Node console
    // works like `send`, but returning a message back
    // to the renderer that sent the original message
    if (arg.command == 'addServer') {
      //add a server to saved servers
      var valid = validateAddress(arg.address)
      if (valid.yes) {
        //address is valid
        var serverObject = { name: arg.name, address: `${valid.address}:${valid.port}`, active: false }
        globalState.serverList.push(serverObject)
        saveState()
        event.reply('fromMain', { command: 'updateState', state: globalState })
      } else {
        event.reply('fromMain', { command: 'errorAddingServer', error: valid.error })
      }
      

    } else if (arg.command == 'deleteServer') {
      //handle deletion request
      //currently just shut down active proxy set
      globalState.serverList.splice(arg.index, 1)
      saveState()
      event.reply('fromMain', { command: 'updateState', state: globalState })
  
    } else if (arg.command == 'requestStateUpdate') {
      //handle state update request
      //just send the state
      event.reply('fromMain', { command: 'updateState', state: globalState })
  
    } else if (arg.command == "activateProxy") {
      
      activateProxy(arg.index, "10.88.0.117", () => {
        saveState()
        event.reply('fromMain', { command: 'updateState', state: globalState })
  
      })
  
      
    } else if (arg.command == "deactivateProxy") {
      deactivateProxy((response) => {
        //proxy deactivated
        saveState()
        event.reply('fromMain', { command: 'updateState', state: globalState })
      })
  
  
    } else if (arg.command == "selectInterface") {
      globalState.selectedInterface = globalState.interfaceList[arg.index]
      globalState.interfaceList = validateSelectedInterface()
      //saveState()
      if (globalState.activeServerIndex != -1) {
        //there is an active server that will need to be switched to the new interface
        var serverIndex = globalState.activeServerIndex
        deactivateProxy((response) => {
          //proxy deactivated
          activateProxy(serverIndex, globalState.selectedInterface.ipv4, () => {
            //proxy activated
            saveState()
            event.reply('fromMain', { command: 'updateState', state: globalState })
      
          })
        })

      } else {
        //no active server currently, just change the default interface
        saveState()
        event.reply('fromMain', { command: 'updateState', state: globalState })
      }
  
  
    } else if (arg.command == "closeWindow") {
      //event.sender.close()
      BrowserWindow.getAllWindows()[event.sender.id-1].close()
    } else if (arg.command == "minimizeWindow") {
      //event.sender.minimize()
      BrowserWindow.getAllWindows()[event.sender.id-1].minimize()
      //console.log(event.sender.id)
  
    }
  })



})
.catch((err) => {
  console.error(err)
})






function activateProxy(index, interface, callback) {
  if (globalState.activeServerIndex == -1) {
    console.log(`IM RUNNING`)
    var cleanAddr = validateAddress(globalState.serverList[index].address)

    activeServer = new MCProxy({verbose: true, host: cleanAddr.address, port: cleanAddr.port , interface}, (response) => {
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

function getCurrentInterfaces() {
  /*
    #######
    input:
    {
      lo: [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        },
        {
          address: '::1',
          netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
          family: 'IPv6',
          mac: '00:00:00:00:00:00',
          scopeid: 0,
          internal: true,
          cidr: '::1/128'
        }
      ],
      eth0: [
        {
          address: '192.168.1.108',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '01:02:03:0a:0b:0c',
          internal: false,
          cidr: '192.168.1.108/24'
        },
        {
          address: 'fe80::a00:27ff:fe4e:66a1',
          netmask: 'ffff:ffff:ffff:ffff::',
          family: 'IPv6',
          mac: '01:02:03:0a:0b:0c',
          scopeid: 1,
          internal: false,
          cidr: 'fe80::a00:27ff:fe4e:66a1/64'
        }
      ]
    }


    ###### 
    should return:
    [
      { ifKey: "Ethernet/eth0", ipv4: "192.168.0.10"},
      { ifKey: "Ethernet 2/eth1", ipv4: "192.168.0.11"}
    ]
  */

  var osInterfaces = os.networkInterfaces()
  var outArr = []

  outArr.push({ ifKey: "default", ipv4: "localhost", selected: false }) //push initial localhost option

  for ( const key in osInterfaces ) {
    //iterate through each interface on system
    for (const addressObj of osInterfaces[key] ) {
      //iterate through each IPv4 and V6 address on this interface. addressObj is the address
      if (addressObj.family == "IPv4") {
        //currently only using IPv4 local addresses
        if (!addressObj.address.startsWith("127.0.0") && !addressObj.address.startsWith("169.")) {
          //exclude localhost and autoconfig (169.x.x.x) address(es) from the selectable list 
          //add this address to the list of selectable interfaces
          outArr.push({ ifKey: key, ipv4: addressObj.address, selected: false })
        }
      }
    }
  }

  return(outArr)
}

function validateSelectedInterface() {
  //check if the selected interface still exists,
  //replace it with localhost if it doesn't

  //ifObject format is: { ifKey: "Ethernet/eth0", ipv4: "192.168.0.10"},

  var ipv4 = globalState.selectedInterface["ipv4"]
  var ifKey = globalState.selectedInterface["ifKey"]

  if (ipv4 || ifKey) {
    //one of ipv4 || ifKey were defined, check if this interface exists in the current interfaces
    var currentInterfaces = getCurrentInterfaces()
    var itsFine = false

    var ifI = 0

    for (const ifObject of currentInterfaces) {
      //check through all interfaces to see if there is a match
      if ( ifObject.ipv4 == ipv4 && ifObject.ifKey == ifKey ) {
        //the ip and interface name are still available!, set this interface as current
        currentInterfaces[ifI].selected = true
        itsFine = true
      }
      ifI++
    }

    if (!itsFine) {
      //no valid address/adapter pair was found, set to localhost
      currentInterfaces[0].selected = true
      globalState.selectedInterface = { ifKey: "default", ipv4: "localhost" }
    }

  } else {
    //one or both were undefined, set selected interface as localhost
    currentInterfaces[0].selected = true
    globalState.selectedInterface = { ifKey: "default", ipv4: "localhost" }
  }

  return currentInterfaces
}

function validateAddress(address) {
  //check to see if an address or address:port combo is valid
  var outObj = {
    yes: false,
    error: "No server address entered!"
  }

  if (address == '') {
    //address must be something
    return outObj
  } else if (address.split(" ").length > 1) {
    outObj.error = "Invalid address: Spaces are not allowed."
    return outObj
  } else if (address.split(":").length > 2) {
    outObj.error = "Invalid address: Format must be <address> or <address>:<port>."
    return outObj
  } else if (address.split(":").length == 2) {
    var addressParts = address.split(":")
    console.log(parseInt(addressParts[1]))
    if ( parseInt(addressParts[1]) ) {
      //the user input a valid port number
      outObj.yes = true
      outObj.error = ''
      outObj["address"] = addressParts[0]
      outObj["port"] = parseInt(addressParts[1])
      return outObj

    } else {
      outObj.error = "Invalid address: Port number must be number."
      return outObj
    }
    
  } else {
    //assume address to be valid
    outObj.yes = true
    outObj.error = ''
    outObj["address"] = address
    outObj["port"] = 19132
    return outObj
  }
}

function loadState() {
  if (fs.existsSync("./mcPrism-state.json")) {
    return JSON.parse(fs.readFileSync("./mcPrism-state.json"))
  } else {
    return false
  }
}

function saveState() {
  fs.writeFileSync("./mcPrism-state.json", JSON.stringify(globalState))
}

function init() {
  return new Promise((resolve, reject) => {
    try {
      var loadedState = loadState()

      if (loadedState) {
        //state file exists, load it into globalState
        globalState = loadedState
        //grab computer's list of interfaces
        //console.log(getCurrentInterfaces())
        globalState.interfaceList = validateSelectedInterface()
        //saveState()

        if (globalState.activeServerIndex != -1) {
          //there is an active server in the saved state, activate it
          var index = globalState.activeServerIndex
          globalState.activeServerIndex = -1 //set it back to -1 so that activateProxy works properly
          activateProxy(index, globalState.selectedInterface.ipv4, () => {
            console.log("Proxy activated from saved state!")
          })
        }
        
      } else {
        //state file doesn't exist, create it after setting up initial app state
        globalState.selectedInterface = { ifKey: "localhost", ipv4: "127.0.0.1" }
        saveState()
  
      }
      //everything loaded, move on to loading app
      resolve()

    } catch (e) {
      reject(e)
    }

  })
}

