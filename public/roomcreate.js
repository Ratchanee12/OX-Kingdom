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
    })
    console.log("Room Create: ", roomInput.value);
    window.location = `Tictactoe.html?roomid=${ROOM_ID}`;
}

function readRoomList(currentList){
    showRoom.innerHTML="";
    //assign Snapshot
    currentList.forEach(data => {
        console.log(data.val())
        const roomArray = data.val();
        //get different data form different table
        userList.child(data.val().UserO).once("value", userdata => {
            const creatorUsername = userdata.val().username;
            console.log(creatorUsername);
            let newRoom= `<div id="room1">
                    <p id="nameR1">${roomArray.LobbyName} : ${creatorUsername} </p>
                    <button id="${data.key}" class="btn join-roomBtn">JOIN</button>
                  </div>`;
            showRoom.innerHTML += newRoom;
        }) 
        
    });
    const joinRoomBtn = document.querySelectorAll(".join-roomBtn");
    joinRoomBtn.forEach( button =>{
        console.log("button: ",button);
        button.addEventListener("click", JoinRoom);
    })
    
    
}

roomRef.on("value", (snapshot) => {
    readRoomList(snapshot);
    console.log(snapshot.val());
});

function JoinRoom(event){
    var canJoin = false;
    const getRoom = event.currentTarget.id;
    const currentClicker = firebase.auth().currentUser;
    console.log("button id: ", getRoom);
    roomRef.child(getRoom).once("value", (snapshot) =>{
        console.log(snapshot.val());
        const roomData = snapshot.val();
        if (roomData.UserO != "" ){
            roomRef.child(getRoom).update({
                UserX : currentClicker.uid,
            })
            canJoin = true;
        } else if(roomData.UserX != "") {
            roomRef.child(getRoom).update({
                UserO : currentClicker.uid,
            })
            canJoin = true;
        }
        if(canJoin == true){
            //window.location = "Tictactoe.html";
            window.location = `Tictactoe.html?roomid=${getRoom}`;
        }
    });   
}

