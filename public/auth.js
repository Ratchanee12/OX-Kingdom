const signupForm = document.querySelector("#signup-f");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));

function createUser(event) {
    event.preventDefault();
    const email = signupForm["email-signup"].value;
    const password = signupForm["password-signup"].value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            signupFeedback.style = "color: green";
            signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Signup Completed.";
            setTimeout(() => {
                signupFeedback.innerHTML = "";
                signupModal.hide();
                
            }, 1000)
            var user = userCredential.user;
            console.log(user);
            addList(user.uid)
            signupForm.reset();
        })
        .catch((error) => {
            signupFeedback.style = "color: crimson";
            signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
            signupForm.reset();
        })
}

let addList = (uid) =>{
    let username = signupForm["username-signup"].value;
    console.log("1 Username: ", username);
    let currentUser = firebase.auth().currentUser;
    // userListRef.child(currentUser.uid).update({
    userListRef.child(uid).update({
        username: username,
        email: currentUser.email,
        score: 0,
        gamewin: 0,
        numberofgame: 0,
        coin: 0,
    })
    
    console.log("2 Username: ", username);
    console.log("username pushed");
}

const btnCancels = document.querySelectorAll(".btn-cancel");
btnCancels.forEach((btn) => {
    btn.addEventListener("click", () => {
        signupForm.reset();
        signupFeedback.innerHTML = "";
        loginForm.reset();
        loginFeedback.innerHTML = "";
    })

});

const loginForm = document.querySelector("#login-f");
loginForm.addEventListener("submit", loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm["email-login"].value;
    const password = loginForm["password-login"].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            const user = firebase.auth().currentUser.uid;

            loginFeedback.style = "color: green";
            loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> login succeed!.";
            // set new page
            localStorage.setItem("current-user",user);
            console.log(user);

            setTimeout(() => {
                loginFeedback.innerHTML = "";
                loginModal.hide();
                window.location.assign("UserPage.html");
                
            }, 1000)
            loginForm.reset();
            
        })
        .catch((error) => {
            loginFeedback.style = "color: crimson";
            loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
            loginForm.reset();
        })

}
