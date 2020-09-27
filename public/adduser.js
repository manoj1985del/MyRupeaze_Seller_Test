var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var txtConfimrPassword = document.getElementById("txtConfirmPassword");
var btnSubmit = document.getElementById("btnSubmit");

btnSubmit.addEventListener("click", registerUser);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        localStorage.setItem("sellerEmail", email);
        window.location.href = "RegisterUser.html?sellerid=" + uid;

        // ...
    } else {
        // User is signed out.
        // ...
    }
});


function registerUser(){
    var password = txtPassword.value;
    var confirmPassword = txtConfimrPassword.value;
    var len = password.length;
    if(len < 8){
        alert("Password has to be minimum 8 characters long");
        return;
    }
    if(len > 20){
        alert("Password cannot be more than 20 characters");
        return;
    }

    if(password != confirmPassword){
        alert("Passwords do not match. Please reenter confirm password");
        txtConfimrPassword.focus();
        return;
    }

    var email = txtEmail.value;

    addUserToFirebase(email, password);
   
}

function addUserToFirebase(email, password){


    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        alert(error.message);
        return false;
        // ...
      });

      
      return true;

}