/*
Helpful references:
1) net module:
a) https://nodejs.org/api/net.html
b) https://node.readthedocs.io/en/latest/api/net/
c) https://www.tutorialspoint.com/nodejs/nodejs_net_module.htm
d) https://dev.to/devstoriesplayground/unveiling-the-power-of-tcp-building-apps-with-nodejss-net-module-2n8c

2) ws and websocket libraries
a) https://www.npmjs.com/package/ws
b) https://www.npmjs.com/package/websocket
c) https://dev.to/codesphere/getting-started-with-web-sockets-in-nodejs-49n0
d) My CSS 481 course textbook on web sockets (Chapter 8, Section 12)
    (https://www.zybooks.com/catalog/web-programming/)
*/

// NetTCP server information
const netTCP = require("node:net");
const netTCPPortNumber = 8080;
const netTCPHost = "localhost";

// Establishes a NetTCP server for NetTCP clients to connect to
const netTCPServer = netTCP.createServer((socketTCP) => {
    // Indicates when a NetTCP client has connected to the NetTCP server
    console.log("[Net TCP Server] - NetTCP client connected!");

    /*
    Handles the event when receiving data from the NetTCP client to the NetTCP 
    server
    */
    socketTCP.on("data", (data) => {
        console.log(
            `[NetTCP Server] - Received data from NetTCP client: ${data.toString()}`);

        // Sends a response from the NetTCP server to the NetTCP client
        socketTCP.write("[NetTCP Server] - Hello NetTCP client!");
    });

    /*
    Handles the event when the NetTCP client disconnects from the NetTCP server
    */
    socketTCP.on("end", () => {
        console.log("[NetTCP Server] - NetTCP client disconnected!");
    });

    // Handles the event when there are errors from the NetTCP server
    socketTCP.on("error", (err) => {
        console.error(`[NetTCP Server] - Error: ${err}`);
    });
});

// Indicates what port number the NetTCP server is listening on
netTCPServer.listen(netTCPPortNumber, () => {
    console.log(`[NetTCP Server] - Listening on port #${netTCPPortNumber}`);
});

// WebSocket server information
const webSocket = require("ws");
const webSocketPortNumber = 8081;

// Establishes a WebSocket server for WebSocket clients to connect to
const webSocketServer = new webSocket.Server({ port: webSocketPortNumber }, () => {
    // Indicates what port number the WebSocket server is listening on
    console.log(`[WebSocket Server] - Listening on port #${webSocketPortNumber}`);
});

// Establishes a WebSocket server for WebSocket clients to connect to
webSocketServer.on("connection", (socketWeb) => {
    // Indicates when a WebSocket client has connected to the WebSocket server
    console.log("[WebSocket Server] - WebSocket client connected!");

    /*
    Handles the event of translating WebSocket information into NetTCP information
    */
    socketWeb.on("message", (message) => {
        console.log(`[WebSocket Server] - Received data from WebSocket client: ${message}`);

        // Establishes a NetTCP client to connect to the NetTCP server
        const netTCPClient = 
        netTCP.createConnection(netTCPPortNumber, netTCPHost, () => {
            // Indicates when a NetTCP client has connected to the NetTCP server
            console.log("[NetTCP Client] - Connected to NetTCP server!");

            /*
            Sends a response from the NetTCP client to the NetTCP server 
            containing the WebSocket information 
            */
            netTCPClient.write(message);
        });

        /*
        Handles the event when receiving data from the NetTCP server to the NetTCP 
        client
        */
        netTCPClient.on("data", (data) => {
            console.log(
                `[NetTCP Client] - Received data from NetTCP server: ${data.toString()}`);

            /*
            Sends a response from the NetTCP server to the NetTCP client 
            containing the WebSocket information response
            */
            socketWeb.send(data.toString());
        
            // Closes the NetTCP client connection to the NetTCP server
            netTCPClient.end();
        });
        
        /*
        Handles the event when the NetTCP client disconnects from the NetTCP 
        server
        */
        netTCPClient.on("end", () => {
            console.log("[NetTCP Client] - Disconnected from NetTCP server!");
        });
        
        // Handles the event when there are errors from the NetTCP client
        netTCPClient.on("error", (err) => {
            console.error(`[NetTCP Client] - Error: ${err}`);
        });
    });

    /*
    Handles the event when the WebSocket client disconnects from the WebSocket 
    server
    */
    socketWeb.on("close", () => {
        console.log("[WebSocket Server] - WebSocket client disconnected!");
    });

    // Handles the event when there are errors from the WebSocket server
    socketWeb.on("error", (err) => {
        console.error(`[WebSocket Server] - Error: ${err}`);
    });
});