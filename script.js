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
let computerMoving = false;
let computerTimer = null;

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

function getWinner(boardValues = board) {
    for (const line of winningLines) {
        const first = boardValues[line[0]];
        const second = boardValues[line[1]];
        const third = boardValues[line[2]];

        if (first !== "" && first === second && second === third) {
            return first;
        }
    }

    return null;
}

function getEmptyIndexes(boardValues = board) {
    const indexes = [];

    boardValues.forEach((value, index) => {
        if (value === "") {
            indexes.push(index);
        }
    });

    return indexes;
}

function isDraw(boardValues = board) {
    return getWinner(boardValues) === null &&
        getEmptyIndexes(boardValues).length === 0;
}

function endGame() {
    const winner = getWinner();

    if (winner !== null) {
        statusText.textContent = `Player ${winner} wins!`;
        gameFinished = true;
        return true;
    }

    if (isDraw()) {
        statusText.textContent = "It is a draw!";
        gameFinished = true;
        return true;
    }

    return false;
}

function findWinningMove(player) {
    for (const index of getEmptyIndexes()) {
        board[index] = player;

        const winner = getWinner();

        board[index] = "";

        if (winner === player) {
            return index;
        }
    }

    return null;
}

function easyMove() {
    const emptyIndexes = getEmptyIndexes();
    const randomPosition = Math.floor(
        Math.random() * emptyIndexes.length
    );

    return emptyIndexes[randomPosition];
}

function mediumMove() {
    const winningMove = findWinningMove("O");

    if (winningMove !== null) {
        return winningMove;
    }

    const blockingMove = findWinningMove("X");

    if (blockingMove !== null) {
        return blockingMove;
    }

    if (board[4] === "") {
        return 4;
    }

    return easyMove();
}

function minimax(boardValues, isComputer, depth) {
    const winner = getWinner(boardValues);

    if (winner === "O") {
        return 10 - depth;
    }

    if (winner === "X") {
        return depth - 10;
    }

    if (isDraw(boardValues)) {
        return 0;
    }

    const emptyIndexes = getEmptyIndexes(boardValues);

    if (isComputer) {
        let bestScore = -Infinity;

        for (const index of emptyIndexes) {
            boardValues[index] = "O";
            const score = minimax(boardValues, false, depth + 1);
            boardValues[index] = "";

            bestScore = Math.max(bestScore, score);
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const index of emptyIndexes) {
        boardValues[index] = "X";
        const score = minimax(boardValues, true, depth + 1);
        boardValues[index] = "";

        bestScore = Math.min(bestScore, score);
    }

    return bestScore;
}

function hardMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (const index of getEmptyIndexes()) {
        board[index] = "O";

        const score = minimax(board, false, 0);

        board[index] = "";

        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}

function makeComputerMove() {
    computerTimer = null;

    if (gameFinished) {
        return;
    }

    let move;

    if (difficultySelect.value === "easy") {
        move = easyMove();
    } else if (difficultySelect.value === "medium") {
        move = mediumMove();
    } else {
        move = hardMove();
    }

    if (move === null) {
        return;
    }

    board[move] = "O";
    computerMoving = false;

    updateBoard();

    if (!endGame()) {
        currentPlayer = "X";
        statusText.textContent = "Your turn";
    }
}

function playMove(index) {
    if (!gameStarted || gameFinished || computerMoving) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    board[index] = currentPlayer;
    updateBoard();

    if (endGame()) {
        return;
    }

    if (modeSelect.value === "personvscomputer") {
        currentPlayer = "O";
        computerMoving = true;
        statusText.textContent = "Computer is thinking...";
        computerTimer = setTimeout(makeComputerMove, 400);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function startGame() {
    if (computerTimer !== null) {
        clearTimeout(computerTimer);
        computerTimer = null;
    }

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStarted = true;
    gameFinished = false;
    computerMoving = false;

    updateBoard();

    if (modeSelect.value === "personvscomputer") {
        statusText.textContent = "Your turn";
    } else {
        statusText.textContent = "Player X's turn";
    }
}

function resetGame() {
    if (computerTimer !== null) {
        clearTimeout(computerTimer);
        computerTimer = null;
    }

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameStarted = false;
    gameFinished = false;
    computerMoving = false;

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