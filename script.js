const modeSelect = document.getElementById("gamemode");
const difficultySelect = document.getElementById("difficulty");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const cells = document.querySelectorAll(".cell");

const statusText = document.createElement("p");
statusText.style.color = "white";
statusText.style.textAlign = "center";

document.querySelector(".board").before(statusText);

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameStarted = false;
let gameFinished = false;
let computerIsMoving = false;

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function getWinner() {
    for (const line of winningLines) {
        const first = board[line[0]];
        const second = board[line[1]];
        const third = board[line[2]];

        if (first !== "" && first === second && second === third) {
            return first;
        }
    }

    return null;
}

function isBoardFull() {
    return board.every((cell) => cell !== "");
}

function endGame() {
    const winner = getWinner();

    if (winner !== null) {
        statusText.textContent = winner + " wins!";
        gameFinished = true;
        return true;
    }

    if (isBoardFull()) {
        statusText.textContent = "It is a draw!";
        gameFinished = true;
        return true;
    }

    return false;
}

function emptyIndexes() {
    const indexes = [];

    for (let index = 0; index < board.length; index++) {
        if (board[index] === "") {
            indexes.push(index);
        }
    }

    return indexes;
}

function canWin(player) {
    for (const index of emptyIndexes()) {
        board[index] = player;

        const winner = getWinner();

        board[index] = "";

        if (winner === player) {
            return index;
        }
    }

    return null;
}

function easyComputerMove() {
    const empty = emptyIndexes();
    const randomIndex = Math.floor(Math.random() * empty.length);

    return empty[randomIndex];
}

function mediumComputerMove() {
    const winningMove = canWin("O");

    if (winningMove !== null) {
        return winningMove;
    }

    const blockingMove = canWin("X");

    if (blockingMove !== null) {
        return blockingMove;
    }

    if (board[4] === "") {
        return 4;
    }

    return easyComputerMove();
}

function minimax(boardCopy, isComputer) {
    let winner = getWinnerFromBoard(boardCopy);

    if (winner === "O") {
        return 10;
    }

    if (winner === "X") {
        return -10;
    }

    const empty = boardCopy
        .map((value, index) => value === "" ? index : null)
        .filter((index) => index !== null);

    if (empty.length === 0) {
        return 0;
    }

    if (isComputer) {
        let bestScore = -Infinity;

        for (const index of empty) {
            boardCopy[index] = "O";
            const score = minimax(boardCopy, false);
            boardCopy[index] = "";

            bestScore = Math.max(bestScore, score);
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const index of empty) {
        boardCopy[index] = "X";
        const score = minimax(boardCopy, true);
        boardCopy[index] = "";

        bestScore = Math.min(bestScore, score);
    }

    return bestScore;
}

function getWinnerFromBoard(boardCopy) {
    for (const line of winningLines) {
        const first = boardCopy[line[0]];
        const second = boardCopy[line[1]];
        const third = boardCopy[line[2]];

        if (first !== "" && first === second && second === third) {
            return first;
        }
    }

    return null;
}

function hardComputerMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (const index of emptyIndexes()) {
        board[index] = "O";

        const score = minimax(board, false);

        board[index] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}

function computerMove() {
    if (gameFinished) {
        return;
    }

    let move;

    if (difficultySelect.value === "easy") {
        move = easyComputerMove();
    } else if (difficultySelect.value === "medium") {
        move = mediumComputerMove();
    } else {
        move = hardComputerMove();
    }

    board[move] = "O";
    computerIsMoving = false;

    updateBoard();

    if (!endGame()) {
        currentPlayer = "X";
        statusText.textContent = "Your turn";
    }
}

function playMove(index) {
    if (!gameStarted || gameFinished || board[index] !== "") {
        return;
    }

    if (modeSelect.value === "personvscomputer" && computerIsMoving) {
        return;
    }

    board[index] = currentPlayer;
    updateBoard();

    if (endGame()) {
        return;
    }

    if (modeSelect.value === "personvscomputer") {
        currentPlayer = "O";
        computerIsMoving = true;
        statusText.textContent = "Computer is thinking...";

        setTimeout(computerMove, 400);
    } else {
        if (currentPlayer === "X") {
            currentPlayer = "O";
        } else {
            currentPlayer = "X";
        }

        statusText.textContent = "Player " + currentPlayer + "'s turn";
    }
}

function startGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStarted = true;
    gameFinished = false;
    computerIsMoving = false;

    updateBoard();

    if (modeSelect.value === "personvscomputer") {
        statusText.textContent = "Your turn";
    } else {
        statusText.textContent = "Player X's turn";
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStarted = false;
    gameFinished = false;
    computerIsMoving = false;

    updateBoard();
    statusText.textContent = "Press Start Game";
}

function updateDifficultyVisibility() {
    if (modeSelect.value === "personvscomputer") {
        difficultySelect.style.display = "block";
    } else {
        difficultySelect.style.display = "none";
    }
}

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => playMove(index));
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

modeSelect.addEventListener("change", () => {
    updateDifficultyVisibility();
    resetGame();
});

difficultySelect.addEventListener("change", resetGame);

updateDifficultyVisibility();
resetGame();