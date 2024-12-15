/*
Battleship Game properties. The user who hosts the server beforehand can change 
their ship placements before starting the server and allowing clients to connect 
to the server
*/
const gridRowSize = 10;
const gridColumnSize = 10;
const shipPlacements = 
    [
    "I7", // 1-length ship
    "E4", "E5", // 2-length ship. Only vertical or horizontal
    "A1", "A2", "A3", // 3-length ship. Only vertical or horizontal
    "J1", "J2", "J3", "J4", // 4-length ship. Only vertical or horizontal
    "F10", "G10", "H10", "I10", "J10" // 5-length ship. Only vertical or horizontal
    ];
let grid = [];
let playerHitCoordinates = [];
let isGameOver = false;

/*
Function that handles the process of creating the necessary HTML elements and 
assigning their corresponding coordinate on the grid for the battleship game
*/
function createBattleshipGameGrid() {
    const tableElement = document.getElementById("grid");
    for(let row = 0; row < gridRowSize; row++) {
        const tableRowElement = document.createElement("tr");
        let gridRow = [];

        for(let column = 0; column < gridColumnSize; column++) {
            const tableDataCellElement = document.createElement("td");
            const gridCoordinate = `${String.fromCharCode(65 + row)}${column + 1}`;

            tableDataCellElement.id = gridCoordinate;
            tableDataCellElement.innerText = tableDataCellElement.id;
            tableDataCellElement
                .addEventListener("click", handleTableDataCellClick);
            tableRowElement.appendChild(tableDataCellElement);
            gridRow.push(tableDataCellElement);
        }

        grid.push(gridRow);
        tableElement.appendChild(tableRowElement);
    }
}

/*
Function that handles the process of updating the state of the grid for the 
battleship game when the user clicks on a table data cell and checking the game 
status
*/
function handleTableDataCellClick(event) {
    if (isGameOver) {
        return;
    }

    // Automatically fills in the text input element after clicking
    const clickedTableDataCell = event.target;
    const gridCoordinate = clickedTableDataCell.id;
    const messageInputElement = document.getElementById("messageInput");
    messageInputElement.value = gridCoordinate;
    const inputEvent = new Event("input");
    messageInputElement.dispatchEvent(inputEvent);

    if (shipPlacements.includes(gridCoordinate)) {
        clickedTableDataCell.style.backgroundColor = "orange";
        playerHitCoordinates.push(gridCoordinate);
        displayMessage(`Hit on ${gridCoordinate}!`);
    }
    else {
        clickedTableDataCell.style.backgroundColor = "skyblue";
        displayMessage(`Miss on ${gridCoordinate}!`);
    }

    checkGameStatus();
}

/*
Function that handles the process of determining whether the battleship game is 
over or not by checking if all ship placements were hit and displaying a 
congratulations message if so
*/
function checkGameStatus() {
    let isAllShipsHit = 
        shipPlacements.every(ship => playerHitCoordinates.includes(ship));
    const username = document.getElementById("registerInput").value;
    if (isAllShipsHit && username.trim().length !== 0) {
        isGameOver = true;
        const checkWinnerInputElement = document.getElementById("checkWinnerInput");
        checkWinnerInputElement.value = username;
        const inputEvent = new Event("input");
        checkWinnerInputElement.dispatchEvent(inputEvent);
        displayMessage(`Congratulations, ${username} has won the game!`);
    }
}

/*
Function that handles the process of updating the state of the grid for the 
battleship game when the user specifies the coordinate of a table data cell 
in the text input element. Currently disabled since the user can click on the 
grid to update the state of it
*/
document.getElementById("send").addEventListener("click", () => {
    const gridCoordinate = 
        document.getElementById("messageInput").value.toUpperCase().trim();
    const row = (gridCoordinate.charCodeAt(0) - 65);
    const column = (parseInt(gridCoordinate.slice(1)) - 1);

    if (row >= 0 && row < gridRowSize && 
        column >= 0 && column < gridColumnSize) {
        const tableDataCell = grid[row][column];
        if (shipPlacements.includes(gridCoordinate)) {
            tableDataCell.style.backgroundColor = "orange";
            displayMessage(`Hit on ${gridCoordinate}!`);
        } 
        else {
            tableDataCell.style.backgroundColor = "skyblue";
            displayMessage(`Miss on ${gridCoordinate}!`);
        }
    } 
    else {
        displayMessage('Invalid coordinate!');
    }
});

/*
Function that handles the process of displaying whether the user's selected 
coordinate was a hit or miss for the grid of the battleship game
*/
function displayMessage(message) {
    document.getElementById("message").innerText = message;
}

createBattleshipGameGrid();