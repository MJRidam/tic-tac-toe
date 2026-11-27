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
function isboardFull() {
    return board.every(cell => cell !== '');
}
function endGame() {
    const winner = getwinner();
    if (winner) {
        statusText.textContent = `Player ${winner} wins!`;
    } else if (isboardFull()) {
        statusText.textContent = "It's a tie!";
    }
}
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameStarted = false;
    gameFinished = false;
    computerIsMoving = false;
    statusText.textContent = '';
    updateBoard();
}
function emptyIndexes() {
    const indexes = [];
    for (let index = 0; index < board.length; index++) {
        if (board[index] === '') {
            indexes.push(index);
        }
    }
    return indexes;
}
function canWin(player) {
    for (const index of emptyIndexes()) {
        board[index] = player;
        const winner = getwinner();
        board[index] = '';
        if (winner === player) {
            return index;
        }
    }
    return null;
}
function easycomputerMove() {
    const empty = emptyIndexes();
    const randomIndex = Math.floor(Math.random() * empty.length);
    return empty[randomIndex];
}
function mediumcomputerMove() {
    const winningMove = canWin('O');
    if (winningMove !== null) {
        return winningMove;
    }
    const blockingMove = canWin('X');
    if (blockingMove !== null) {
        return blockingMove;
    }
    return easycomputerMove();
}