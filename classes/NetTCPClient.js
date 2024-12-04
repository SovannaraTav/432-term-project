const netTCP = require("node:net");

class NetTCPClient {
    // Private data attributes
    #host;
    #port;
    #socket;

    // Class constructor
    constructor(host, port) {
        this.#host = host;
        this.#port = port;
        this.#socket = null;
    }

    connect() {
        // Establishes a NetTCP client to connect to the NetTCP server
        this.#socket = netTCP.createConnection(this.#host, this.#port, () => {
            console.log("[NetTCP Client] - Connected to NetTCP server!");
        });

        /*
        Handles the event when receiving data from the NetTCP server to the NetTCP 
        client
        */
        this.#socket.on("data", (data) => {
            console.log(
                `[NetTCP Client] - Received data from NetTCP server: ${data.toString()}`);
                
            // Invokes the callback function to handle the received data
            this.onMessageCallback(data.toString());
        });
        
        /*
        Handles the event when the NetTCP client disconnects from the NetTCP 
        server
        */
        this.#socket.on("end", () => {
            console.log("[NetTCP Client] - Disconnected from NetTCP server!");
        });

        // Handles the event when there are errors from the NetTCP client
        this.#socket.on("error", (err) => {
            console.error(`[NetTCP Client] - Error: ${err}`);
        });
    }

    /*
    Function to allow the NetTCP client to send a message to the NetTCP server
    */
    send(message) {
        if (this.#socket) {
            console.log(
                `[NetTCP Client] - Sending message to NetTCP server: ${message}`);
            this.#socket.write(message);
        }
    }

    /*
    Function to set a callback function that will be invoked when a message is 
    received from the NetTCP server to the NetTCP client
    */
    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    /*
    Function to close the NetTCP client connection to the NetTCP server
    */
    close() {
        if (this.#socket) {
            this.#socket.end();
        }
    }
}

module.exports = NetTCPClient;