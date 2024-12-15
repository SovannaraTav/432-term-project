# 432-term-project (Battleship Game)
## Description
<strong>[1]</strong> Develop a variation to the game [Battleship](https://en.wikipedia.org/wiki/Battleship_(game)). 
In a traditional Battleship game, you have a 1v1 match where beforehand each player places five ship of different 
lengths on their grid board and then take turns specifying the coordinate to the other player to record if it was 
hit or miss. When a player has hit all five ships of their opponent and still has remaining ships, that player 
wins.

<strong>[2]</strong> In my variation of Battleship, the user who hosts the server decides where to place the five 
ships on the grid board. Next, any user as a client through their browser will connect to the server and fill out 
the necessary information required by them. From there, it is a competition of which client from the client list 
can hit all five ships of the user hosting the server first. If a client for a game has hit all five ships, that 
client wins and defeats the other clients for that game.

## Instructions to compile and run code
<strong>[1]</strong> Ensure to have [Node.js](https://nodejs.org/en) installed on your computer which will also 
include npm when you download it. 

<strong>[2]</strong> Verify that Node.js is installed by entering `node -v` on the command line. To also verify 
the installation of npm, enter `npm -v` on the command line.

<strong>[3]</strong> Download this project into Visual Studio Code.

<strong>[4]</strong> In this project, for sockets, I'm using the [ws (WebSocket) library](https://www.npmjs.com/package/ws) 
and [net module](https://nodejs.org/api/net.html). The net module which is in some ways similar, but also different to the 
POSIX sockets used in C/C++ is a core module in Node.js, thus it comes pre-installed with Node.js. However, for the ws 
library, this is an external package, thus enter `npm install ws` on the command line at the root of the project folder to 
install it.

<strong>[5]</strong> From there, to start the server, enter `node server.js` on the command line.

<strong>[6]</strong> To connect to the server as a client, open the `index.html` by double clicking the file in your file 
explorer app which will open it in a browser and it will automatically connect to the server.

<strong>[7]</strong> As a client through the browser, to disconnect from the server, close the browser tab and the server 
will detect the disconnection. To reconnect to the server if it is still running, repeat step #6.

<strong>[8]</strong> To stop the server, execute `Ctrl + C` on the command line to terminate the process. To start up the 
server again, repeat step #5.

<strong>[Note]</strong> If the `index.html` is already open in a browser tab before starting the server, after starting 
the server on the command line, refresh the browser tab to automatically connect to the server.

## Implementation documentation
### [1]: Network architecture model
Since I wanted this variation of Battleship to occur on the browser, I used the client-server architecture where the 
server (`server.js`) is running in a Node.js environment in Visual Studio Code while the client is the user opening the 
`index.html` file in a browser tab which will load in the `client.js` and `script.js` files and will also automatically 
connect to the server.

### [2]: High level overview
<strong>[a]</strong> The `server.js` file runs a WebSocket (ws library) server as well as a NetTCP (net module) server. 
The WebSocket server is the higher level networking which is then transform into the lower level networking provided by 
the NetTCP server since the net module allows you to establish a TCP server and connections. This file keeps track of 
the list of registered players and games as well as handling the sending and receiving of data.

<strong>[b]</strong> When the user as a client opens `index.html` in a browser tab, it will automatically connect to 
the server after it gets started. This file loads in `client.js` and `script.js`. `script.js` contains my Battleship 
game logic while the `client.js` file contains a NetworkManager class to which it communicates with to separate my 
Battleship game logic away from my networking logic. `script.js` also handles updating the UI for `index.html` and 
capturing any information from it if needed.

<strong>[c]</strong> For `client.js`, the NetworkManager class creates a WebSocket connection to the WebSocket server 
which is why opening `index.html` in a browser tab after the server is running automatically establishes the browser 
as a client connecting to the server. This file also handles updating the UI for `index.html` and capturing any 
information from it if needed.

<strong>[d]</strong> When the NetworkManager class in `client.js` needs to send data to the WebSocket server, if the 
data being sent is a grid coordinate, it will send it as a message string. If the data being sent is some network 
action, it will send the data in the form of a JavaScript Object Notation (JSON) string.

<strong>[e]</strong> When the NetworkManager class in `client.js` receives data from the WebSocket server, if the 
data being received is a message string, it displays it and logs info into the browser console. If the data being 
received is in the form of a JSON string, it parses it out to display it and logs info into the browser console.

<strong>[f]</strong> When the WebSocket server in `server.js` receives data, it will create a NetTCP connection to 
the NetTCP server to send the data. The NetTCP will then take the necessary action based on if the data is a message 
string or parsing out a JSON string. From there, it will send data back to the WebSocket server either in the form of 
a message string or JSON string to then have the NetworkManager class in `client.js` handle. During the server process, 
info is log into the Visual Studio Code terminal.

### [3]: Network protocol implementation
<strong>[a] Register</strong> - The user as a client through the browser inputs an username in a input text field in 
`index.html` and clicks a register button. The NetworkManager class in `client.js` captures its data and sends it to 
the WebSocket server which sends the data to the NetTCP server (`server.js`). The NetTCP server handles the process 
and sends data back to the WebSocket server which sends it back to the NetworkManager class to display info in browser 
console and update the UI of `index.html`.

<strong>[b] List Games</strong> - The user as a client through the browser clicks a list games button in `index.html`. 
The NetworkManager class in `client.js` sends a request to the WebSocket server which sends the request to the NetTCP 
server (`server.js`). The NetTCP server handles the process and sends data back to the WebSocket server which sends it 
back to the NetworkManager class to display info in browser console and update the UI of `index.html`.

<strong>[c] Create Game</strong> - The user as a client through the browser inputs a game ID in a input number field 
in `index.html` and clicks a create game button. The NetworkManager class in `client.js` captures its data and sends 
it to the WebSocket server which sends the data to the NetTCP server (`server.js`). The NetTCP server handles the 
process and sends data back to the WebSocket server which sends it back to the NetworkManager class to display info 
in browser console and update the UI of `index.html`.

<strong>[d] Join Game</strong> - The user as a client through the browser inputs a game ID in a input number field 
in `index.html` and clicks a join game button. The NetworkManager class in `client.js` captures its data and sends 
it to the WebSocket server which sends the data to the NetTCP server (`server.js`). The NetTCP server handles the 
process and sends data back to the WebSocket server which sends it back to the NetworkManager class to display info 
in browser console and update the UI of `index.html`.

<strong>[e] Exit Game</strong> - The user as a client through the browser inputs a game ID in a input number field 
in `index.html` and clicks an exit game button. The NetworkManager class in `client.js` captures its data and sends 
it to the WebSocket server which sends the data to the NetTCP server (`server.js`). The NetTCP server handles the 
process and sends data back to the WebSocket server which sends it back to the NetworkManager class to display info 
in browser console and update the UI of `index.html`.

<strong>[f] Unregister</strong> - The user as a client through the browser inputs an username in a input text field 
in `index.html` and clicks a unregister button. The NetworkManager class in `client.js` captures its data and sends 
it to the WebSocket server which sends the data to the NetTCP server (`server.js`). The NetTCP server handles the 
process and sends data back to the WebSocket server which sends it back to the NetworkManager class to display info 
in browser console and update the UI of `index.html`.

<strong>[g] Application Specific Protocol</strong> - When the user as a client clicks on a grid item of the Battleship 
grid, `script.js` which contains the Battleship game logic captures it and updates the UI of `index.html`. The 
NetworkManager class in `client.js` also sends the captured data to the WebSocketSever which sends the data to the NetTCP 
server (`server.js`). The NetTCP server handles the process and sends data back to the WebSocket server which sends it 
back to the NetworkManger class to display info in browser console and update the UI of `index.html`.

## How to play documentation
<strong>[1]</strong> Before starting server with `node server.js` on the command line, adjust ship placements if you want 
to in `script.js` with the shipPlacements array.

<strong>[2]</strong> Start server and open as many `index.html` in the browser tab as you want to serve as clients which 
will automatically connect. Or refresh each browser tab client if you open them beforehand after starting the server.

<strong>[3]</strong> Register username in input text field and click `Register` button. Keep the registered username in 
the input text field and don't backspace to remove it.

<strong>[4]</strong> Click `List games` button to see list of games. If empty, enter a create game ID in the input number 
field and click `Create game` button which will automatically join you in that game. Leave the create game ID in the input 
number field and don't backspace to remove it. Ensure the join game input number field is empty.

<strong>[5]</strong> For `List games` button, if not empty, enter a join game ID in the input number field and click 
`Join game` button which will cause you to join that game. Leave the join game ID in the input number field and don't 
backspace to remove it. Ensure the create game input number field is empty.

<strong>[6]</strong> Play the Battleship game by clicking on the grid board until you have hit all ships. Click the 
`Check winner` button from time to time to check if there is a winner for the game. If you win or another client wins, stop 
playing the Battleship game.

<strong>[7]</strong> If you are fully done playing, enter your registered username in the input text field for unregister 
username and click `Unregister` button which will automatically exit out the games you join for you and unregister your username.

<strong>[8]</strong> To exit out of a game you have join, enter the exit game ID in the input number field and click `Exit game` 
which will cause you to exit that game. Then, enter your registered username in the input text field for unregister username and 
click `Unregister` button which will unregister your username.

<strong>[9]</strong> Close the browser tab to disconnect you as a client from the server.

<strong>[10]</strong> `Ctrl + C` in the command line to stop the server.

<strong>[11]</strong> Repeat steps #1 to #10 to play again with different ship placements.

## Screenshots
<strong>[1]</strong> View the `screenshots` folder in sequence starting from 1 and ending at 21 to see the entire process of my 
project in action.