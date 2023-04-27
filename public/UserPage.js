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
    setupUI(user);
});

const btnCancels = document.querySelectorAll(".btn-cancel");
btnCancels.forEach((btn) => {
    btn.addEventListener("click", () => {
        signupForm.reset();
        signupFeedback.innerHTML = "";
        loginForm.reset();
        loginFeedback.innerHTML = "";
    })

});

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", function () {
    firebase.auth().signOut();
    console.log("Logout completed.")
    window.location.assign("index.html");
})


let readList = (snapshot) => {
    document.getElementById("main-content").innerHTML = "";

    // const currentUser = firebase.auth().currentUser;
    // userListRef.child(currentUser.uid).once("value").then((snapshot) => {
        snapshot.forEach((data) =>{
            var id = data.key;
            var title = data.val().title;
            const newDiv = `
                <div class="form-check d-flex justify-content-between">
                    <label class="form-check-label">${title}</label>
                    <span>
                        <button type="submit" class="btn btn-outline-danger btn-delete" data-id="${id}" onclick="">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </span>
                </div>`
            ;
            const newElement = document.createRange().createContextualFragment(newDiv);
            document.getElementById("main-content").appendChild(newElement);
        });
            document.querySelectorAll('button.btn-delete').forEach((btn) => {
                btn.addEventListener('click', deleteList);
            });
        // });
    };

// Setup UI
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

// สร้าง ScoreXO ใน Firebase เพื่อเก็บคะแนนแต่ละ user
function Checkdata(snapshot){
    const ScoreXORef = firebase.database().ref("UserList");
    const CurrentUser = firebase.auth().currentUser;
    const UserUid = CurrentUser.uid;
    // var usersName = "";
    snapshot.forEach((data) => {
        var ScoreRef = data.val();
        console.log(ScoreRef);
        usersName = data.val().username;
        ScoreData = ScoreRef;
      })
    console.log(ScoreData[CurrentUser.uid]["score"]);
    console.log("Username: ", usersName);
    document.querySelector("#user-profile-name").innerHTML = `${CurrentUser.usersName} (${ScoreData[CurrentUser.uid]["score"]})`;
}


let getList = (user) => {
    if (user) {
        userListRef.child(user.uid).on("value", (snapshot) => {
            // readList();
            console.log(snapshot.val());
        });
    }
}

