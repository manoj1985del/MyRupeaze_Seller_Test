var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var table = document.getElementById('tblData');
var reviewList = [];
var btnText;
var query;


fetchReviews();

function fetchReviews() {

    query = firebase.firestore().collection("appReview")
            .orderBy("timestamp", "desc");

    loadReviews(query).then(()=>{

        divProgress.style.display = "none";
        divContent.style.display = "block";
       // console.log(enquiryList);
    
        createTable();
      //createTableHeaders();

    })
}

function loadReviews(query){

    return new Promise((resolve, reject) => {

            query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var review = doc.data();
                    reviewList.push(review);
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

    var thReview = document.createElement("th");
    thReview.textContent = "Review";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

   

    tr.appendChild(thSNo);
    tr.appendChild(thDate);
    tr.appendChild(thReview);
    tr.appendChild(thAction);
   

    tHead.appendChild(tr);
    table.appendChild(tHead);

}



function createTable(){

    deleteTableRows();
    createTableHeaders();

    for(var i = 0; i < reviewList.length; i++){
        var review = reviewList[i];

        if(review.is_public == true){
            btnText = "Make Private";
        }
        else{
            btnText = "Make Public";
        }
        var tr = document.createElement('tr');
        var tdSNo = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdReview = document.createElement('td');
        var tdAction = document.createElement('td');

        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.textContent = (i+1).toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = review.timestamp.toDate();
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

        var divReview = document.createElement('div');
        var spanReview = document.createElement('span');
        spanReview.textContent = review.review;
        divReview.appendChild(spanReview);
        tdReview.appendChild(divReview);

        var divAction = document.createElement("div");
        var divChangeScope = document.createElement("div");
        var btnChangeScope = document.createElement("button");
        btnChangeScope.textContent = btnText;
        btnChangeScope.setAttribute("id", i.toString());
        btnChangeScope.style.marginBottom = "10px";
        btnChangeScope.style.width = "150px";
        divChangeScope.appendChild(btnChangeScope);
        divAction.appendChild(divChangeScope);
        tdAction.appendChild(divAction);

        tr.appendChild(tdSNo);
        tr.appendChild(tdDate);
        tr.appendChild(tdReview);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnChangeScope.addEventListener("click", function(){

            var index = parseInt(this.id);
            var review = reviewList[index];
            var docId = review.docId;
            var is_public = review.is_public;

            changeReviewScope(docId, is_public).then(()=>{
                reviewList = [];
                loadReviews(query).then(()=>{
                    createTable();
                    alert("Value Updated Successfully");            
                })
               
            })
                
        })

    }

}

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function changeReviewScope(docId, is_public){

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("appReview").doc(docId)
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

