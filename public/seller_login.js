var btnSubmit = document.getElementById("btnSubmit");
var emailId = document.getElementById("txtEmail");
var password = document.getElementById("txtPassword");
var msgHeader = document.getElementById("msgHeader");
var actionMsg = document.getElementById("actionMsg");
var imgHeader = document.getElementById("imgHeader");
var divContent = document.getElementById("divContent");
var imgLoading = document.getElementById("loading");
var divErrorMsg = document.getElementById("divErrorMsg");
var mSeller = null;

var sellerEmail;

divContent.style.display = "none";


var btnForgotPassword = document.getElementById("btnForgotPassword");

//logOut();

btnForgotPassword.addEventListener("click", function () {
    //  alert("clicked");
    console.log(emailId.value);
    if (emailId.value == null || emailId.value == "") {
        setErrorHeader("Please Enter email id");
        return;
    }
    msgHeader.style.display = "none";
    sendPasswordResetEmail();

})

function sendPasswordResetEmail() {
    var auth = firebase.auth();
    var emailAddress = emailId.value;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
        setSuccessHeader("Password reset link has been sent at email address - " + emailId.value)
    }).catch(function (error) {
        setErrorHeader(error);
        // An error happened.
    });
}

function setSuccessHeader(msg) {
    msgHeader.classList.remove("errorBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_ok.png");
    actionMsg.textContent = msg;
    msgHeader.classList.add("successBorder");
}
function setErrorHeader(msg) {

    msgHeader.classList.remove("successBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_error.png");
    actionMsg.textContent = msg;
    msgHeader.classList.add("errorBorder");

}

btnSubmit.addEventListener("click", function () {
    imgLoading.style.display = "block";
    divErrorMsg.style.width = "500px";
    divErrorMsg.style.height = "500px";
    divContent.style.display = "none";


    firebase.auth().signInWithEmailAndPassword(emailId.value, password.value).catch(function (error) {
        imgLoading.style.display = "none";
        divErrorMsg.style.width = "0px";
        divErrorMsg.style.height = "0px";
        divContent.style.display = "block";
        // Handle Errors here.
        var errorCode = error.code;
       
        console.log(error.message);
        setErrorHeader(error.message);
        
        // ...
    });
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        imgLoading.style.display = "none";
        divErrorMsg.style.width = "0px";
        divErrorMsg.style.height = "0px";
        // User is signed in.
        var displayName = user.displayName;
        sellerEmail = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        checkIfUserExist(uid);

        // checkIfUserExist(uid).then(() => {

        //     console.log("control here after checking user details");

        // })
        // ...
    } else {

        imgLoading.style.display = "none";
        divErrorMsg.style.width = "0px";
        divErrorMsg.style.height = "0px";
        divContent.style.display = "block";
        // User is signed out.
        // ...
    }
});



function logOut() {
    firebase.auth().signOut().then(function () {
        window.location.href = "seller_login.html";
    }).catch(function (error) {
        // An error happened.
    });


}

function checkIfUserExist(uid) {

        var docRef = firebase.firestore().collection("seller").doc(uid);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            localStorage.setItem("sellerEmail", sellerEmail);
            mSeller = doc.data();
            console.log("Document exists");
            if(uid == "fZw6rBze8OTr9lTOCYNKdGclKUH2"){
                window.location.href="admin_home.html?sellerid=" + uid;
            }
            else
               if(mSeller.status != "approved"){
                   window.location.href = "seller_approval.html?sellerid=" + mSeller.seller_id + "&merchant_id=" + mSeller.merchant_id
                                                               + "&name=" + mSeller.company_name + "&status=" + mSeller.status
                                                               +"&rejection_reason=" + mSeller.suspension_reason;
               }
               else
                    window.location.href = "home.html?sellerid=" + uid;
            return true;
        } else {
            console.log("No such document!");
            window.location.href = "RegisterUser.html?sellerid=" + uid;
            return false;
            
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
        return false;
    });

    

    // return new Promise((resolve, reject) =>{

    //     console.log("going to check if seller exists");
    //     console.log(uid);
    //     firebase.firestore().collection("seller").where("seller_id", "==", uid)
    //         .get()
    //         .then(function (querySnapshot) {
    //             querySnapshot.forEach(function (doc) {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 console.log('doc found');
    //                 if (doc.exists) {
    //                     var seller = doc.data();

    //                     console.log("seller exists");
    //                     window.location.href = "home.html?sellerid=" + uid;
    //                     resolve();

    //                 } else {
    //                     // doc.data() will be undefined in this case
    //                     //user has been created but he has not filled up registration form. show him registration form
    //                     console.log("user does not exist");
    //                     window.location.href = "RegisterUser.html?sellerid=" + uid;
    //                     resolve();
    //                 }
    //             });
    //         })
    //         .catch(function (error) {
    //             console.log("Error getting documents: ", error);
    //             resolve();
    //         });

    // })
}