var turn = 'O'
var win = false;
var winner = '';
var blocks = document.querySelectorAll('.table-block');
var turnObject = document.getElementById('turn');

newGame();

for (var block of blocks) {
    // 1. Modify the code here to check click event on each block
    block.onclick = function (event) {
        // modify the condition here to continue the game play as long as there is no winner
        if (!win) {
            // 4. Modify the code here to check whether the clicking block is avialable.
            if(event.target.innerHTML == ""){
                event.target.innerHTML = turn;
                console.log(event.target)
                checkResult();
            }            
            
        }
    }
}

function checkResult() {
    // 2. Modify the code here to check whether someone win the game
    let lineA = (A0.innerHTML == A1.innerHTML && A0.innerHTML == A2.innerHTML) && A0.innerHTML != "";
    let lineB = (B0.innerHTML == B1.innerHTML && B0.innerHTML == B2.innerHTML) && B0.innerHTML != "";
    let lineC = (C0.innerHTML == C1.innerHTML && C0.innerHTML == C2.innerHTML) && C0.innerHTML != "";
    let line0 = (A0.innerHTML == B0.innerHTML && A0.innerHTML == C0.innerHTML) && A0.innerHTML != "";
    let line1 = (A1.innerHTML == B1.innerHTML && A1.innerHTML == C1.innerHTML) && A1.innerHTML != "";
    let line2 = (A2.innerHTML == B2.innerHTML && A2.innerHTML == C2.innerHTML) && A2.innerHTML != "";
    let DL = (A0.innerHTML == B1.innerHTML && A0.innerHTML == C2.innerHTML) && A0.innerHTML != "";
    let DR = (A2.innerHTML == B1.innerHTML && A2.innerHTML == C0.innerHTML) && C0.innerHTML != "";

    let GameResult = lineA || lineB || lineC || line0 || line1 || line2 || DL || DR;
    let isFull = A0.innerHTML != "" && A1.innerHTML != "" && A2.innerHTML != "" && B0.innerHTML != "" && B1.innerHTML != "" && B2.innerHTML != "" && C0.innerHTML != "" && C1.innerHTML != "" && C2.innerHTML != "";
    if (GameResult) {
        //Game end and someone wins the game
        winner = turn;
        turnObject.innerHTML = "Game win by " + winner;
        win = true;
    } else if (isFull) {
        // Game end and no-one wins the game
        turnObject.innerHTML = "Game draw";
    } else {
        // The game is on going
        turn = turn === 'O' ? 'X' : 'O';
        turnObject.innerHTML = "Turn: " + turn;
    }
}
function newGame() {
    turn = 'O';
    turnObject.innerHTML = "Turn: " + turn;
    winner = '';
    win = false;
    // 3. Modify the code here to reset the game to initial state
    let allTable = document.querySelectorAll(".table-block");
    allTable.forEach(el => (el.innerHTML = ""));
}
