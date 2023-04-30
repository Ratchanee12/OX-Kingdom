
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log("UrlParams: ",urlParams.get("roomid"));

const gameRef = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

const boardRef = firebase.database().ref("board");
const btnJoins =  document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoins) => btnJoins.addEventListener("click", joinGame));

var playerturn;

function joinGame(event){
    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user", currentUser);            
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length-1];
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            let tmpID = `user-${player}-id`;
            let tmpEmail= `user-${player}-email`
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            });
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}

// ADD New //
var win = false;

const Elements =  document.querySelectorAll(".table-col");
function getID(event) {
    gameRef.get().then((snapshot) => {
        snapshot.forEach((data) => {
            const gameInfo = data.val();
            let turn = gameInfo["Turn"];
            const Currentemail = firebase.auth().currentUser.email;
            const players = gameInfo[`user-${gameInfo["Turn"]}-email`];
            if ((event.currentTarget.innerText == '' && gameInfo["Winner"] == '' && players == Currentemail)){
                gameRef.child("game-1").update({
                    LastClick: event.currentTarget.id,
                });
                boardRef.child('board-1').update({
                    "row-1-col-1" :  document.querySelector("#row-1-col-1").textContent,
                    "row-1-col-2" :  document.querySelector("#row-1-col-2").textContent,
                    "row-1-col-3" :  document.querySelector("#row-1-col-3").textContent,
                    "row-2-col-1" :  document.querySelector("#row-2-col-1").textContent,
                    "row-2-col-2" :  document.querySelector("#row-2-col-2").textContent,
                    "row-2-col-3" :  document.querySelector("#row-2-col-3").textContent,
                    "row-3-col-1" :  document.querySelector("#row-3-col-1").textContent,
                    "row-3-col-2" :  document.querySelector("#row-3-col-2").textContent,        
                    "row-3-col-3" :  document.querySelector("#row-3-col-3").textContent,
                })
                checkResult();
            }
        });
      }).catch((error) => {
        console.error(error);
    })
}

boardRef.on("value", (snapshot) => {
    snapshot.forEach((data) => {
        const gameInfo = data.val();
        console.log(gameInfo)
        document.querySelector("#row-1-col-1").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-1-col-1"]}</p>`
        document.querySelector("#row-1-col-2").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-1-col-2"]}</p>`
        document.querySelector("#row-1-col-3").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-1-col-3"]}</p>`
        document.querySelector("#row-2-col-1").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-2-col-1"]}</p>`
        document.querySelector("#row-2-col-2").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-2-col-2"]}</p>`
        document.querySelector("#row-2-col-3").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-2-col-3"]}</p>`
        document.querySelector("#row-3-col-1").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-3-col-1"]}</p>`
        document.querySelector("#row-3-col-2").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-3-col-2"]}</p>`
        document.querySelector("#row-3-col-3").innerHTML =  `<p class="display-4 text-center">${gameInfo["row-3-col-3"]}</p>`
    });
})

function checkResult() {
    gameRef.get().then((snapshot) => {
        snapshot.forEach((data) => {
            const gameInfo = data.val();
            let turn = gameInfo["Turn"];
            for(let i = 0;i < 9;i++){
                if((Elements[i].textContent== turn) && (Elements[i+1].textContent== turn) && (Elements[i+2].textContent== turn)){
                    gameRef.child("game-1").update({
                        HaveWinner : true,
                        LastClick: "",
                        Winner: turn,
                    });
                }
                i+=2
            }
            for(let i = 0;i < 3;i++){
                if((Elements[i].textContent== turn) && (Elements[i+3].textContent== turn) && (Elements[i+6].textContent== turn)){
                    gameRef.child("game-1").update({
                        HaveWinner : true,
                        LastClick: "",
                        Winner: turn,
                    });
                }
            }
        
            if((Elements[0].textContent== turn) && (Elements[4].textContent== turn) && (Elements[8].textContent== turn)){
                gameRef.child("game-1").update({
                    HaveWinner : true,
                    LastClick: "",
                    Winner: turn,
                });
            }
            if((Elements[2].textContent== turn) && (Elements[4].textContent== turn) && (Elements[6].textContent== turn)){
                gameRef.child("game-1").update({
                    HaveWinner : true,
                    LastClick: "",
                    Winner: turn,
                });
            }
            if (!win){
                turn = turn === 'o' ? 'x' : 'o';
                console.log(`---------`)
                console.log(`${gameInfo["Winner"]}`)
                gameRef.child("game-1").update({
                    LastClick: "",
                    Turn: turn,
                    CountTurn: gameInfo["CountTurn"] + 1,
                });
            }
        });
      }).catch((error) => {
        console.error(error);
    })
    
}


const btnStartgame = document.querySelector("#btnStartGame");
btnStartgame.addEventListener('click', function(){
    console.log('ST')
    const Currentemail = firebase.auth().currentUser.email
    const playerForm = document.getElementById(`inputPlayer-x`);
    let turn;
    if ( Currentemail == playerForm.value) {
        turn = 'x'
    }else{
        turn = 'o'
    }
    gameRef.child("game-1").update({
        state:"start",
        Turn: turn,
        Winner: ""
    });
})
const btnEndgame = document.querySelector("#btnTerminateGame");
btnEndgame.addEventListener("click", function(){
    gameRef.child("game-1").update({
        state:"end",
        Turn: "",
        LastClick: "",
        CountTurn: 0,
        HaveWinner: false,
        GameEnd : "",
    });
    boardRef.child('board-1').remove()
})
btnStartgame.disabled = true;
btnEndgame.disabled = true;

