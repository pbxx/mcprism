const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {MCProxy} = require("./mcproxy.js")
const os = require('node:os');
const fs = require('node:fs');
const Gamedig = require('gamedig');
const process = require('node:process');




var globalState = {
  serverList: [],
  activeServerIndex: -1,
  interfaceList: [],
  selectedInterface: {},
  platform: process.platform,
  localPortRange: [49000, 65535]
  
  
}

console.log(`LAUNCHED! Platform is: ${globalState.platform}, type: ${typeof(globalState.platform)}`)

var activeServer = null;
var mpLocalhost = "notwork"

//set the working definition of 'localhost' based on the platform
if (globalState.platform == 'win32') {
  //windows likes 'localhost'
  mpLocalhost = 'localhost'
} else {
  //macOS likes '0.0.0.0'
  //need to test on linux...
  mpLocalhost = '0.0.0.0'
}


function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 750,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    resizable: false,
    //frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("dist/index.html");
  // Open the DevTools.
  //win.webContents.openDevTools({ mode: "detach" })
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
      console.log(`Deletion requested for index ${arg.index}`)

      //delete the server from the global server list
      globalState.serverList.splice(arg.index, 1)

      //update the active index in case it changes
      for ( var i = 0; i < globalState.serverList.length; i++ ) {
        if (globalState.serverList[i].active === true) {
          //this is the new activeIndex
          //console.log("FOUND NEW ACTIVE INDEX")
          globalState.activeServerIndex = i
          
        }
      }

      console.log(globalState.serverList)
      console.log(globalState.activeServerIndex)
      saveState()
      event.reply('fromMain', { command: 'updateState', state: globalState })
  
    } else if (arg.command == 'requestStateUpdate') {
      //handle state update request
      //just send the state
      event.reply('fromMain', { command: 'updateState', state: globalState })
  
    } else if (arg.command == "activateProxy") {
      
      activateProxy(arg.index, globalState.selectedInterface.ipv4, () => {
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
    } else if (arg.command == "selectPortRange") {
      globalState.localPortRange = arg.newLocalPortRange

      if (globalState.activeServerIndex != -1) {
        //there is an active server that will need to be switched to the new port range
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
        //no active server currently, just change the default port range
        saveState()
        event.reply('fromMain', { command: 'updateState', state: globalState })
      }

    } else if (arg.command == "getServerInfo") {
      //get server info for index and respond
      if (arg.index != undefined) {
        //valid index passed, get server info
        var cleanAddr = validateAddress(globalState.serverList[arg.index].address)
        console.log(cleanAddr)

        Gamedig.query({
            type: 'minecraftpe',
            host: cleanAddr.address,
            port: cleanAddr.port,
        }).then((state) => {
            var serverState = { index: arg.index, online: true, serverMotd: state.name, players: `${state.players.length}/${state.maxplayers}` }
            console.log(serverState);
            event.reply('fromMain', { command: 'serverInfoResponse', ...serverState })
        }).catch((error) => {
            console.log("Server is offline");
            event.reply('fromMain', { command: 'serverInfoResponse', index: arg.index, online: false, serverMotd: '', players: '' })
        });
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

    activeServer = new MCProxy({verbose: true, host: cleanAddr.address, port: cleanAddr.port , interface, localPortRange: globalState.localPortRange}, (response) => {
      console.log(response)

      globalState.activeServerIndex = index //set active server globally
      globalState.serverList[index].active = true

      if (callback) {
        callback(response)
      }

    })
    
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

  outArr.push({ ifKey: "default", ipv4: mpLocalhost, selected: false }) //push initial 127.0.0.1 option

  for ( const key in osInterfaces ) {
    //iterate through each interface on system
    for (const addressObj of osInterfaces[key] ) {
      //iterate through each IPv4 and V6 address on this interface. addressObj is the address
      if (addressObj.family == "IPv4") {
        //currently only using IPv4 local addresses
        if (!addressObj.address.startsWith("127.0.0") && !addressObj.address.startsWith("169.")) {
          //exclude 127.0.0.1 and autoconfig (169.x.x.x) address(es) from the selectable list 
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
  //replace it with 127.0.0.1 if it doesn't

  //ifObject format is: { ifKey: "Ethernet/eth0", ipv4: "192.168.0.10"},

  var ipv4 = globalState.selectedInterface["ipv4"]
  var ifKey = globalState.selectedInterface["ifKey"]

  var currentInterfaces = getCurrentInterfaces()

  if (ipv4 && ifKey) {
    //ipv4 && ifKey were defined, check if this interface exists in the current interfaces
    var itsFine = false
    var ifI = 0
    for (const ifObject of currentInterfaces) {
      //check through all interfaces to see if there is a match
      if ( ifObject.ipv4 == ipv4 && ifObject.ifKey == ifKey ) {
        //the ip and interface name are still available!, set this interface as current
        currentInterfaces[ifI].selected = true
        itsFine = true
        break
      }
      ifI++
    }

    if (!itsFine) {
      //no valid address/adapter pair was found, set to 127.0.0.1
      currentInterfaces[0].selected = true
      globalState.selectedInterface = { ifKey: "default", ipv4: mpLocalhost }
    }

  } else {
    //one or both were undefined, set selected interface as 127.0.0.1
    currentInterfaces[0].selected = true
    globalState.selectedInterface = { ifKey: "default", ipv4: mpLocalhost }
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
      

      //load the app state if it exists
      var loadedState = loadState()

      if (loadedState) {
        //state file exists, load it into globalState
        globalState = { ...globalState, ...loadedState}
        globalState.platform = process.platform //update platform state in case state file came from a different   platform
        globalState.interfaceList = validateSelectedInterface() //grab computer's list of interfaces

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
        globalState.selectedInterface = { ifKey: "default", ipv4: mpLocalhost }
        globalState.interfaceList = validateSelectedInterface()
        saveState()
  
      }
      
      //everything loaded, move on to loading app
      resolve()

    } catch (e) {
      reject(e)
    }

  })
}

