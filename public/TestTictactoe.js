const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log("UrlParams: ",urlParams.get("roomid"));

const gameRef = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

const Gameuid = `${urlParams.get("roomID")}`;

const userList = firebase.database().ref("UserList");

const boardRef = firebase.database().ref(`xoGame/${urlParams.get("roomid")}`);
const btnJoins =  document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoins) => btnJoins.addEventListener("click", joinGame));

var playerOHealthBar = document.getElementById('playerOHealthBar');
var playerXHealthBar = document.getElementById('playerXHealthBar');

var playerturn;
var currentUser;
var opponentHealth;
var playerHealth;
let opponent;
var attackDmg;
var healValue;

// ADD New //
var win = false;

const Elements =  document.querySelectorAll(".table-col");
Elements.forEach((el) => el.addEventListener("click", SendToxoGame));
function SendToxoGame(ev) {
    gameRef.once('value', snapshot => {
        var gameInfo = snapshot.val();
        var CurrentTurn = snapshot.val().Turn;
        currentUser = firebase.auth().currentUser.uid;

        if(snapshot.val().state != "end"){
            if(currentUser == snapshot.val()[`User${CurrentTurn}`]){
                console.log("Ev Check: ",ev.currentTarget.innerText)
                if ((ev.currentTarget.innerText == "" && gameInfo['Winner'] == "")){
                    console.log("Last Click",ev.currentTarget.id)
                    ev.currentTarget.textContent = gameInfo['Turn']
                    boardRef.update({
                        [`${ev.currentTarget.id}`] : gameInfo['Turn']
                    })
                    checkGame();
                    gameRef.update({
                        Turn : snapshot.val().Turn == 'O' ? 'X' : 'O',
                    })
                }
                
            }
        }
    })
}

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

function GameUpdate(snapshot) {
    setTimeout(() => {
        gameRef.once('value', (snapshot) =>{
            var GameInfo = snapshot.val();
            document.getElementById("attackBtn").disabled = true;
            document.getElementById("healBtn").disabled = true;
            Object.keys(GameInfo).forEach((key) => {
                switch (key) {
                    case "UserX":
                        if (GameInfo[`${key}`] != '') {
                            userList.child(`${GameInfo[`${key}`]}`).once('value',(usersnapshot) =>{
                                let UserInfo = usersnapshot.val()
                                console.log(UserInfo.username)
                                document.querySelector('#PlayerX').textContent = `Player X: ${UserInfo.username}`
                            })
                        }
                        break;
                    case "UserO":
                        if (GameInfo[`${key}`] != '') {
                            userList.child(`${GameInfo[`${key}`]}`).once('value',(usersnapshot) =>{
                                let UserInfo = usersnapshot.val()
                                console.log(UserInfo.username)
                                document.querySelector('#PlayerO').textContent = `Player O: ${UserInfo.username}`
                            })
                        }
                        break;
                }
                document.getElementById('GameState').innerText = `Turn: ${GameInfo["Turn"]}`;
                playerOHealthBar.style.width = parseInt(snapshot.val().playerOHealth) + "%";
	            playerXHealthBar.style.width = parseInt(snapshot.val().playerXHealth) + "%";
            })
            if (GameInfo['state'] == 'action') {
                let turnWinner = snapshot.val().Winner
                currentUser = firebase.auth().currentUser
                console.log("Winner Turn: ",turnWinner)
                console.log("User Uid: ", currentUser.uid)
                console.log("Winner Uid: ", snapshot.val()[`User${turnWinner}`])
                if(currentUser.uid == snapshot.val()[`User${turnWinner}`]){
                    opponent = snapshot.val().Winner == 'O' ? 'X' : 'O'
                    console.log(snapshot.val()[`player${opponent}Health`])
                    document.getElementById("attackBtn").disabled = false;
                    document.getElementById("healBtn").disabled = false;
                    opponentHealth = snapshot.val()[`player${opponent}Health`];
                    playerHealth = snapshot.val()[`player${turnWinner}Health`];
                }
            }
            else if (GameInfo['state'] == 'end'){
                turnWinner = snapshot.val().Winner
                currentUser = firebase.auth().currentUser.uid
                GameWinner = snapshot.val()[`User${turnWinner}`]
                console.log("Game End")
                console.log(snapshot.val().Winner)
                console.log("Game Winner: ", snapshot.val()[`User${turnWinner}`])
                console.log("CurrentUser: ", currentUser)
                if(currentUser == GameWinner){
                    console.log("In condition Winner")
                    userList.child(currentUser).once("value", (snapshot)=>{
                        
                    })
                }
            }
        });
    },100);
}

