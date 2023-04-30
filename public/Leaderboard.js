let leaderboard = () => {

    var ref = firebase.database().ref("UserList")

    ref.orderByChild("gamewin").limitToLast(10).once("value").then((snapshot) => {
        snapshot.forEach((data) =>{
            var id = data.key;
            let username = snapshot.child(id).val().username;
            let gameWin = snapshot.child(id).val().gamewin;            
            console.log(username);
            console.log(gameWin);
            const newDiv = `
            <div class="row">
                <h5 class="rank d-flex justify-content-center col-4" id="rank"></h5>
                <h5 class="name d-flex justify-content-center col-4" id="username">${username}</h5>
                <h5 class="gamewin d-flex justify-content-center col-4" id="gamewin">${gameWin}</h5>
            </div>
            `
            const newElement = document.createRange().createContextualFragment(newDiv);
            document.getElementById("ShowScore").appendChild(newElement)
        });
    var rank = document.getElementsByClassName("rank");
    console.log(rank)
    var num = 10;
    for (let i=0; i < rank.length; i++) {
        if (i){
            console.log(rank[i]);
            rank[i].textContent = num;
            num--
            console.log(num);
        }
    }
    })
};
window.onload = leaderboard;
