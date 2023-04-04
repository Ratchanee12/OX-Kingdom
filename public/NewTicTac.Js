// TODO: Replace the following with your own firebaseConfig.
  const firebaseConfig = {
  apiKey: "AIzaSyCwvd9LqYBKQWcML7wm7NrpJpt2VodOR2Q",
  authDomain: "oxkingdom-1028e.firebaseapp.com",
  databaseURL: "https://oxkingdom-1028e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oxkingdom-1028e",
  storageBucket: "oxkingdom-1028e.appspot.com",
  messagingSenderId: "411804462751",
  appId: "1:411804462751:web:255e336c15569b7a53bcaa",
  measurementId: "G-8GH3DQSQ6H"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database(app);
  
  const gameBoard = document.getElementById("game-board");
  const buttons = gameBoard.getElementsByTagName("button");
  const resetButton = document.getElementById("reset");
  const statusElement = document.getElementById("status");
  
  let player = null;
  let board = ["", "", "", "", "", "", "", "", ""];
  let isMyTurn = false;
  
  // Update game state
  function updateGameState() {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].textContent = board[i];
    }
  }
  
  // Reset game state
  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    database.ref("gameState").set(board);
  }
  
  gameBoard.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    if (isNaN(index) || board[index] !== "" || !isMyTurn) return;
  
    board[index] = player;
    isMyTurn = !isMyTurn;
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    database.ref("gameState").set(board);
  });
  
  resetButton.addEventListener("click", resetGame);
  
  // Firebase listeners
  database.ref("player").once("value", (snapshot) => {
    const currentPlayer = snapshot.val();
    player = currentPlayer === "X" ? "O" : "X";
    isMyTurn = player === "X";
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    database.ref("player").set(player);
  });
  
  database.ref("gameState").on("value", (snapshot) => {
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
    database.ref("gameState").set(board);
  }
  
  gameBoard.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    if (isNaN(index) || board[index] !== "" || !isMyTurn) return;
  
    board[index] = player;
    isMyTurn = !isMyTurn;
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    database.ref("gameState").set(board);
  });
  
  resetButton.addEventListener("click", resetGame);
  
  // Firebase listeners
  database.ref("player").once("value", (snapshot) => {
    const currentPlayer = snapshot.val();
    player = currentPlayer === "X" ? "O" : "X";
    isMyTurn = player === "X";
    statusElement.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
    database.ref("player").set(player);
  });
  
  database.ref("gameState").on("value", (snapshot) => {
    const newGameState = snapshot.val();
    if (newGameState) {
      board = newGameState;
      updateGameState();
    }
  });