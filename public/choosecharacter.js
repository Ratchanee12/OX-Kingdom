let timeHTML = document.getElementById("countdownChar");

const characterBtn = document.querySelectorAll("#character-button");

const roomRef = firebase.database().ref("RoomList");

const userList = firebase.database().ref("UserList");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log("UrlParams: ",urlParams.get("roomid"));

const roomData = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

let pictureCharacterO = document.getElementById("PlayercharacterO");

let pictureCharacterX = document.getElementById("PlayercharacterX");

let usernamePlayerO = document.getElementById("Username-PlayerO");

let usernamePlayerX = document.getElementById("Username-PlayerX");


characterBtn.forEach(el => {
    console.log(el.dataset.character);
    let character = el.dataset.character;
    el.addEventListener("click", () => {
        chooseCharacter(character);
    });
});

function chooseCharacter(character){
    console.log("choosen character",character);
    var chooser = firebase.auth().currentUser;
    console.log("infunction: ",chooser);
    roomData.once("value", (snapshot)=>{
        if(chooser.uid == snapshot.val().UserO){
            roomData.update({
                CharacterO: character,
            })
            if(snapshot.val().CharacterO == "Knight"){
                pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
            } else if (snapshot.val().CharacterO == "Mage"){
                pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
            }
               
        } else if(chooser.uid == snapshot.val().UserX){
            roomData.update({
                CharacterX: character,
            })
            if(snapshot.val().CharacterX == "Knight"){
                pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
            } else if (snapshot.val().CharacterX == "Mage"){
                pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
            }
        }
    });
}

roomData.on("value", (snapshot) => {
    console.log("load data complete")
    let currentWatcher = firebase.auth().currentUser;
    let uiduserO = snapshot.val().UserO;
    let uiduserX = snapshot.val().UserX;
    let usernameplayerO ;
    let usernameplayerX ;
    console.log("UidofUserO: ", uiduserO);
    console.log("UidofUserX: ", uiduserX);
    console.log("CurrentWatcher: ", currentWatcher.uid)
    document.getElementById("roomName").innerHTML = snapshot.val().LobbyName;
    if(snapshot.val().CharacterO == "" || snapshot.val().CharacterO == undefined){
        pictureCharacterO.innerHTML = `Waiting..`
    }else{
        pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
    }
    if(snapshot.val().CharacterX == "" || snapshot.val().CharacterX == undefined){
        pictureCharacterX.innerHTML = `Waiting..`
    }else{
        pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
    }
    if (currentWatcher.uid == snapshot.val().UserO || currentWatcher.uid == snapshot.val().UserX){
        if(uiduserO !=""){
            console.log(uiduserX.username)
                if (uiduserX != ""){
                    userList.child(uiduserX).once("value", userdata => {
                        usernameplayerX = `Player X: ${userdata.val().username}`;
                        document.getElementById("Username-PlayerX").innerHTML = usernameplayerX;
                        document.getElementById("currentRoomState").innerHTML = "Both Player present";
                     }); 
                } 
                else if (uiduserX == ""){
                    console.log("Missing PlayerX");
                    userList.child(uiduserO).once("value", userdata => {
                        usernameplayerO = `Player O: ${userdata.val().username}`;
                        console.log("Username O: ", userdata.val().username);
                        document.getElementById("Username-PlayerO").innerHTML = usernameplayerO;
                        });
                    document.getElementById("Username-PlayerX").innerHTML = "Player X: Waiting...";
                    document.getElementById("currentRoomState").innerHTML = "Waiting for Player X";
                }
        }

        if(uiduserX !=""){
            if (uiduserO != ""){
                userList.child(uiduserO).once("value", userdata => {
                    usernameplayerO = `Player O: ${userdata.val().username}`;
                    console.log("Username O: ", userdata.val().username);
                    document.getElementById("Username-PlayerO").innerHTML = usernameplayerO;
                    document.getElementById("Username-PlayerX").innerHTML = usernameplayerX;
                    document.getElementById("currentRoomState").innerHTML = "Both Player present";
                 }) 
            }else if (uiduserO == ""){
                console.log("Missing PlayerO");
                userList.child(uiduserX).once("value", userdata => {
                    usernameplayerX = `Player X: ${userdata.val().username}`;
                    console.log("Username X: ", userdata.val().username);
                    document.getElementById("Username-PlayerX").innerHTML = usernameplayerX;
                    });
                document.getElementById("Username-PlayerO").innerHTML = "Player O: Waiting...";
                document.getElementById("currentRoomState").innerHTML = "Waiting for Player O";
            } 
        }
        
        console.log("snapshot",snapshot.val());
        console.log(snapshot.val().CharacterO);
        console.log(snapshot.val().CharacterX);
        //check if both player choose a character if yes thats mean they are ready
        if(snapshot.val().CharacterX && snapshot.val().CharacterO){
            if (snapshot.val().CharacterO != "" && snapshot.val().CharacterX != ""){
                //begin Count Down
                clearInterval(cd);
                cd = setInterval(countdowns,1000);
            } 
            if(snapshot.val().CharacterO == "" || snapshot.val().CharacterX == ""){
                timeHTML.innerHTML = "Time";
                clearInterval(cd);
            }
        }
        
    }else{
        window.location= "Lobby.html";
    }
});

const returnBtn = document.querySelector("#returnicon");
returnBtn.addEventListener("click", () => {
    console.log("button clicked");
    returntoLobby();
})

function returntoLobby(){
    console.log("returntoLobby Called")
    let clickeruid = firebase.auth().currentUser.uid;
    console.log("clickerUid: ",clickeruid);
    roomData.once("value", (snapshot) =>{
        if(clickeruid == snapshot.val().UserO){
            if(snapshot.val().UserX == ""){
                roomRef.child(snapshot.key).remove();
                console.log("Room Destroyed")
                window.location= "Lobby.html";
            }else{
                console.log("UserO removed")
                roomData.update({
                    UserO: "",
                    CharacterO: "",
                })
            }
        } else if (clickeruid == snapshot.val().UserX){
            
            if(snapshot.val().UserO == ""){
                roomRef.child(snapshot.key).remove();
                console.log("Room Destroyed")
                window.location= "Lobby.html";
            }else{
                console.log("UserX removed")
                roomData.update({
                    UserX: "",
                    CharacterX: "",
                })
            }
        }
    });
}

function checkReady(){
    var playerReady = false;
    console.log("Check Player Ready")
    roomData.once("value", (snapshot) => {
        if (snapshot.val().CharacterO != "" && snapshot.val().CharacterX != ""){
            playerReady = true;
            console.log("Both Player Ready");
           // window.location = `Tictactoe.html?roomid=${getRoom}`;
        }
    });
}

var times = 10;
var cd;

function countdowns () {
    console.log(times)
    console.log('add')
    timeHTML.innerHTML = `<h1 style = " text-align: center;">${times}</h1>`
    times -= 1;
    if (times < 0) {
        clearInterval(cd);
        console.log('Change HTML Page')
        window.location = `NewTictac.html?roomid=${urlParams.get("roomid")}`;
    }
}