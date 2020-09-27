

var txtURL = document.getElementById("txtURL");
var txtTitle = document.getElementById("txtTitle");
var txtEmbedCode = document.getElementById("txtEmbedCode");
var cmbAvailableFor = document.getElementById("cmbAvailableFor");
var btnSubmit = document.getElementById("btnSubmit");
var imgProgress = document.getElementById("imgProgress");
var actionMsg = document.getElementById("actionMsg");
var update = false;
var mVideo = null;
var vid = getQueryVariable("vid");
if (vid != null) {
    update = true;
    loadUI();
}

function loadUI() {
    getVideoFromVid(vid).then(()=>{
        txtTitle.value = mVideo.title;
        txtURL.value = mVideo.video_url;
        txtEmbedCode.value = mVideo.embed_code;
        cmbAvailableFor.value = mVideo.available_for;
        txtURL.disabled  =true;
        txtEmbedCode.disabled = true;
        btnSubmit.textContent = "Update";
    })

}

function getVideoFromVid(vid) {

    return new Promise((resolve, reject)=>{

        var docRef = firebase.firestore().collection("videos").doc(vid);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            mVideo = doc.data();
            resolve();
           
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            reject();
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
        reject();
    });


    })
    
}


function validateFormDetails() {
    var errorMsg = "";
    var errorFound = false;

    if (txtTitle.value == "") {
        errorMsg += "Please enter video title.<br/>"
        errorFound = true;
    }

    if (txtURL.value == "") {
        errorMsg += "Please enter youtube video URL.<br/>"
        errorFound = true;
    }

    if (txtURL.value != "") {

        if (!txtURL.value.includes("v=")) {
            errorMsg += "Invalid youtube URL.<br/>"
            errorFound = true;

        }

    }

    if (txtEmbedCode.value == "") {
        errorMsg += "Please Enter Video embed code<br/>"
        errorFound = true;
    }

    if (cmbAvailableFor.value == "null") {
        errorMsg += "Please Enter Video Audience.<br/>"
        errorFound = true;
    }



    if (errorFound) {
        errorMsg = "There are following errors -  <br/>" + errorMsg;
        setErrorHeader(errorMsg);
        window.scrollTo(0, document.body.scrollHeight);
        return false;
    }

    msgHeader.style.display = "none";

    return true;
}

btnSubmit.addEventListener("click", function () {
    if (!validateFormDetails()) {
        return;
    }
    imgProgress.style.display = "block";
    saveData().then(() => {
        imgProgress.style.display = "none";
        alert("Video Saved Successfully");
        window.location.href = "admin_view_videos.html"
    })

})

function setErrorHeader(msg) {

    msgHeader.classList.remove("successBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_error.png");
    actionMsg.innerHTML = msg;
    msgHeader.classList.add("errorBorder");

}


function saveData() {

    return new Promise((resolve, reject) => {

        var docId = null;
        if(update == false){
            docId = generateUUID();
        }
        else{
            docId = mVideo.id;
        }
        

        firebase.firestore().collection("videos").doc(docId).set({

            id: docId,
            active: true,
            available_for: cmbAvailableFor.value,
            embed_code: txtEmbedCode.value,
            video_url: txtURL.value,
            title: txtTitle.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()

        })
            .then(function () {

                resolve();
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
                alert(error);
                imgProgress.style.display = "none";
                reject();
            });

    })



}