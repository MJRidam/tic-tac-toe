const modeSelect = document.getElementById('gamemode');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cell');
const statusText = document.createElement('p');
statusText.style.color = 'white';
statusText.style.textAlign = 'center';
document.querySelector('.board').before(statusText);
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameStarted = false;
let gameFinished = false;
let computerIsMoving = false;

const winningLines = [   // after finishing rename all the variables to be more descriptive.
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];



function updateBoard( ) {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}
 function getwinner() {
    for (const line of winningLines) {
        const first = board[line[0]];
        const second = board[line[1]];
        const third = board[line[2]];
        if (first !== '' && first === second && second === third) {
            return first;
        }
    }
    return null;
}
