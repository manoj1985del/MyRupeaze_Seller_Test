var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var btnSubmit = document.getElementById('btnSubmit');
var txtQuestion = document.getElementById('txtQuestion');
var txtAnswer = document.getElementById('txtAnswer');
var table = document.getElementById('tblData');
var faqList = [];
var count;
var faqIndex;
var deletedFaqIndex;
var updateFaq = false;
var faqToBeUpdated;


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

    if(updateFaq == true){

        updateData(txtQuestion.value, txtAnswer.value, faqToBeUpdated.docId).then(()=>{
            alert("FAQ Updated Successfully!!");
            window.location.href = "faq.html";
        })
      
        updateFaq = false;
    }
    else{
        count = faqList.length;
        saveData(txtQuestion.value, txtAnswer.value, count).then(()=>{
            alert("FAQ Saved Successfully!!");
            window.location.href = "faq.html";
        })
    }

  
})

function saveData(question, answer, count) {

    return new Promise((resolve, reject)=>{


        var docId = generateUUID();
    // Add a new document in collection "cities"
     firebase.firestore().collection("faq").doc(docId).set({
        docId: docId,
        question: question,
        answer: answer,
        index: count
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

function updateData(question, answer, id) {

    return new Promise((resolve, reject)=>{

     firebase.firestore().collection("faq").doc(id).update({
        question: question,
        answer: answer,
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

        var divDelete = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.setAttribute("id", faq.docId);
        btnDelete.textContent = "Delete";
        btnDelete.style.width = "150px";
        divDelete.appendChild(btnDelete);
        divAction.appendChild(divDelete);
    
       
       
        var divMoveUp = document.createElement("div");
        var btnMoveUp = document.createElement("button");
        btnMoveUp.setAttribute("id", faq.docId);
        btnMoveUp.textContent = "Move up";
        btnMoveUp.style.width = "150px";
        divMoveUp.appendChild(btnMoveUp);

        var divMoveDown = document.createElement("div");
        var btnMoveDown = document.createElement("button");
        btnMoveDown.setAttribute("id", faq.docId);
        btnMoveDown.textContent = "Move down";
        btnMoveDown.style.width = "150px";
        divMoveDown.appendChild(btnMoveDown);
        divMoveUp.appendChild(divMoveDown);

        var divEditFaq = document.createElement("div");
        var btnEditFaq = document.createElement("button");
        btnEditFaq.setAttribute("id", faq.docId);
        btnEditFaq.textContent = "Edit FAQ";
        btnEditFaq.style.width = "150px";
        divEditFaq.appendChild(btnEditFaq);
        divMoveUp.appendChild(divEditFaq);

        divAction.appendChild(divMoveUp);
        tdAction.appendChild(divAction);

        tr.appendChild(tdQuestion);
        tr.appendChild(tdAnswer);
        tr.appendChild(tdAction);
     

        table.appendChild(tr);

        btnDelete.addEventListener("click", function(){
            deleteFAQ(this.id);
        })

        btnMoveUp.addEventListener("click", function(){
            moveIndexUp(this.id);
        })

        btnMoveDown.addEventListener("click", function(){
           moveIndexDown(this.id);
        })

        btnEditFaq.addEventListener("click", function(){
            console.log(this.id);
            editFaq(this.id);
        })
    }

}

function moveIndexUp(id){

    var docRef = firebase.firestore().collection("faq").doc(id);
    docRef.get().then((doc) => {
        if (doc.exists) {
           var faqData = doc.data();
           faqIndex = faqData.index;
           if(faqIndex != 0){
            var faq = faqList[faqIndex];
            var prevFaq = faqList[faqIndex -1];
           

            var prevFaqId = String(faqList[faqIndex - 1].docId);
            console.log(prevFaqId);

            var docRef = firebase.firestore().collection("faq").doc(id); 
            docRef.update({
                index: faqIndex - 1
            }).then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            
           }

           
         var docRef = firebase.firestore().collection("faq").doc(prevFaqId); 
           
           docRef.update({
               index: faqIndex
           }).then(() => {
               console.log("Document successfully updated!");
               alert("FAQ moved up Successfully!!");
               window.location.href = "faq.html";    
           })
           .catch((error) => {
               // The document probably doesn't exist.
               console.error("Error updating document: ", error);
           });

         
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });



}

function moveIndexDown(id){
    var docRef = firebase.firestore().collection("faq").doc(id);
    docRef.get().then((doc) => {
        if (doc.exists) {
           var faqData = doc.data();
           faqIndex = faqData.index;
           
            var nextFaqId = String(faqList[faqIndex + 1].docId);
            console.log(nextFaqId);

            var docRef = firebase.firestore().collection("faq").doc(id); 
            docRef.update({
                index: faqIndex + 1
            }).then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            
           

           
         var docRef = firebase.firestore().collection("faq").doc(nextFaqId); 
           
           docRef.update({
               index: faqIndex
           }).then(() => {
               console.log("Document successfully updated!");
               alert("FAQ moved down Successfully!!");
               window.location.href = "faq.html";
           })
           .catch((error) => {
               // The document probably doesn't exist.
               console.error("Error updating document: ", error);
           });

         
   
        
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
   
    
   
}


function deleteFAQ(docId){
    var docRef = firebase.firestore().collection("faq").doc(docId);
    docRef.get().then((doc) => {
        if (doc.exists) {
           var faqData = doc.data();
           deletedFaqIndex = faqData.index;
           console.log(deletedFaqIndex);

       
 
        var faqLength = faqList.length - 1;
        var index = faqLength - deletedFaqIndex;
        var length = index + index;
        if(deletedFaqIndex == 0){
            index = 1;
        }
        for(var i = index; i <= length; i++){
            firebase.firestore().collection("faq").where("index", "==", i)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("inside function");
                    var faqData = doc.data();
                    var id = faqData.docId;
                    firebase.firestore().collection("faq").doc(id).update({index: deletedFaqIndex});
                    deletedFaqIndex++;
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        }
           
     
    

           docRef.update({
               index: faqIndex - 1
           }).then(() => {
               console.log("Document successfully updated!");
               alert("FAQ moved down Successfully!!");
               window.location.href = "faq.html";
           })
           .catch((error) => {
               // The document probably doesn't exist.
               console.error("Error updating document: ", error);
           });

           firebase.firestore().collection("faq").doc(docId).delete().then(() => {
            alert("FAQ successfully deleted!");
            window.location.href = "faq.html";
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

   
}

function editFaq(id){
    firebase.firestore().collection("faq").doc(id).get().then((doc) => {
        if (doc.exists) {
            var faq = doc.data();
            var question = faq.question;
            var answer = faq.answer;
            var index = faq.index;
            txtQuestion.value = question;
            txtAnswer.value = answer;

            updateFaq = true;
            faqToBeUpdated = faq;

            window.scrollTo(0, 0);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function loadFAQ(){

    return new Promise((resolve, reject)=>{

        firebase.firestore().collection("faq").orderBy("index")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            var faq = doc.data();
            faqList.push(faq);
            console.log(faq.index);
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