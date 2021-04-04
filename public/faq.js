var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var btnSubmit = document.getElementById('btnSubmit');
var txtQuestion = document.getElementById('txtQuestion');
var txtAnswer = document.getElementById('txtAnswer');
var table = document.getElementById('tblData');
var faqList = [];

divProgress.style.display = "none";
divContent.style.display = "block";

loadFAQ().then(()=>{
    createTable();

})

btnSubmit.addEventListener("click", function () {
    if(txtQuestion.value == ""){
        alert("Please enter Question");
        txtQuestion.focus();
        return;
    }

    if(txtAnswer.value == ""){
        alert("Please enter Answer");
        txtAnswer.focus();
        return;
    }

    saveData(txtQuestion.value, txtAnswer.value).then(()=>{
        alert("FAQ Saved Successfully!!");
        window.location.href = "faq.html";
    })
})

function saveData(question, answer) {

    return new Promise((resolve, reject)=>{

        var docId = generateUUID();
    // Add a new document in collection "cities"
     firebase.firestore().collection("faq").doc(docId).set({
        docId: docId,
        question: question,
        answer: answer
    })
        .then(() => {
            console.log("Document successfully written!");
            resolve();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            reject();
        });
    })
    
}

function createTableHeaders() {
    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thQuestion = document.createElement("th");
    thQuestion.textContent = "Question";

    var thAnswer = document.createElement("th");
    thAnswer.textContent = "Answer";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thQuestion);
    tr.appendChild(thAnswer);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable(){

    createTableHeaders();
    console.log(faqList);
    for(var i = 0; i < faqList.length; i++){
        var faq = faqList[i];
        var tr = document.createElement('tr');

        var tdQuestion = document.createElement('td');
        var divQuestion = document.createElement('div');
        var spanQuestion = document.createElement('span');
        spanQuestion.textContent = faq.question;
        divQuestion.appendChild(spanQuestion);
        tdQuestion.appendChild(divQuestion);

        
        var tdAnswer = document.createElement('td');
        var divAnswer = document.createElement('div');
        var spanAnswer = document.createElement('span');
        spanAnswer.textContent = faq.answer;
        divAnswer.appendChild(spanAnswer);
        tdAnswer.appendChild(divAnswer);

        var tdAction = document.createElement('td');
        var divAction = document.createElement("div");

        var btnDelete = document.createElement("button");
        btnDelete.setAttribute("id", faq.docId);
        btnDelete.textContent = "Delete";
        btnDelete.style.width = "150px";
        divAction.appendChild(btnDelete);
        tdAction.appendChild(divAction);

        tr.appendChild(tdQuestion);
        tr.appendChild(tdAnswer);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnDelete.addEventListener("click", function(){
            deleteFAQ(this.id);
        })
    }

}

function deleteFAQ(docId){
    firebase.firestore().collection("faq").doc(docId).delete().then(() => {
        alert("FAQ successfully deleted!");
        window.location.href = "faq.html";
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


function loadFAQ(){

    return new Promise((resolve, reject)=>{

        firebase.firestore().collection("faq")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            var faq = doc.data();
            faqList.push(faq);
        });
    })
    .then(()=>{
        resolve();
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
        reject();
    });

    })
    

}