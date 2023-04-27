const CurrentUsername = localStorage.getItem("current-user");

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User :", user);
        getList(user);
    } setupUI(user);
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

let setupUI = (user) =>{
    if (user){
        const ScoreXORef = firebase.database().ref("ScoreXO");
        ScoreXORef.on("value", (snapshot) => {
            Checkdata(snapshot);
        })
        loginItems.forEach((item) => (item.style.display = "inline-block", item.style = "justify-content-center"));
        logoutItems.forEach((item) => (item.style.display = "none"));
        gameRef.child("game-1").update({
            ["Login"]: true
        });
        gameRef.child("game-1").child("Login").remove();
        
  } else{
        loginItems.forEach((item) => (item.style.display = "none"));
        logoutItems.forEach((item) => (item.style.display = "inline-block"));
  }
}
// สร้าง ScoreXO ใน Firebase เพื่อเก็บคะแนนแต่ละ user
function Checkdata(snapshot){
    const ScoreXORef = firebase.database().ref("ScoreXO");
    const currentUser = firebase.auth().currentUser;
    const UserUid = currentUser.uid;
    var ishave = false;
    
    snapshot.forEach((data) => {
        var ScoreRef = data.val();
        ScoreData = ScoreRef;
        Object.keys(ScoreRef).forEach((key) => {
            if(key == currentUser.uid){
                ishave = true;
            }
            
        })
        
      })

      if(ishave == false){
        // กำหนดคะแนนเริ่มที่ 0
        ScoreXORef.child("uid").child(UserUid).update({
            "Score": 0,
        });
        ishave = true;
    }
    console.log(ScoreData[currentUser.uid]["Score"]);
    document.querySelector("#user-profile-name").innerHTML = `${currentUser.email} (${ScoreData[currentUser.uid]["Score"]})`;
    // if(ScoreXORef.child(UserUid) == undefined){
    //     ScoreXORef.child(UserUid).push({
    //         "Score": 0,
    //     });
    // }
    // console.log(ScoreXORef.child(UserUid));
}