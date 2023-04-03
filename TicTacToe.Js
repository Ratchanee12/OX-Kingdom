let player = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let message = document.getElementById("message");

function handleClick(id) {
    if (board[id] !== "" || gameOver) {
        return;
    }
    board[id] = player;
    document.getElementById(id).innerText = player;
    checkWinner();
    switchPlayer();
}

function switchPlayer() {
    player = player === "X" ? "O" : "X";
}

function checkWinner() {
    let winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winningPositions.length; i++) {
        let [a, b, c] = winningPositions[i];
        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            message.innerText = `${board[a]} wins!`;
            return;
        }
    }
    if (!board.includes("")) {
        gameOver = true;
        message.innerText = "Game over. It's a tie.";
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    message.innerText = "";
    for (let i = 0; i < 9; i++) {
        document.getElementById(i).innerText = "";
    }
}