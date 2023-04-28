const currentUsername = localStorage.getItem("current-user");
var ref = firebase.database().ref("MyList");
const userListRef = firebase.database().ref("UserList")

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User :", user);
        // console.log("User email:", user.email);
        getList(user);
    } else {
        console.log("User not found");
    }
});

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", function () {
    firebase.auth().signOut();
    console.log("Logout completed.")
    window.location.assign("index.html");
})

// Setup UI
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

let getList = (user) => {
    if (user) {
        userListRef.child(user.uid).on("value", (snapshot) => {
            // readList();
            console.log(snapshot.val());
            console.log("Username: ",snapshot.val().username);
            let currentUsername = snapshot.val().username;
            let currentScore = snapshot.val().score;
            let currentCoin = snapshot.val().coin;
            document.querySelector("#user-profile-name").innerText = `${currentUsername} (${currentScore})`
        });
    }   
} 

