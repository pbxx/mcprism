const udpProxy = require("udp-proxy")
const st = require('simpletype-js')


module.exports.MCProxy = class {
    constructor(options, callback) {
        let tcheck = st.checkSync({ host: "string", interface: "string", port: "number", localPortRange: "array" }, options)
        let err = null

        if (tcheck.correct) {
            //all required values were correct
            this.options = options
            var primaryPortOptions = {
                address: options.host,
                port: options.port,
                ipv6: false,
                localaddress: options.interface,
                localport: 19132,
                localipv6: false,
                timeOutTime: 10000
            }
            


            var secondaryPortOptions = {
                address: options.host,
                port: options.port,
                ipv6: false,
                localaddress: options.interface,
                //localport: 56441, //this is what is different here
                //localport: getRandBetween(49000, 65535),
                localport: getRandBetween(...options.localPortRange),
                localipv6: false,
                timeOutTime: 10000
            }

            this.primaryServer = udpProxy.createServer(primaryPortOptions);
            this.secondaryServer = udpProxy.createServer(secondaryPortOptions);

            var serversListening = 0
            ///console.log(`Active server selected. Proxies loaded!`)
            this.primaryServer.on('listening', function (details) {
                serversListening++
                if (options.verbose) {
                    console.log(`Primary server proxy created! Protocol: ${details.server.family}, Interface: ${details.server.address}:, Port: ${details.server.port}`);
                    console.log(`  forwarding to and from => Protocol: ${details.target.family}, Interface: ${details.target.address}:, Port: ${details.target.port}`);
                }
                if (serversListening >= 2) {
                    //this was the last server that needed to be closed
                    if (options.verbose) {
                        //console.log("All proxies loaded!")
                        
                    }
                    if (callback) {
                        //a callback function was provided
                        callback("All proxies loaded!")
                    }
                    
                }
            });

            this.secondaryServer.on('listening', function (details) {
                serversListening++
                if (options.verbose) {
                    console.log(`Secondary server proxy created! Protocol: ${details.server.family}, Interface: ${details.server.address}:, Port: ${details.server.port}`);
                    console.log(`  forwarding to and from => Protocol: ${details.target.family}, Interface: ${details.target.address}:, Port: ${details.target.port}`);
                }
                if (serversListening >= 2) {
                    //this was the last server that needed to be closed
                    if (options.verbose) {
                        //console.log("All proxies loaded!")
                        
                    }
                    if (callback) {
                        //a callback function was provided
                        callback("All proxies loaded!")
                    }
                }
            });

        } else {
            //one of the required options was not provided
            console.log(`One or more values passed to options were incorrect:`)
            console.log(tcheck.failed)
        }
    }
    close(callback) {
        var closedServers = 0
        var options = this.options

        this.primaryServer.close(() => {
            if (this.options.verbose) {
                console.log("Primary UDP proxy closed successfully.")
            }
            closedServers++
            if (closedServers >= 2) {
                //this was the last server that needed to be closed
                if (this.options.verbose) {
                    console.log("Proxy deactivated successfully")
                }
                if (callback) {
                    //a callback function was provided
                    callback("Proxy deactivated successfully")
                }
            }
        })
        this.secondaryServer.close(() => {
            if (this.options.verbose) {
                console.log("Primary UDP proxy closed successfully.")
            }
            closedServers++
            if (closedServers >= 2) {
                //this was the last server that needed to be closed
                if (this.options.verbose) {
                    console.log("Proxy deactivated successfully")
                }
                if (callback) {
                    //a callback function was provided
                    callback("Proxy deactivated successfully")
                }
            }
        })
    }
}



function getRandBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// kept for nostalgia
// 61653 - lan search port? 
// 62482 - lan search port? 
// 19132 - game port
// 56441 - game port?
// 52517 - game port?
/*
var options = {
    address: '31.25.11.10',
    port: 19132,
    ipv6: false,
    localaddress: '10.88.0.117',
    localport: 19132,
    localipv6: false,
    timeOutTime: 10000
  };
  
  var options2 = {
    address: '15.235.53.99',
    port: 19132,
    ipv6: false,
    localaddress: '10.88.0.117',
    localport: 56441,
    localipv6: false,
    timeOutTime: 10000
  };
  
  var options3 = {
    address: '31.25.11.10',
    port: 19132,
    ipv6: false,
    localaddress: '10.88.0.117',
    localport: 56442,
    localipv6: false,
    timeOutTime: 10000
  };
  
  var server = udpProxy.createServer(options);
  var server2 = udpProxy.createServer(options2);
  var server3 = udpProxy.createServer(options3);
  
  server.on('listening', function (details) {
    console.log('DNS - IPv4 to IPv6 proxy }>=<{ by: ok 2012');
    console.log('udp-proxy-server ready on ' + details.server.family + '  ' + details.server.address + ':' + details.server.port);
    console.log('traffic is forwarded to ' + details.target.family + '  ' + details.target.address + ':' + details.target.port);
  });
  
  
  server.on('message', function (message, sender) {
    console.log('message from ' + sender.address + ':' + sender.port);
    console.log(message);
  });
  
  */