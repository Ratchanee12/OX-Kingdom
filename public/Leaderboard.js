let leaderboard = () => {

    var ref = firebase.database().ref("UserList")

    ref.once("value").then((snapshot) => {
        snapshot.forEach((data) =>{
            var id = data.key;
            let username = snapshot.child(id).val().username;
            let gameWin = snapshot.child(id).val().gamewin;            
            console.log(username)
            console.log(gameWin)
            const newDiv = `
            <div id="UsernameBoard">
                <p id="user-profile-name">${username} |</p>
                <p id="user-win">${gameWin}</p>
            </div>
            `
            const newElement = document.createRange().createContextualFragment(newDiv);
            document.getElementById("UsernameBoard").appendChild(newElement)
        });
    })
};
window.onload = leaderboard;

function getTopScores(callback) {
    // Get a new reference to the database
    var ref = database.ref("scores");
      
    // Query the top 10 scores
    ref.orderByChild("score").limitToLast(10).once("value", function(snapshot) {
        // Convert the snapshot to an array of scores
        var scores = [];
        snapshot.forEach(function(childSnapshot) {
        var score = childSnapshot.val();
        score.key = childSnapshot.key;
        scores.push(score);
    });
      
    // Call the callback function with the scores
        callback(scores);
    });
}

// let getList = (user) => {
//     if (user) {
//         userListRef.child(user.uid).on("value", (snapshot) => {
//             // readList();
//             console.log(userListRef);
//             console.log(snapshot.val());
//             console.log("Username: ",snapshot.val().username);
//             let currentUsername = snapshot.val().username;
//             let currentWin = snapshot.val().gamewin;
//             document.querySelector("#user-profile-name").innerText = `${currentUsername}`
//             document.querySelector("#user-win").innerText = `${currentWin}`
//         });
//     }   
// } 
