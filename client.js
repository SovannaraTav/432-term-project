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

// WebSocket client information
const webSocketPortNumber = 8081;
const webSocketHost = "localhost";

// Establishes a WebSocket client to connect to the WebSocket server
const webSocketClient = 
    new WebSocket(`ws://${webSocketHost}:${webSocketPortNumber}`);

/*
Handles the event when the WebSocket client is connected to the WebSocket server
*/
webSocketClient.onopen = () => {
    console.log("[WebSocket Client] - Connected to WebSocket Server!");
    document.getElementById("status").innerText = 
        "WebSocket client connected to Websocket server!";
};

/*
Handles the event when receiving data from the WebSocket server to the WebSocket 
client
*/
webSocketClient.onmessage = (event) => {
    console.log(
        `[WebSocket Client] - Received data from WebSocket server: ${event.data}`);
};

// Handles the event when there are errors from the WebSocket client
webSocketClient.onerror = (error) => {
    console.error(`[WebSocket Client] - Error: ${error}`);
    document.getElementById("status").innerText = 
        "WebSocket client error connecting to WebSocket server";
};

/*
Function to allow the WebSocket client to send a message to the WebSocket server
*/
function sendMessage() {
    let message = document.getElementById("messageInput").value;
    console.log(
        `[WebSocket Client] - Sending message to WebSocket server: ${message}`);
    webSocketClient.send(message);
}