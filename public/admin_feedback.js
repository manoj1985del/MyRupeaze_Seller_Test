var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var cmbAppType = document.getElementById('cmbApptype');
var table = document.getElementById('tblData');
var feedbackList = [];
var btnText;
var query;


divProgress.style.display = "none";
divContent.style.display = "block";  


cmbAppType.addEventListener("change", function () {
    feedbackList = [];
    fetchFeedbacks(cmbApptype.value);
});


function fetchFeedbacks(type) {

    query = firebase.firestore().collection("feedback").where("app_type", "==", type)
            .orderBy("timestamp", "desc");

    loadFeedbacks(query).then(()=>{  
        createTable();
    })
}

function loadFeedbacks(query){

    return new Promise((resolve, reject) => {

            query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var feedback = doc.data();
                    feedbackList.push(feedback);
                });
            })
            .then(() => {

                resolve();
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}

function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSNo = document.createElement('th');
    thSNo.textContent = "S.No";

    var thDate = document.createElement("th");
    thDate.textContent = "Date";

    var thCustomer = document.createElement("th");
    thCustomer.textContent = "Customer Details";
 
    var thFeedback = document.createElement("th");
    thFeedback.textContent = "Feedback";
    
    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thDate);
    tr.appendChild(thCustomer);
    tr.appendChild(thFeedback);
    tr.appendChild(thAction);
    tHead.appendChild(tr);
    table.appendChild(tHead);

}



function createTable(){

    deleteTableRows();
    createTableHeaders();

    for(var i = 0; i < feedbackList.length; i++){
        var feedback = feedbackList[i];

        if (feedback.is_public == true) {
            btnText = "Make Private";
        }
        else {
            btnText = "Make Public";
        }

        var tr = document.createElement('tr');
        var tdSNo = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdCustomer = document.createElement('td');
        var tdFreedback = document.createElement('td');
        var tdAction = document.createElement('td');

        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.textContent = (i+1).toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        //Order Date
        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = feedback.timestamp.toDate();
        var dd = ord.getDate();
        var mm = ord.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        var yyyy = ord.getFullYear();
        var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
        orderDate.textContent = formattedDay;
        divOrderDate.appendChild(orderDate);
        tdDate.appendChild(divOrderDate);

        //Customer Details
        var divCustomer = document.createElement('div');
        var spanCustomer = document.createElement('span');
        spanCustomer.innerHTML = feedback.customer_name + "<br/>Phone Number: " + feedback.customer_phone + "<br />Email:" + feedback.customer_email;
        divCustomer.appendChild(spanCustomer);
        tdCustomer.appendChild(divCustomer);

        var divFeedback = document.createElement('div');
        var spanFeedback = document.createElement('span');
        spanFeedback.textContent = feedback.feedback;
        divFeedback.appendChild(spanFeedback);
        tdFreedback.appendChild(divFeedback);

        var divAction = document.createElement("div");

        var divChangeScope = document.createElement("div");
        var btnChangeScope = document.createElement("button");
        btnChangeScope.textContent = btnText;
        btnChangeScope.setAttribute("id", i.toString());
        btnChangeScope.style.marginTop = "10px";
        btnChangeScope.style.width = "150px";
        divChangeScope.appendChild(btnChangeScope);
        divAction.appendChild(divChangeScope);

        var divFeedbackResponse = document.createElement("div");
        var btnFeedbackResponse = document.createElement("button");
        btnFeedbackResponse.textContent = "Generate Response";
        btnFeedbackResponse.setAttribute("id", i.toString());
        btnFeedbackResponse.style.marginTop = "10px";
        btnFeedbackResponse.style.width = "150px";
        divFeedbackResponse.appendChild(btnFeedbackResponse);
        divChangeScope.appendChild(divFeedbackResponse);

        tdAction.appendChild(divAction);

        tr.appendChild(tdSNo);
        tr.appendChild(tdDate);
        tr.appendChild(tdCustomer);
        tr.appendChild(tdFreedback);
        tr.appendChild(divAction);

        table.appendChild(tr);

        if(feedback.feedback_response != null){
            btnFeedbackResponse.style.display = "none";  
        }


        btnChangeScope.addEventListener("click", function () {

            console.log("clicked");
    
            var index = parseInt(this.id);
            var feedback = feedbackList[index];
            var doc_id = feedback.doc_id;
            var is_public = feedback.is_public;
    
            changeReviewScope(doc_id, is_public).then(() => {
                alert("Value Updated Successfully");
                window.location.href = "admin_feedback.html";
            })
    
        })

        btnFeedbackResponse.addEventListener("click", function () {
            var index = parseInt(this.id);
            var feedback = feedbackList[index];
            var doc_id = feedback.doc_id;
            window.location.href = "feedback_response.html?doc_id=" + doc_id;
        })
    }


    function deleteTableRows() {
        //e.firstElementChild can be used. 
        var child = table.lastElementChild;
        while (child) {
            table.removeChild(child);
            child = table.lastElementChild;
        }
    }

}

function changeReviewScope(doc_id, is_public) {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("feedback").doc(doc_id)
            .update({
                is_public: !is_public
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                reject();
            });

    })
}