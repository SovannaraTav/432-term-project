// Battleship Game properties
const gridRowSize = 10;
const gridColumnSize = 10;
const shipPlacements = 
    [
    "I7",
    "E4", "E5",
    "A1", "A2", "A3",
    "J1", "J2", "J3", "J4", 
    "F10", "G10", "H10", "I10", "J10"
    ];
let grid = [];

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
battleship game when the user clicks on a table data cell
*/
function handleTableDataCellClick(event) {
    const clickedTableDataCell = event.target;
    const gridCoordinate = clickedTableDataCell.id;

    if (shipPlacements.includes(gridCoordinate)) {
        clickedTableDataCell.style.backgroundColor = "orange";
        displayMessage(`Hit on ${gridCoordinate}!`);
    }
    else {
        clickedTableDataCell.style.backgroundColor = "skyblue";
        displayMessage(`Miss on ${gridCoordinate}!`);
    }
}

/*
Function that handles the process of updating the state of the grid for the 
battleship game when the user specifies the coordinate of a table data cell 
in the text input element
*/
document.getElementById("send").addEventListener("click", () => {
    const gridCoordinate = 
        document.getElementById("messageInput").value.toUpperCase().trim();
    const row = (gridCoordinate.charCodeAt(0) - 65);
    const column = (parseInt(gridCoordinate[1]) - 1);

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