// ADD New //
function CheckPleyType() {
    if (currentU) {
        const Currentemails = currentU.email
        const playerFormX = document.getElementById(`inputPlayer-x`);
        const playerFormO = document.getElementById(`inputPlayer-o`);
        if ( Currentemails == playerFormX.value) {
            playerturn = 'x'
        }else if( Currentemails == playerFormO.value){
            playerturn = 'o'
        }
    }
}

gameRef.on("value", (snapshot) => {
    CheckPleyType()
    console.log(playerturn)
    getGameInfo(snapshot);
})

function getGameInfo(snapshot) {
    document.getElementById("inputPlayer-x").value = "";
    document.getElementById("inputPlayer-o").value = "";
    snapshot.forEach((data) => {
        const gameInfo = data.val();
        Object.keys(gameInfo).forEach((key) => {
            
            switch (key) {

                // FIX //

                case "user-x-email":
                    document.getElementById("inputPlayer-x").value = gameInfo[key];
                    if (gameInfo[key] != "") {
                        document.querySelector("#btnJoin-x").disabled = true;
                    }else if(gameInfo[key] == ""){
                        document.querySelector("#btnJoin-x").disabled = false;
                    }
                    break;
            
                case "user-o-email":
                    document.getElementById("inputPlayer-o").value = gameInfo[key];
                    if (gameInfo[key] != "") {
                        document.querySelector("#btnJoin-o").disabled = true;
                    }else if(gameInfo[key] == ""){
                        document.querySelector("#btnJoin-o").disabled = false;
                    }
                    break;
        }
                // FIX //

        })
        if (currentU.email == gameInfo["user-x-email"] && document.getElementById("inputPlayer-o").value == "") {
            console.log('playerX')
            document.querySelector("#btnJoin-o").disabled = true;
        }
        if (currentU.email == gameInfo["user-o-email"] && document.getElementById("inputPlayer-x").value == "") {
            console.log('playerO')
            document.querySelector("#btnJoin-x").disabled = true;
        }
        console.log(gameInfo["LastClick"])
        // ADD New //
        if (gameInfo["user-o-email"] != "" && gameInfo["user-x-email"] != "" && gameInfo["state"] == "end") {
            if (currentU.email == gameInfo["user-o-email"] || currentU.email == gameInfo["user-x-email"]) {
                btnStartgame.disabled = false;
            }
            document.getElementById('GameState').innerText = "Click START GAME";
        }else if(gameInfo["user-o-email"] == "" || gameInfo["user-x-email"] == ""){
            btnStartgame.disabled = true;
            document.getElementById('GameState').innerText = "Waiting for player...";
        }
        if (gameInfo["state"] == "start") {
            btnStartgame.disabled = true;
            document.getElementById('GameState').innerText = `Turn: ${gameInfo["Turn"]}`;
            if (gameInfo["LastClick"] != "" ) {
                document.querySelector(`#${gameInfo["LastClick"]}`).textContent = gameInfo["Turn"];
            }
            Elements.forEach((el) => el.addEventListener('click', getID));

            btnCancelJoins.forEach((btnCancel) => btnCancel.disabled = true);
            if (currentU.email == gameInfo["user-o-email"] || currentU.email == gameInfo["user-x-email"]) {
                btnEndgame.disabled = false;
            }
            
            console.log(playerturn)
            if (gameInfo["Winner"] != "") {
                console.log('win')
                win = gameInfo["HaveWinner"];
                document.getElementById('GameState').innerText = `Winner : ${gameInfo["Winner"]}`;
                if (playerturn == gameInfo["Winner"] ) {
                    UpdateUserStatus(gameInfo[`user-${gameInfo["Winner"]}-id`],3);
                }
            } else if(gameInfo["CountTurn"] == 9){
                console.log('draw')
                document.getElementById('GameState').innerText = `GAME DRAW`;
                UpdateUserStatus(gameInfo[`user-${playerturn}-id`], 1);
            }
        }
        else{
            Elements.forEach((el) => el.innerHTML =`<p class="display-4 text-center"></p>`);
            Elements.forEach((el) => el.removeEventListener('click', getID));
            win = gameInfo['HaveWinner']
            btnCancelJoins.forEach((btnCancel) => btnCancel.disabled = false);
            btnEndgame.disabled = true;
        }

        
        // ADD New //
    })
}


const btnCancelJoins = document.querySelectorAll(".btn-cancel-join-game");
btnCancelJoins.forEach((btnCancel) => btnCancel.addEventListener("click", cancelJoin));

function cancelJoin(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Cancel] Current user", currentUser);
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length-1];

        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            let tmpID = `user-${player}-id`;
            let tmpEmail= `user-${player}-email`
            gameRef.child("game-1").update({
                [tmpID]: "",
                [tmpEmail]: ""
            });
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
        playerturn = "";
    }
}
