/*
Helpful references:
1) https://nodejs.org/api/net.html
2) https://node.readthedocs.io/en/latest/api/net/
3) https://www.tutorialspoint.com/nodejs/nodejs_net_module.htm
4) https://dev.to/devstoriesplayground/unveiling-the-power-of-tcp-building-apps-with-nodejss-net-module-2n8c
*/

// Server information
const net = require("node:net");
const portNumber = 8080;

const server = net.createServer((socket) => {
    // Indicates when a client has connected to the server
    console.log("[Server] - Client connected!");

    // Handles the event when receiving data from the client to the server
    socket.on("data", (data) => {
        console.log(`[Server] - Received data from client: ${data.toString()}`);

        // Sends a response from the server to the client
        socket.write("[Server] - Hello client!");
    });

    // Handles the event when the client disconnects from the server
    socket.on("end", () => {
        console.log("[Server] - Client disconnected!");
    });

    // Handles the event when there are errors from the server
    socket.on("error", (err) => {
        console.error(`[Server] - Error: ${err}`);
    });
});

// Indicates what port number the server is listening on
server.listen(portNumber, () => {
    console.log(`[Server] - Listening on port #${portNumber}`);
});