let player = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let message = document.getElementById("message");
let rouResult = document.getElementById("roundresult");
let onGoingTurn = document.getElementById("currentTurn");
var playerOHealth = 100;
var playerXHealth = 100;
var attackBtn = document.getElementById('attack');
var healBtn = document.getElementById('heal');
var playerOHealthBar = document.getElementById('playerOHealthBar');
var playerXHealthBar = document.getElementById('playerXHealthBar');
var winner = "";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get("roomid"));

resetGame();

const roomData = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`)

roomData.on("value", (snapshot) => {
    console.log(snapshot.val());
    document.getElementById("roomTitle").innerHTML=`${snapshot.val().LobbyName}`;
});

function handleClick(id) {
    if (board[id] !== "" || gameOver) {
        return;
    }
    board[id] = player;
    document.getElementById(id).innerText = player;
    checkWinnerXO();
    switchPlayer();
    checkGamewinner();
}

function switchPlayer() {
    player = player === "X" ? "O" : "X";
    onGoingTurn.innerHTML = "Turn: " + player;
}

function checkWinnerXO() {
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
            winner = board[a];
            message.innerText = `${board[a]} Choose action`;
            attackBtn.disabled = false;
	        healBtn.disabled = false;
            return;
        }
    }
    if (!board.includes("")) {
        message.innerText = `it's a stalemate start again`;
        setTimeout(resetBoard, 2000);
    }
}

//resetAllGameAttribute
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    message.innerText = "";
    for (let i = 0; i < 9; i++) {
        document.getElementById(i).innerText = "";
    }
    attackBtn.disabled = true;
	healBtn.disabled = true;
    playerOHealth = 100;
    playerXHealth = 100;
    healthChange();
    message.innerHTML="";
    rouResult.innerHTML="";
    onGoingTurn.innerHTML = "Turn: " + player;
}

//resetBoardAfterXOgame
function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    message.innerText = "";
    for (let i = 0; i < 9; i++) {
        document.getElementById(i).innerText = "";
    }
    attackBtn.disabled = true;
	healBtn.disabled = true;
    healthChange();
    onGoingTurn.innerHTML = "Turn: " + player;
}


function healthChange() {
	playerOHealthBar.style.width = playerOHealth + "%";
	playerXHealthBar.style.width =  playerXHealth + "%";
}

function attackAction(){
    if(winner == "O"){
        console.log(winner, ": attack");
        if((playerXHealth - 15) > 0){
            playerXHealth -= 15;
            console.log("playerX's Health = ", playerXHealth);
        }
        else{
            playerXHealth = 0;
        } 
    }
    else if(winner == "X"){
        console.log(winner, ": attack");
        if((playerOHealth - 15) > 0){
            playerOHealth -= 15;
            console.log("playerO's Health = ", playerOHealth);
        }
        else{
            playerOHealth = 0;
        }        
    }
    healthChange();
    resetBoard();
    checkGamewinner();
}

function healAction(){
    if(winner == "X"){
        console.log(winner, ": heal");
        if((playerXHealth + 5) > 100){
        }
        else if((playerXHealth + 5) <= 100){
            playerXHealth += 5;
        }
        console.log(winner, ": ", playerXHealth);   
    }
    else if(winner == "O"){
        console.log(winner, ": heal");
        if((playerOHealth + 5) > 100){
        }  
        else if((playerOHealth + 5) <= 100){
            playerOHealth += 5;
        } 
        console.log(winner, ": ", playerOHealth);    
    }
    healthChange();
    resetBoard();
}

function checkGamewinner(){
    healthChange();
    if(playerOHealth == "0"){
        gameOver = true;
        rouResult.innerHTML = "X Wins!!";
    }
    else if(playerXHealth == "0"){
        gameOver = true;
        rouResult.innerHTML = "O Wins!!";
    }
}
