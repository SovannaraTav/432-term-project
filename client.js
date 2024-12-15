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

class NetworkManager {
    // Private data attributes
    #webSocketHost;
    #webSocketPortNumber;
    #webSocketClient

    // Class constructor
    constructor(webSocketHost, webSocketPortNumber) {
        this.#webSocketHost = webSocketHost;
        this.#webSocketPortNumber = webSocketPortNumber;
        this.#webSocketClient = null;
    }

    connectToServer() {
        /*
        Establishes a WebSocket client to connect to the WebSocket server through 
        the NetworkManager
        */
        this.#webSocketClient = 
            new WebSocket(`ws://${this.#webSocketHost}:${this.#webSocketPortNumber}`);

        /*
        Handles the event when the WebSocket client is connected to the WebSocket 
        server through the NetworkManager
        */
        this.#webSocketClient.onopen = () => {
            console.log(
                "[NetworkManager] - WebSocket client connected to WebSocket server!");
            document.getElementById("status").innerText = 
                "WebSocket client connected to WebSocket server!";
        };

        /*
        Handles the event when receiving data from the WebSocket server to the 
        WebSocket client through the NetworkManager
        */
        this.#webSocketClient.onmessage = (event) => {
            console.log(
                `[NetworkManager] - WebSocket client received data from WebSocket server: ${event.data}`);
        };

        /*
        Handles the event when the WebSocket client disconnects from the WebSocket 
        server through the NetworkManager
        */
        this.#webSocketClient.onclose = () => {
            console.log("[NetworkManager] - WebSocket client disconnected from WebSocket server!");
        }

        /*
        Handles the event when there are errors from the WebSocket client through 
        the NetworkManager
        */
        this.#webSocketClient.onerror = (error) => {
            console.error(`[NetworkManager] - WebSocket Client Error: ${error}`);
            document.getElementById("status").innerText = 
                "WebSocket client error connecting to WebSocket server";
        };
    }

    /*
    Function to allow the WebSocket client to send a message to the WebSocket 
    server through the NetworkManager
    */
    send(message) {
        if (this.#webSocketClient && 
            this.#webSocketClient.readyState === WebSocket.OPEN) {
            console.log(
                `[NetworkManager] - WebSocket client sending message to WebSocket server: ${message}`);
            this.#webSocketClient.send(message);
        }
    }
}

// Instantiating the NetworkManager to separate networking from game logic
const webSocketPortNumber = 8081;
const webSocketHost = "localhost";
const networkManager = new NetworkManager(webSocketHost, webSocketPortNumber);
networkManager.connectToServer();

/*
Function to allow the WebSocket client to send a message to the WebSocket server 
through the NetworkManager
*/
function sendMessage() {
    let message = document.getElementById("messageInput").value;
    console.log(
        `[NetworkManager] - WebSocket client sending message to WebSocket server: ${message}`);
    networkManager.send(message);
}