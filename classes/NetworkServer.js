const WebSocketClient = require("./WebSocketClient");
const NetTCPClient = require("./NetTCPClient");

class NetworkServer {
    // Private data attributes
    #webSocketClient;
    #netTCPClient;

    // Class constructor
    constructor(webSocketHost, webSocketPort, netTCPHost, netTCPPort) {
        this.#webSocketClient = 
            new WebSocketClient(webSocketHost, webSocketPort);
        this.#netTCPClient = new NetTCPClient(netTCPHost, netTCPPort);
    }

    /*
    Function that establishes the WebSocketClient and NetTCPClient connections
    */
    connect() {
        this.#webSocketClient.connect();
        this.#netTCPClient.connect();
    }

    /*
    Function that allows the WebSocket client to send a message to the WebSocket 
    server
    */
    sendMessageToWebSocket(message) {
        this.#webSocketClient.send(message);
    }

    /*
    Function that allows the NetTCP client to send a message to the NetTCP server
    */
    sendMessageToNetTCP(message) {
        this.#netTCPClient.send(message);
    }

    /*
    Function that allows the WebSocket client to invoke its callback function when 
    a message is received from the WebSocket server
    */
    onWebSocketMessage(callback) {
        this.#webSocketClient.onMessage(callback);
    }

    /*
    Function that allows the NetTCP client to invoke its callback function when 
    a message is received from the NetTCP server
    */
    onNetTCPMessage(callback) {
        this.#netTCPClient.onMessage(callback);
    }

    /*
    Function that closes the WebSocketClient and NetTCPClient connections
    */
    close() {
        this.#webSocketClient.close();
        this.#netTCPClient.close();
    }
}

module.exports = NetworkServer;