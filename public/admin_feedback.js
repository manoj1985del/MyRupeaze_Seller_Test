var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var table = document.getElementById('tblData');
var feedbackList = [];


fetchFeedbacks();

function fetchFeedbacks() {

    var query = firebase.firestore().collection("feedbacks")
            .orderBy("timestamp", "desc");

    loadFeedbacks(query).then(()=>{

        divProgress.style.display = "none";
        divContent.style.display = "block";
       // console.log(enquiryList);
    
        createTable();
      //createTableHeaders();

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

   

    tr.appendChild(thSNo);
    tr.appendChild(thDate);
    tr.appendChild(thCustomer);
    tr.appendChild(thFeedback);
   

    tHead.appendChild(tr);
    table.appendChild(tHead);

}



function createTable(){

    createTableHeaders();

    for(var i = 0; i < feedbackList.length; i++){
        var feedback = feedbackList[i];

        var tr = document.createElement('tr');
        var tdSNo = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdCustomer = document.createElement('td');
        var tdFreedback = document.createElement('td');

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

        tr.appendChild(tdSNo);
        tr.appendChild(tdDate);
        tr.appendChild(tdCustomer);
        tr.appendChild(tdFreedback);

        table.appendChild(tr);
    }

}