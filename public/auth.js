const signupForm = document.querySelector("#signup-f");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));

function createUser(event) {
    event.preventDefault();
    const email = signupForm["email-signup"].value;
    const password = signupForm["password-signup"].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            signupFeedback.style = "color: green";
            signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Signup Completed.";
            setTimeout(() => {
                signupFeedback.innerHTML = "";
                signupModal.hide();
                
            }, 1000)
            signupForm.reset();
        })
        .catch((error) => {
            signupFeedback.style = "color: crimson";
            signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`
            signupForm.reset();
        })

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

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User :", user);
        console.log("User email:", user.email)
        getList(user);
    } setupUI(user);
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