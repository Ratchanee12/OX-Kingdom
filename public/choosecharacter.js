const characterBtn = document.querySelectorAll("#character-button");

const roomRef = firebase.database().ref("RoomList");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get("roomid"));

const roomData = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

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
        } else if(chooser.uid == snapshot.val().UserX){
            roomData.update({
                CharacterX: character,
            })
        }
    });
}

roomData.on("value", (snapshot) => {
    console.log("load data complete")
    let currentWatcher = firebase.auth().currentUser;
    document.getElementById("roomName").innerHTML = snapshot.val().LobbyName;
    if (currentWatcher.uid == snapshot.val().UserO || currentWatcher.uid == snapshot.val().UserX){

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
                })
            }
        }
    });
    
}