
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
var oppositegameWinner;

gameRef.once("value", (snapshot) => {
    gameWinner = snapshot.val().Winner;
    oppositegameWinner = gameWinner == 'O' ? 'X' : 'O';
    console.log(snapshot.val().Winner)
    console.log("Game Winner: ",snapshot.val()[`User${snapshot.val().Winner}`])
    console.log("Opposite Game Winner: ",snapshot.val()[`User${oppositegameWinner}`])
    userList.child(snapshot.val()[`User${oppositegameWinner}`]).once("value", (data) =>{
        console.log("Loser: ",data.val().username)
        console.log("Game Win: ", data.val().gamewin)
        console.log("Number of Game: ", data.val().numberofgame)
        console.log("Coin: ", data.val().coin)
        var addnumberofgame = parseInt(data.val().numberofgame) + 1;
        var updatecoin = (data.val().coin) + 50;
        userList.child(snapshot.val()[`User${oppositegameWinner}`]).update({
            numberofgame: addnumberofgame,
            coin: updatecoin,
        })
        var username = `${data.val().username}`
        var coindisplay = "+50"
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
    console.log("Loser Clicked!");
    gameRef.once("value",(snapshot) =>{
        gameWinner = snapshot.val().Winner;
        oppositegameWinner = gameWinner == 'O' ? 'X' : 'O';
        const currentUser = firebase.auth().currentUser.uid
        const checkPlayer = snapshot.val()[`User${oppositegameWinner}`]
            gameRef.update({
                Turn:"O",
                Winner:"",
                state:"reset",
                playerOHealth:100,
                playerXHealth:100,
                CharacterX: "",
                CharacterO: "",
            })
        setTimeout(() =>{
            window.location = `choosecharacter.html?roomid=${urlParams.get("roomid")}`;
        }, 1000)
    })
});

const leaveBtn = document.getElementById("leaveBtn")
leaveBtn.addEventListener("click", function(){
    gameRef.once("value",(snapshot) =>{
        gameWinner = snapshot.val().Winner;
        oppositegameWinner = gameWinner == 'O' ? 'X' : 'O';
        const currentUser = firebase.auth().currentUser.uid
        const checkPlayer = snapshot.val()[`User${oppositegameWinner}`]
        if(currentUser == checkPlayer){
            window.location ="Lobby.html"
            console.log("Delete Player")
            console.log([`User${oppositegameWinner}`])
            gameRef.update({
                [`User${oppositegameWinner}`]: "", 
            })
        }
    })
});