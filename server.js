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

// List of registered players and games for the servers
let listOfRegisteredPlayers = {};
let listOfGames = {};
let listOfGamesWon = {};

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
        
        // For when the data received is a grid coordinate
        if (data.toString().length === 2 || data.toString().length === 3) {
            // Sends a response from the NetTCP server to the NetTCP client
            socketTCP.write(
                `[NetTCP Server] - Received ${data.toString()} from NetTCP client`);
            return;
        }

        // For when the data received is a network action on the servers
        let parseData = JSON.parse(data);
        let response = {
            action: parseData.action,
            success: false,
            result: "",
        }
        switch (parseData.action) {
            /*
            Handles the case when the network action is registering a new username 
            on the servers as well indicating if the username is already registered
            */
            case "register":
                let usernameToRegister = parseData.payload;
                if (!listOfRegisteredPlayers[usernameToRegister]) {
                    console.log(
                        `[NetTCP Server] - Registering the username: ${usernameToRegister}`);
                    listOfRegisteredPlayers[usernameToRegister] = true;
                    response.success = true;
                    response.result = 
                        `Registering the username: ${usernameToRegister}`;
                }
                else {
                    console.log(
                        `[NetTCP Server] - The username ${usernameToRegister} is already registered`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameToRegister} is already registered`;
                }
                break;

            /*
            Handles the case when the network action is returning the list of games 
            on the servers as well as indicating if the list of games is empty and 
            removing games when the list of players drops to zero
            */
            case "listGames":
                if (Object.keys(listOfGames).length !== 0) {
                    console.log("[NetTCP Server] - Returning list of games");
                    response.success = true;

                    let gamesAndPlayersList = [];
                    for(let gameId in listOfGames) {
                        if (listOfGames[gameId].listOfPlayers.length !== 0)
                        {
                            gamesAndPlayersList.push({
                                gameId: gameId,
                                players: listOfGames[gameId].listOfPlayers
                            });
                        }
                        else {
                            delete listOfGames[gameId];
                        }
                    }
                    response.result = gamesAndPlayersList;
                }
                else {
                    console.log("[NetTCP Server] - Empty game list");
                    response.success = false;
                    response.result = "Empty game list";
                }
                break;

            /*
            Handles the case when the network action is a registered username 
            creating a new game with an id on the servers as well as indicating if 
            the registered username isn't registered and if a game with the id 
            already exists
            */
            case "createGame":
                let createGameId = parseData.payload[0];
                let usernameCreatingGame = parseData.payload[1];
                if (!listOfGames[createGameId] && 
                    listOfRegisteredPlayers[usernameCreatingGame]) {
                    console.log(
                        `[NetTCP Server] - Creating game with the id #${createGameId} by ${usernameCreatingGame}`);
                    listOfGames[createGameId] = { listOfPlayers: [] };
                    listOfGames[createGameId].listOfPlayers.push(usernameCreatingGame);
                    response.success = true;
                    response.result = 
                        `Creating game with the id #${createGameId} by ${usernameCreatingGame}`;
                }
                else if (!listOfRegisteredPlayers[usernameCreatingGame]) {
                    console.log(
                        `[NetTCP Server] - The username ${usernameCreatingGame} isn't registered to create a game with id #${createGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameCreatingGame} isn't registered to create a game with id #${createGameId}`;
                }
                else {
                    console.log(
                        `[NetTCP Server] - Game with the id #${createGameId} already exists. Not creating a game for ${usernameCreatingGame}`);
                    response.success = false;
                    response.result = 
                        `Game with the id #${createGameId} already exists. Not creating a game for ${usernameCreatingGame}`;
                }
                break;

            /*
            Handles the case when the network action is a registered username 
            joining an existing game on the servers by its id as well as indicating 
            if the registered username isn't registered, if the registered username 
            has already join the game, and if the game with the id doesn't exists
            */
            case "joinGame":
                let joinGameId = parseData.payload[0];
                let usernameJoiningGame = parseData.payload[1];
                if (listOfGames[joinGameId] && 
                    listOfRegisteredPlayers[usernameJoiningGame] && 
                    !listOfGames[joinGameId].listOfPlayers.includes(usernameJoiningGame)) {
                    console.log(
                        `[NetTCP Server] - Joining game with the id #${joinGameId} for ${usernameJoiningGame}`);
                    listOfGames[joinGameId].listOfPlayers.push(usernameJoiningGame);
                    response.success = true;
                    response.result = 
                        `Joining game with the id #${joinGameId} for ${usernameJoiningGame}`;
                }
                else if (!listOfGames[joinGameId]) {
                    console.log(
                        `[NetTCP Server] - Game with the id #${joinGameId} doesn't exist for ${usernameJoiningGame} to join`);
                    response.success = false;
                    response.result = 
                        `Game with the id #${joinGameId} doesn't exist for ${usernameJoiningGame} to join`;
                }
                else if (!listOfRegisteredPlayers[usernameJoiningGame]) {
                    console.log(
                        `[NetTCP Server] - The username ${usernameJoiningGame} isn't registered to join the game with id #${joinGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameJoiningGame} isn't registered to join the game with id #${joinGameId}`;
                }
                else if (listOfGames[joinGameId].listOfPlayers.includes(usernameJoiningGame))
                {
                    console.log(
                        `[NetTCP Server] - The username ${usernameJoiningGame} has already join game with the id #${joinGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameJoiningGame} has already join game with the id #${joinGameId}`;
                }
                break;
            
            /*
            Handles the case when the network action is a registered username 
            exiting an existing game on the servers by its id as well as indicating 
            if the registered username isn't registered, if the registered username 
            hasn't join the game, and if the game with the id doesn't exists
            */
            case "exitGame":
                let exitGameId = parseData.payload[0];
                let usernameExitingGame = parseData.payload[1];
                if (listOfGames[exitGameId] &&
                    listOfRegisteredPlayers[usernameExitingGame] && 
                    listOfGames[exitGameId].listOfPlayers.includes(usernameExitingGame)) {
                    console.log(
                        `[NetTCP Server] - Exiting game with the id #${exitGameId} for ${usernameExitingGame}`);
                    let indexOfUsernameToExit = 
                        listOfGames[exitGameId].listOfPlayers.indexOf(usernameExitingGame);
                    listOfGames[exitGameId].listOfPlayers.splice(indexOfUsernameToExit, 1);
                    response.success = true;
                    response.result = 
                        `Exiting game with the id #${exitGameId} for ${usernameExitingGame}`;
                }
                else if (!listOfGames[exitGameId]) {
                    console.log(
                        `[NetTCP Server] - Game with the id #${exitGameId} doesn't exist for ${usernameExitingGame} to exit`);
                    response.success = false;
                    response.result = 
                        `Game with the id #${exitGameId} doesn't exist for ${usernameExitingGame} to exit`;
                }
                else if (!listOfRegisteredPlayers[usernameExitingGame]) {
                    console.log(
                        `[NetTCP Server] - The username ${usernameExitingGame} isn't registered to exit the game with id #${exitGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameExitingGame} isn't registered to exit the game with id #${exitGameId}`;
                }
                else if (!listOfGames[exitGameId].listOfPlayers.includes(usernameExitingGame))
                {
                    console.log(
                        `[NetTCP Server] - The username ${usernameExitingGame} hasn't join game with the id #${exitGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameExitingGame} hasn't join game with the id #${exitGameId}`;
                }
                break;

            /*
            Handles the case when the network action is unregistering an existing 
            username on the servers and removing them from any games as well 
            indicating if the username isn't registered
            */
            case "unregister":
                let usernameToUnregister = parseData.payload;
                if (listOfRegisteredPlayers[usernameToUnregister]) {
                    console.log(
                        `[NetTCP Server] - Unregistering the username: ${usernameToUnregister}`);
                    for(let gameId in listOfGames) {
                        let game = listOfGames[gameId];
                        let usernameIndex = 
                            game.listOfPlayers.indexOf(usernameToUnregister);
                        if (usernameIndex !== -1) {
                            game.listOfPlayers.splice(usernameIndex, 1);
                        }
                    }
                    delete listOfRegisteredPlayers[usernameToUnregister];
                    response.success = true;
                    response.result = 
                        `Unregistering the username: ${usernameToUnregister}`;
                }
                else {
                    console.log(
                        `[NetTCP Server] - The username ${usernameToUnregister} isn't registered`);
                    response.success = false;
                    response.result = 
                        `The username ${usernameToUnregister} isn't registered to unregister`;
                }
                break;

            /*
            Handles the case when the network action is checking if there is a 
            winner or not for an existing game on the servers by its id as well as 
            indicating with game with the id doesn't exist
            */
            case "checkWinner":
                let checkWinnerGameId = parseData.payload[0];
                let checkWinnerUsername = parseData.payload[1];
                if (listOfGames[checkWinnerGameId] && 
                    checkWinnerUsername.length === 0) {
                    console.log(
                        `[NetTCP Server] - Returning the winner of the game with id #${checkWinnerGameId}!`);
                    response.success = true;

                    if (listOfGamesWon[checkWinnerGameId]) {
                        response.result = 
                            `Congratulations, ${listOfGamesWon[checkWinnerGameId]} has won the game with id #${checkWinnerGameId}`;
                    }
                    else {
                        response.result = 
                            `No winner yet for the game with id #${checkWinnerGameId}`;
                    }
                }
                else if (listOfGames[checkWinnerGameId] && 
                    listOfRegisteredPlayers[checkWinnerUsername] && 
                    listOfGames[checkWinnerGameId].listOfPlayers.includes(checkWinnerUsername)) {
                    console.log(
                        `[NetTCP Server] - Congratulations, ${checkWinnerUsername} has won the game with id #${checkWinnerGameId}!`);
                    listOfGamesWon[checkWinnerGameId] = checkWinnerUsername;
                    response.success = true;
                    response.result = 
                        `Congratulations, ${checkWinnerUsername} has won the game with id #${checkWinnerGameId}`;
                }
                else if (!listOfGames[checkWinnerGameId]) {
                    console.log(
                        `[NetTCP Server] - Game with the id #${checkWinnerGameId} doesn't exist to check for a winner`);
                    response.success = false;
                    response.result = 
                        `Game with the id #${checkWinnerGameId} doesn't exist to check for a winner`;
                }
                else if (!listOfRegisteredPlayers[checkWinnerUsername]) {
                    console.log(
                        `[NetTCP Server] - The username ${checkWinnerUsername} isn't registered to check winner of the game with id #${checkWinnerGameId}`);
                    response.success = false;
                    response.result = 
                        `The username ${checkWinnerUsername} isn't registered to check winner of the game with id #${checkWinnerGameId}`;
                }
                break;

            default:
                break;
        }

        // Sends a response from the NetTCP server to the NetTCP client
        socketTCP.write(
            `[NetTCP Server] - Sending response: ${JSON.stringify(response)}`);
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
            console.log("[NetTCP Client] - Disconnected from NetTCP server!\n\n");
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