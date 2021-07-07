var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var cmbAppType = document.getElementById('cmbApptype');
var table = document.getElementById('tblData');
var reviewList = [];
var btnText;
var query;

divProgress.style.display = "none";
divContent.style.display = "block";

cmbAppType.addEventListener("change", function () {
    reviewList = [];
    fetchReviews(cmbApptype.value);
});

function fetchReviews(type) {

    query = firebase.firestore().collection("appReview").where("app_type", "==", type)
        .orderBy("timestamp", "desc");

    loadReviews(query).then(() => {
        createTable();
    })
}

function loadReviews(query) {

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

    var thCustomer = document.createElement("th");
    thCustomer.textContent = "Customer Details";

    var thReview = document.createElement("th");
    thReview.textContent = "Review";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thDate);
    tr.appendChild(thCustomer);
    tr.appendChild(thReview);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}



function createTable() {

    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < reviewList.length; i++) {
        var review = reviewList[i];

        if (review.is_public == true) {
            btnText = "Make Private";
        }
        else {
            btnText = "Make Public";
        }
        var tr = document.createElement('tr');
        var tdSNo = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdCustomer = document.createElement('td');
        var tdReview = document.createElement('td');
        var tdAction = document.createElement('td');

        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.textContent = (i + 1).toString();
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

        //Customer Details
        var divCustomer = document.createElement('div');
        var spanCustomer = document.createElement('span');
        spanCustomer.innerHTML = review.customer_name + "<br/>Phone Number: " + review.customer_phone + "<br />Email:" + review.customer_email;
        divCustomer.appendChild(spanCustomer);
        tdCustomer.appendChild(divCustomer);

        //Customer Review
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
        tr.appendChild(tdCustomer);
        tr.appendChild(tdReview);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnChangeScope.addEventListener("click", function () {

            var index = parseInt(this.id);
            var review = reviewList[index];
            var doc_id = review.doc_id;
            var is_public = review.is_public;

            changeReviewScope(doc_id, is_public).then(() => {
                alert("Value Updated Successfully");
                window.location.href = "app_review.html";
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

function changeReviewScope(doc_id, is_public) {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("appReview").doc(doc_id)
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

