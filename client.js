/*
Helpful references:
1) https://nodejs.org/api/net.html
2) https://node.readthedocs.io/en/latest/api/net/
3) https://www.tutorialspoint.com/nodejs/nodejs_net_module.htm
4) https://dev.to/devstoriesplayground/unveiling-the-power-of-tcp-building-apps-with-nodejss-net-module-2n8c
*/

// Client information
const net = require("node:net");
const portNumber = 8080;
const host = "localhost";

const client = net.createConnection(portNumber, host, () => {
    // Indicates when a client has connected to the server
    console.log("[Client] - Connected to server!");

    // Sends a response from the client to the server
    client.write("[Client] - Hello server!");
});

// Handles the event when receiving data from the server to the client
client.on("data", (data) => {
    console.log(`[Client] - Received data from server: ${data.toString()}`);

    // Closes the client connection to the server
    client.end();
});

// Handles the event when the client disconnects from the server
client.on("end", () => {
    console.log("[Client] - Disconnected from server!");
});

// Handles the event when there are errors from the client
client.on("error", (err) => {
    console.error(`[Client] - Error: ${err}`);
});