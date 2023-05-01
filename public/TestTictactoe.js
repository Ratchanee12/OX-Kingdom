const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log("UrlParams: ",urlParams.get("roomid"));

const gameRef = firebase.database().ref(`RoomList/${urlParams.get("roomid")}`);

const Gameuid = `${urlParams.get("roomID")}`;

const userList = firebase.database().ref("UserList");

const boardRef = firebase.database().ref(`xoGame/${urlParams.get("roomid")}`);
const btnJoins =  document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoins) => btnJoins.addEventListener("click", joinGame));

var playerturn;
var currentUser;

// ADD New //
var win = false;

const Elements =  document.querySelectorAll(".table-col");
Elements.forEach((el) => el.addEventListener("click", SendToxoGame));
function SendToxoGame(ev) {
    gameRef.once('value', snapshot => {
        var gameInfo = snapshot.val();
        if ((ev.currentTarget.innerText == "" && gameInfo['Winner'] == "")){
            console.log(ev.currentTarget.id)
            ev.currentTarget.textContent = gameInfo['Turn']
            boardRef.update({
                [`${ev.currentTarget.id}`] : gameInfo['Turn']
            });
            gameRef.update({
                state: 'check',
            })
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
            Object.keys(GameInfo).forEach((key) => {
                switch (key) {
                    case "UserX":
                        if (GameInfo[`${key}`] != '') {
                            userList.child(`${GameInfo[`${key}`]}`).once('value',(usersnapshot) =>{
                                let UserInfo = usersnapshot.val()
                                console.log(UserInfo.username)
                                document.querySelector('#PlayerX').textContent = UserInfo.username
                            })
                        }
                        break;
                    case "UserO":
                        if (GameInfo[`${key}`] != '') {
                            userList.child(`${GameInfo[`${key}`]}`).once('value',(usersnapshot) =>{
                                let UserInfo = usersnapshot.val()
                                console.log(UserInfo.username)
                                document.querySelector('#PlayerO').textContent = UserInfo.username
                            })
                        }
                        break;
                }
            })
            if (GameInfo['state'] == 'check') {
                //ให้ Check อะไรก้ใส่ตรงนี้
            }
        });
    },100);
}

gameRef.on("value", (snapshot) =>{
    GameUpdate(snapshot)
});

boardRef.on('value', (snapshot) =>{
    boardRef.once('value', (snapshot) => {
        var boardInfo = snapshot.val();
        Elements.forEach((el) =>{
            var eid = el.id
            console.log(eid)
            el.textContent = boardInfo[`${eid}`]
        });
    })
});