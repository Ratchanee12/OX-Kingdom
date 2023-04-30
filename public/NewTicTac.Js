// Initialize Firebase

  
  const gameBoard = document.getElementById("game-board");
  const buttons = gameBoard.getElementsByTagName("button");
  const resetButton = document.getElementById("reset");
  const statusElement = document.getElementById("status");
  
  let player = null;
  let board = ["", "", "", "", "", "", "", "", ""];
  let isMyTurn = false;
  
  const roomRef = firebase.database().ref("RoomList");

  const userList = firebase.database().ref("UserList");
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  console.log("UrlParams: ",urlParams.get("roomid"));
  
  const roomData = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

  // Update game state
  function updateGameState() {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].textContent = board[i];
    }
  }
  
  // Reset game state
  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    roomData.ref("gameState").set(board);
  }
  
  gameBoard.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    if (isNaN(index) || board[index] !== "" || !isMyTurn) return;
  
    board[index] = player;
    isMyTurn = !isMyTurn;
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    roomData.ref("gameState").set(board);
  });
  
  resetButton.addEventListener("click", resetGame);
  
  // Firebase listeners
  roomData.once("value", (snapshot) => {
    const currentPlayer = snapshot.val();
    player = currentPlayer === "X" ? "O" : "X";
    isMyTurn = player === "X";
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    roomData.set(player);
  });
  
  roomData.ref("gameState").on("value", (snapshot) => {
    const newGameState = snapshot.val();
    if (newGameState) {
      board = newGameState;
      updateGameState();
    }
  });// TODO: Replace the following with your own firebaseConfig.
 
  // Update game state
  function updateGameState() {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].textContent = board[i];
    }
  }
  
  // Reset game state
  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    roomData.ref("gameState").set(board);
  }
  
  gameBoard.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    if (isNaN(index) || board[index] !== "" || !isMyTurn) return;
  
    board[index] = player;
    isMyTurn = !isMyTurn;
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    roomData.ref("gameState").set(board);
  });
  
  resetButton.addEventListener("click", resetGame);
  
  // Firebase listeners
  roomData.once("value", (snapshot) => {
    const currentPlayer = snapshot.val();
    player = currentPlayer === "X" ? "O" : "X";
    isMyTurn = player === "X";
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    roomData.set(player);
  });
  
  roomData.ref("gameState").on("value", (snapshot) => {
    const newGameState = snapshot.val();
    if (newGameState) {
      board = newGameState;
      updateGameState();
    }
  });