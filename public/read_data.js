
let deleteList = (event) => {
    const id = event.currentTarget.getAttribute('data-id');
    const currentUser = firebase.auth().currentUser;
    userListRef.child(currentUser.uid).child(id).remove();
    console.log(`delete on id:${id}`);
}