gameRef.on("value", (snapshot) =>{
    GameUpdate(snapshot)
});

boardRef.on('value', (snapshot) =>{
    // boardRef.once('value', (snapshot) => {
        var boardInfo = snapshot.val();
        console.log(boardInfo)
        if(boardInfo != null){
            Elements.forEach((el) =>{
                var eid = el.id
                console.log(eid)
                el.textContent = boardInfo[`${eid}`]
            });
        } else{
            boardRef.update({
                "row-1-col-1" :  "",
                "row-1-col-2" :  "",
                "row-1-col-3" :  "",
                "row-2-col-1" :  "",
                "row-2-col-2" :  "",
                "row-2-col-3" :  "",
                "row-3-col-1" :  "",
                "row-3-col-2" :  "",        
                "row-3-col-3" :  "",
            })
        }
    // })
});

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function(){
    boardRef.update({
        "row-1-col-1" :  "",
        "row-1-col-2" :  "",
        "row-1-col-3" :  "",
        "row-2-col-1" :  "",
        "row-2-col-2" :  "",
        "row-2-col-3" :  "",
        "row-3-col-1" :  "",
        "row-3-col-2" :  "",        
        "row-3-col-3" :  "",
    })
    gameRef.update({
        Turn:"O",
        Winner:"",
        state:"check",
        playerOHealth:100,
        playerXHealth:100,
    })
})

