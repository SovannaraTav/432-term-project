const WebSocket = require("ws");

class WebSocketClient {
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
        // Establishes a WebSocket client to connect to the WebSocket server
        this.#socket = new WebSocket(`ws://${this.#host}:${this.#port}`);

        /*
        Handles the event when the WebSocket client is connected to the WebSocket 
        server
        */
        this.#socket.onopen = () => {
            console.log("[WebSocket Client] - Connected to WebSocket Server!");
        };

        /*
        Handles the event when receiving data from the WebSocket server to the 
        WebSocket client
        */
        this.#socket.onmessage = (event) => {
            console.log(
                `[WebSocket Client] - Received data from WebSocket server: ${event.data}`);
            
            // Invokes the callback function to handle the received data
            this.onMessageCallback(event.data);
        };

        /*
        Handles the event when the WebSocket client disconnects from the WebSocket 
        server
        */
        this.#socket.onclose = () => {
            console.log("[WebSocket Client] - Disconnected from WebSocket Server!");
        }

        // Handles the event when there are errors from the WebSocket client
        this.#socket.onerror = (error) => {
            console.error(`[WebSocket Client] - Error: ${error}`);
        };
    }

    /*
    Function to allow the WebSocket client to send a message to the WebSocket 
    server
    */
    send(message) {
        if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
            console.log(
                `[WebSocket Client] - Sending message to WebSocket server: ${message}`);
            this.#socket.send(message);
        }
    }

    /*
    Function to set a callback function that will be invoked when a message is 
    received from the WebSocket server to the WebSocket client
    */
    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    /*
    Function to close the WebSocket client connection to the WebSocket server
    */
    close() {
        if (this.#socket) {
            this.#socket.close();
        }
    }
}

module.exports = WebSocketClient;