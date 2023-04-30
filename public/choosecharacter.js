const characterBtn = document.querySelectorAll("#character-button");

const roomRef = firebase.database().ref("RoomList");

const userList = firebase.database().ref("UserList");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get("roomid"));

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
    if (currentWatcher.uid == snapshot.val().UserO || currentWatcher.uid == snapshot.val().UserX){
        if(snapshot.val().UserX !=""){
            if (snapshot.val().UserO != ""){
                userList.child(uiduserO).once("value", userdata => {
                    usernameplayerO = `Player O: ${userdata.val().username}`
                    console.log("Username O: ", userdata.val().username);
                    document.getElementById("Username-PlayerO").innerHTML = usernameplayerO;
                    document.getElementById("currentRoomState").innerHTML = "Both Player present";
                    pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
                    pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
                 }) 
            } else if (snapshot.val().UserO == ""){
                usernamePlayerO = "Waiting...";
                document.getElementById("Username-PlayerO").innerHTML = usernameplayerO;
                document.getElementById("currentRoomState").innerHTML = "Waiting for Player O";
                    pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
                    pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
            } 
        }
        if(snapshot.val().UserO !=""){
                if (snapshot.val().UserX != ""){
                    userList.child(uiduserX).once("value", userdata => {
                        usernameplayerX = `Player X: ${userdata.val().username}`
                        document.getElementById("Username-PlayerX").innerHTML = usernameplayerX;
                        document.getElementById("currentRoomState").innerHTML = "Both Player present";
                        pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
                        pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
                     }) 
                } else if (snapshot.val().UserX == ""){
                    usernamePlayerX = "Waiting...";
                    document.getElementById("Username-PlayerX").innerHTML = usernameplayerX;
                    document.getElementById("currentRoomState").innerHTML = "Waiting for Player X";
                    pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
                    pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
                }
                pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
                pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
        }
             pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
             pictureCharacterX.innerHTML = `${snapshot.val().CharacterX}`
        if(snapshot.val().CharacterO != "" && snapshot.val().characterX){
            checkReady();
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
    var playerReady=false;
    console.log("Player Ready")
    roomData.once("value", (snapshot) => {
        if (snapshot.val().CharacterO != "" && snapshot.val().CharacterX != ""){
            playerReady = true
            //window.location = "Tictacttoe.html";
        }
    });
}