function checkGame(){
    gameRef.once("value", (snapshot) =>{ 
        boardRef.once("value", (data) =>{
            let board = data.val();
            if(board != null){
                console.log("row1col1",board["row-1-col-1"])
                console.log("row2col1",board["row-2-col-1"] == "O")
                console.log("snapshot turn: ", snapshot.val().Turn)
                if((board["row-1-col-1"] == snapshot.val().Turn) && (board["row-1-col-2"] == snapshot.val().Turn) && (board["row-1-col-3"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win", snapshot.val().Turn)
                } 
                else if((board["row-2-col-1"] == snapshot.val().Turn) && (board["row-2-col-2"] == snapshot.val().Turn) && (board["row-2-col-3"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-3-col-1"] == snapshot.val().Turn) && (board["row-3-col-2"] == snapshot.val().Turn) && (board["row-3-col-3"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-1-col-1"] == snapshot.val().Turn) && (board["row-2-col-1"] == snapshot.val().Turn) && (board["row-3-col-1"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-1-col-2"] == snapshot.val().Turn) && (board["row-2-col-2"] == snapshot.val().Turn) && (board["row-3-col-2"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-1-col-3"] == snapshot.val().Turn) && (board["row-2-col-3"] == snapshot.val().Turn) && (board["row-3-col-3"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-3-col-1"] == snapshot.val().Turn) && (board["row-2-col-2"] == snapshot.val().Turn) && (board["row-1-col-3"] == snapshot.val().Turn)){
                    gameRef.update({
                        Winner: snapshot.val().Turn,
                        state: "action",
                    })
                    console.log("Win")
                }
                else if((board["row-1-col-1"] != "") && (board["row-1-col-2"] != "") && (board["row-1-col-3"] != "")&& (board["row-2-col-1"] != "")&&(board["row-2-col-2"] != "")&&(board["row-2-col-3"] != "")&&
                (board["row-3-col-1"] != "")&&(board["row-3-col-2"] != "")&&(board["row-3-col-3"] != "")){
                    boardRef.update({
                        "row-1-col-1" :  "",
                        "row-1-col-2" :  "",
                        "row-1-col-3" :  "",
                        "row-2-col-1" :  "",
                        "row-2-col-2" :  "",
                        "row-2-col-3" :  "",
                        "row-3-col-1" :  "",
                        "row-3-col-2" :  "",        
                        "row-3-col-3" :  "",
                    })
                    gameRef.update({
                        Turn:"O",
                        state: "check",
                    })
                    console.log("Win")
                }
            }
        })
    })
}

const attackAction = document.getElementById("attackBtn");
attackAction.addEventListener("click", function(){
    console.log("Attack")
    gameRef.once("value", (snapshot) =>{
        console.log("Opponent: ",opponent)
        console.log("Opponent Health:",snapshot.val()[`player${opponent}Health`])
        attackDmg = 15;
        let calculatedHealth = parseInt(snapshot.val()[`player${opponent}Health`]-attackDmg);
        
        if(opponent == 'X'){
            if(calculatedHealth <= 0){
                calculatedHealth = 0;
                gameRef.update({
                    playerXHealth: calculatedHealth,
                    state: "end",
                    Winner:"O",
                    Turn:"O",
                 })
                 boardRef.update({
                    "row-1-col-1" :  "",
                    "row-1-col-2" :  "",
                    "row-1-col-3" :  "",
                    "row-2-col-1" :  "",
                    "row-2-col-2" :  "",
                    "row-2-col-3" :  "",
                    "row-3-col-1" :  "",
                    "row-3-col-2" :  "",        
                    "row-3-col-3" :  "",
                })
            }else{
                calculatedHealth = parseInt(snapshot.val()[`player${opponent}Health`]-attackDmg);
                gameRef.update({
                    playerXHealth: calculatedHealth,
                    state: "check",
                    Winner:"",
                    Turn:"O",
                 })
                 boardRef.update({
                    "row-1-col-1" :  "",
                    "row-1-col-2" :  "",
                    "row-1-col-3" :  "",
                    "row-2-col-1" :  "",
                    "row-2-col-2" :  "",
                    "row-2-col-3" :  "",
                    "row-3-col-1" :  "",
                    "row-3-col-2" :  "",        
                    "row-3-col-3" :  "",
                })
            }
            
             console.log("Player X reduce Health");
        } else if(opponent == 'O'){
            if(calculatedHealth <= 0){
                calculatedHealth = 0;
                gameRef.update({
                    playerOHealth: calculatedHealth,
                    state: "end",
                    Winner:"X",
                    Turn:"O",
                 })
                 boardRef.update({
                    "row-1-col-1" :  "",
                    "row-1-col-2" :  "",
                    "row-1-col-3" :  "",
                    "row-2-col-1" :  "",
                    "row-2-col-2" :  "",
                    "row-2-col-3" :  "",
                    "row-3-col-1" :  "",
                    "row-3-col-2" :  "",        
                    "row-3-col-3" :  "",
                })
            }else{
                calculatedHealth = parseInt(snapshot.val()[`player${opponent}Health`]-attackDmg);
                gameRef.update({
                    playerOHealth: calculatedHealth,
                    state: "check",
                    Winner:"",
                    Turn:"O",
                 })
                 boardRef.update({
                    "row-1-col-1" :  "",
                    "row-1-col-2" :  "",
                    "row-1-col-3" :  "",
                    "row-2-col-1" :  "",
                    "row-2-col-2" :  "",
                    "row-2-col-3" :  "",
                    "row-3-col-1" :  "",
                    "row-3-col-2" :  "",        
                    "row-3-col-3" :  "",
                })
            }
            
            console.log("Player O reduce Health");
        }
        
    })
});


const healAction = document.getElementById("healBtn");
healAction.addEventListener("click",  function(){
    console.log("Heal")
    gameRef.once("value", (snapshot) =>{
        healValue = 5;
        let calculatedHealth = parseInt(snapshot.val()[`player${snapshot.val().Winner}Health`]+healValue);
        if(snapshot.val().Winner == 'X'){
            if (calculatedHealth > 100){
                calculatedHealth = 100;
            } else{
                calculatedHealth = parseInt(snapshot.val()[`player${snapshot.val().Winner}Health`]+healValue);
            }
            gameRef.update({
                playerXHealth: calculatedHealth,
                state: "check",
                Winner:"",
                Turn:"O",
             })
             boardRef.update({
                "row-1-col-1" :  "",
                "row-1-col-2" :  "",
                "row-1-col-3" :  "",
                "row-2-col-1" :  "",
                "row-2-col-2" :  "",
                "row-2-col-3" :  "",
                "row-3-col-1" :  "",
                "row-3-col-2" :  "",        
                "row-3-col-3" :  "",
             })
             console.log("Player X reduce Health");
        } else if(snapshot.val().Winner == 'O'){
            if (calculatedHealth > 100){
                calculatedHealth = 100;
            } else{
                calculatedHealth = parseInt(snapshot.val()[`player${snapshot.val().Winner}Health`]+healValue);
            }
            gameRef.update({
                playerOHealth: calculatedHealth,
                state: "check",
                Winner:"",
                Turn:"O",
            })
            boardRef.update({
                "row-1-col-1" :  "",
                "row-1-col-2" :  "",
                "row-1-col-3" :  "",
                "row-2-col-1" :  "",
                "row-2-col-2" :  "",
                "row-2-col-3" :  "",
                "row-3-col-1" :  "",
                "row-3-col-2" :  "",        
                "row-3-col-3" :  "",
             })
            console.log("Player O reduce Health");
        }
    })
});

const killAction = document.getElementById("killBtn")
killAction.addEventListener("click", function(){
    gameRef.once("value", (snapshot) => {
        gameRef.update({
            playerOHealth: 10,
            playerXHealth: 10,
        })
    })
})