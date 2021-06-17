var txtEmail = document.getElementById("txtEmail");
var txtPassword = document.getElementById("txtPassword");
var txtConfimrPassword = document.getElementById("txtConfirmPassword");
var btnSubmit = document.getElementById("btnSubmit");
var userType = document.getElementById("user_type");
var selectedUserType = null;

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

        selectedUserType =  userType.value;
        localStorage.setItem("sellerEmail", email);
        if(selectedUserType == "seller"){
            window.location.href = "RegisterUser.html?sellerid=" + uid;
        }
        else if(selectedUserType == "doctor"){
            window.location.href = "registerDoctor.html?sellerid=" + uid;
            console.log("doctor registration");
        }
        else if(selectedUserType == "pharmacist"){
            console.log("inside pharmacist user");
            window.location.href = "registerPharmacist.html?sellerid=" + uid;
            console.log("pharmacist registration");
        }
       
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