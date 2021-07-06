var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');

var txtFeedbackResponse = document.getElementById('txtFeedbackResponse');
var txtFeedback = document.getElementById('txtFeedback');
var btnSubmitResponse = document.getElementById('btnSubmitResponse');

var feedback;

divProgress.style.display = "none";
divContent.style.display = "block";  

var doc_id = getQueryVariable("doc_id");

loadFeedback();

function loadFeedback(){
    firebase.firestore().collection("feedback").where("doc_id", "==", doc_id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             feedback = doc.data();
        })
    }).then(()=>{
        console.log("document retrieved");
        txtFeedback.textContent = "User Feedback - " + feedback.feedback;
    })
}


btnSubmitResponse.addEventListener("click", function () {

    if(txtFeedbackResponse.value == ""){
        return;
    }

    firebase.firestore().collection("feedback").doc(doc_id)
    .update({
        feedback_response: txtFeedbackResponse.value
    })
    .then(() => {
        alert("Respone Submitted Successfully");
        window.location.href = "admin_feedback.html";
    })
    
})