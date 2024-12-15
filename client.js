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

    /*
    Function to allow the WebSocket client to register an username to the 
    WebSocket server through the NetworkManager
    */
    register(username) {
        let registerData = {
            action: "register",
            payload: username
        };
        this.send(JSON.stringify(registerData));
    }

    /*
    Function to allow the WebSocket client to request for the list of games to 
    the WebSocket server through the NetworkManager
    */
    listGames() {
        let listGamesData = {
            action: "listGames"
        };
        this.send(JSON.stringify(listGamesData));
    }

    /*
    Function to allow the WebSocket client to create a game to the WebSocket 
    server through the NetworkManager
    */
    createGame(gameId, username) {
        let createGameData = {
            action: "createGame",
            payload: [gameId, username]
        };
        this.send(JSON.stringify(createGameData));
    }

    /*
    Function to allow the WebSocket client to join a game to the WebSocket 
    server through the NetworkManager
    */
    joinGame(gameId, username) {
        let joinGameData = {
            action: "joinGame",
            payload: [gameId, username]
        };
        this.send(JSON.stringify(joinGameData));
    }

    /*
    Function to allow the WebSocket client to exit a game to the WebSocket 
    server through the NetworkManager
    */
    exitGame(gameId, username) {
        let exitGameData = {
            action: "exitGame",
            payload: [gameId, username]
        };
        this.send(JSON.stringify(exitGameData));
    }

    /*
    Function to allow the WebSocket client to unregister an username to the 
    WebSocket server through the NetworkManager
    */
    unregister(username) {
        let unregisterData = {
            action: "unregister",
            payload: username
        };
        this.send(JSON.stringify(unregisterData));
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

/*
Function to allow the WebSocket client to register an username to the WebSocket 
server through the NetworkManager
*/
function register() {
    let username = document.getElementById("registerInput").value;
    networkManager.register(username);
}

/*
Function to allow the WebSocket client to request for the list of games to the 
WebSocket server through the NetworkManager
*/
function listGames() {
    networkManager.listGames();
}

/*
Function to allow the WebSocket client to create a game to the WebSocket server 
through the NetworkManager
*/
function createGame() {
    let createGameId = document.getElementById("createGameInput").value;
    let username = document.getElementById("registerInput").value;
    networkManager.createGame(createGameId, username);
}

/*
Function to allow the WebSocket client to join a game to the WebSocket server 
through the NetworkManager
*/
function joinGame() {
    let joinGameId = document.getElementById("joinGameInput").value;
    let username = document.getElementById("registerInput").value;
    networkManager.joinGame(joinGameId, username);
}

/*
Function to allow the WebSocket client to exit a game to the WebSocket server 
through the NetworkManager
*/
function exitGame() {
    let exitGameId = document.getElementById("exitGameInput").value;
    let username = document.getElementById("registerInput").value;
    networkManager.exitGame(exitGameId, username);
}

/*
Function to allow the WebSocket client to unregister an username to the 
WebSocket server through the NetworkManager
*/
function unregister() {
    let username = document.getElementById("unregisterInput").value;
    networkManager.unregister(username);
}