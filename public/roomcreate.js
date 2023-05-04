const roomInput = document.getElementById("lobby");
const createRoomBtn = document.getElementById("roomCreateBtn");
createRoomBtn.addEventListener("click", createRoom);

const showRoom = document.getElementById("room");

const roomRef = firebase.database().ref("RoomList");

const userList = firebase.database().ref("UserList");

function createRoom(event){
    const creator = firebase.auth().currentUser;
    roomRef.push({
        LobbyName: roomInput.value,
        UserO: creator.uid,
        UserX: "",
    }).then( (snapshot) => {
        console.log(snapshot.key)
        window.location = `choosecharacter.html?roomid=${snapshot.key}`;
    });
}

function readRoomList(currentList){
    showRoom.innerHTML="";
    currentList.forEach(data => {
        console.log(data.val())
        const roomArray = data.val();
        let userCreator;
        if (roomArray.UserO != "" || roomArray.UserX != ""){
            if (roomArray.UserO != ""){
                userCreator = roomArray.UserO;
            } else {
                userCreator = roomArray.UserX;
            }
            userList.child(userCreator).once("value", userdata => {
                const creatorUsername = userdata.val().username;
                console.log(creatorUsername);
                let newRoom= `<div id="room1">
                        <p id="nameR1">${roomArray.LobbyName} : ${creatorUsername} </p>
                        <button id="${data.key}" class="btn join-roomBtn" onclick="JoinRoom(this)">JOIN</button>
                      </div>`;
                showRoom.innerHTML += newRoom;
            }) 
        }
    });
}

roomRef.on("value", (snapshot) => {
    readRoomList(snapshot);
    console.log(snapshot.val());
});

function JoinRoom(element){
    console.log(element);
    var canJoin = false;
    const getRoom = element.id;
    console.log(getRoom)
    const currentClicker = firebase.auth().currentUser;
    console.log("button id: ", getRoom);
    roomRef.child(getRoom).once("value", (snapshot) =>{
        console.log(snapshot.val());
        const roomData = snapshot.val();
        if (roomData.UserO != "" ){
            console.log("add UserX");
            roomRef.child(getRoom).update({
                UserX : currentClicker.uid,
            })
            canJoin = true;
        } else if(roomData.UserX != "") {
            console.log("add UserO");
            roomRef.child(getRoom).update({
                UserO : currentClicker.uid,
            })
            canJoin = true;
        }
        if(canJoin == true){
            window.location = `choosecharacter.html?roomid=${getRoom}`;
        }
        if(currentClicker.uid == roomData.UserO || currentClicker.uid == roomData.UserX){
            window.location = `choosecharacter.html?roomid=${getRoom}`;
        }
    });
}

