const characterBtn = document.querySelectorAll("#character-button");

const roomRef = firebase.database().ref("RoomList");

const userList = firebase.database().ref("UserList");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get("roomid"));

const roomData = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

let pictureCharacterO = document.getElementById("PlayercharacterO");

let pictureCharacterX = document.getElementById("PlayercharacterX");

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
                pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
            } else if (snapshot.val().CharacterX == "Mage"){
                pictureCharacterO.innerHTML = `${snapshot.val().CharacterO}`
            }
        }
    });
}

roomData.on("value", (snapshot) => {
    console.log("load data complete")
    let currentWatcher = firebase.auth().currentUser;
    let uiduserO = snapshot.val().UserO;
    let uiduserX = snapshot.val().UserX;
    let usernameplayerO = "";
    let usernameplayerX = "";
    console.log("UidofUserO: ", uiduserO);
    console.log("UidofUserX: ", uiduserX);
    console.log("CurrentWatcher: ", currentWatcher.uid)
    document.getElementById("roomName").innerHTML = snapshot.val().LobbyName;
    if (currentWatcher.uid == snapshot.val().UserO || currentWatcher.uid == snapshot.val().UserX){
        // if(currentWatcher.uid == uiduserO){
        //     userList.child(uiduserO).once("value", userdata => {
        //         document.getElementById("Username-PlayerO").innerHTML = `Player O: ${userdata.val().username}`;
        //     }) 
        // }else if(currentWatcher.uid == uiduserX){
        //         userList.child(uiduserX).once("value", userdata => {
        //             document.getElementById("Username-PlayerX").innerHTML = `Player X: ${userdata.val().username}`;
        //         })
        // }

        if(currentWatcher.uid == uiduserO){
            userList.child(uiduserO).once("value", userdata => {
                console.log(userdata.val().username);
                usernameplayerO = userdata.val().username;
            }) 
        }else if(currentWatcher.uid == uiduserX){
            userList.child(uiduserX).once("value", userdata => {
                usernameplayerX = userdata.val().username;
            })
        }
        document.querySelector("Username-PlayerO").innerHTML = `Player O: ${usernameplayerO}`;
        document.querySelector("Username-PlayerX").innerHTML = `Player X: ${usernameplayerX}`; 


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
    roomData.once("value", (snapshot) => {
        if (snapshot.val().CharacterO != "" && snapshot.val().CharacterX != ""){
            playerReady = true
            //window.location = "Tictacttoe.html";
        }
    });
}