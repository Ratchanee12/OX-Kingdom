
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log("UrlParams: ",urlParams.get("roomid"));

const gameRef = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

const roomUid = `${urlParams.get("roomid")}`;

const userList = firebase.database().ref("UserList");


const roomRef = firebase.database().ref("RoomList");


const winnerdisplay = document.getElementById("winner");

const coinamount = document.getElementById("coinamount");

const displaygameTotal = document.getElementById("gameTotal");

const displaygameWin = document.getElementById("gameWin");

var gameWinner;

gameRef.on("value", (snapshot) => {
    gameWinner = snapshot.val().Winner;
    console.log(snapshot.val().Winner)
    console.log(snapshot.val()[`User${gameWinner}`])
    
    userList.child(snapshot.val()[`User${gameWinner}`]).once("value", (data) =>{
        console.log("Winner: ",data.val().username)
        console.log("Game Win: ", data.val().gamewin)
        console.log("Number of Game: ", data.val().numberofgame)
        console.log("Coin: ", data.val().coin)
        var addnumberofgame = parseInt(data.val().numberofgame) + 1;
        var updategamewin = parseInt(data.val().gamewin) + 1;
        var updatecoin = (data.val().coin) + 150;
        userList.child(snapshot.val()[`User${gameWinner}`]).update({
            numberofgame: addnumberofgame,
            gamewin: updategamewin,
            coin: updatecoin,
        })
        var username = `${data.val().username}`
        var coindisplay = `${data.val().coin}`
        var gameWinvalue = `${data.val().gamewin}`
        var gameTotalvalue = `${data.val().numberofgame}`
        winnerdisplay.innerHTML = username;
        coinamount.innerHTML = coindisplay;
        displaygameTotal.innerHTML = gameTotalvalue;
        displaygameWin.innerHTML = gameWinvalue;
    })
});

const playAgain = document.getElementById("playagainBtn")
playAgain.addEventListener("click", function(){
    gameRef.once("value",(snapshot) =>{
        const currentUser = firebase.auth().currentUser.uid
        const checkPlayer = snapshot.val()[`User${snapshot.val().Winner}`]
        if(currentUser == checkPlayer){
            gameRef.update({
                Turn:"O",
                Winner:"",
                state:"",
                playerOHealth:100,
                playerXHealth:100,
                [`Character${snapshot.val().Winner}`]: "",
            })
            window.location = `choosecharacter.html?roomid=${urlParams.get("roomid")}`;
        }
    })
});

const leaveBtn = document.getElementById("leaveBtn")
leaveBtn.addEventListener("click", function(){
    gameRef.once("value",(snapshot) =>{
        const currentUser = firebase.auth().currentUser.uid
        const checkPlayer = snapshot.val()[`User${snapshot.val().Winner}`]
        if(currentUser == checkPlayer){
            console.log("Delete Player")
            console.log([`User${snapshot.val().Winner}`])
            gameRef.update({
                [`User${snapshot.val().Winner}`]: "", 
            })
            window.location ="Lobby.html"
        }
    })
});