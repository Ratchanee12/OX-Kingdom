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
