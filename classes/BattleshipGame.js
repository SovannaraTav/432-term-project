const NetworkServer = require("./NetworkServer");

class BattleshipGame {
    // Private data attributes
    #networkServer;

    // Class constructor
    constructor() {
        this.#networkServer = 
            new NetworkServer("localhost", 8081, "localhost", 8080);

        // Sets up the callback functions to handle messages from WebSocket and NetTCP
        this.#networkServer.onWebSocketMessage(this.handleWebSocketMessage.bind(this));
        this.#networkServer.onNetTCPMessage(this.handleNetTCPMessage.bind(this));
    }

    /*
    Function that starts the Battleship game by establishing the WebSocketClient and 
    NetTCPClient connections through the NetworkServer
    */
    startGame() {
        console.log("[Battleship Game] - Starting game...");
        this.#networkServer.connect();
    }

    /*
    Function that displays the WebSocket message
    */
    handleWebSocketMessage(message) {
        console.log(`[Battleship Game] - Received WebSocket message: ${message}`);
    }

    /*
    Function that displays the NetTCP message
    */
    handleNetTCPMessage(message) {
        console.log(`[Battleship Game] - Received NetTCP message: ${message}`);
    }

    /*
    Function that ends the Battleship game by closing the WebSocketClient and 
    NetTCPClient connections through the NetworkServer
    */
    endGame() {
        console.log("[Battleship Game] - Ending game...");
        this.#networkServer.close();
    }
}

module.exports = BattleshipGame;