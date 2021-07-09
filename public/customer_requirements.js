var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var cmbAppType = document.getElementById('cmbApptype');
var table = document.getElementById('tblData');
var requirementList = [];
var query;

divProgress.style.display = "none";
divContent.style.display = "block";

cmbAppType.addEventListener("change", function () {
    reviewList = [];
    fetchRequirements(cmbApptype.value);
});

function fetchRequirements(type) {

    query = firebase.firestore().collection("requirement").where("app_type", "==", type)
        .orderBy("timestamp", "desc");

    loadRequirements(query).then(() => {
        createTable();
    })
}

function loadRequirements(query) {

    return new Promise((resolve, reject) => {

        query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var requirement = doc.data();
                    requirementList.push(requirement);
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

    var thRequirement = document.createElement("th");
    thRequirement.textContent = "Requirement";

    // var thAction = document.createElement("th");
    // thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thDate);
    tr.appendChild(thCustomer);
    tr.appendChild(thRequirement);
    //tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}



function createTable() {

    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < requirementList.length; i++) {
        var requirement = requirementList[i];

        var tr = document.createElement('tr');
        var tdSNo = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdCustomer = document.createElement('td');
        var tdRequirement = document.createElement('td');
        //var tdAction = document.createElement('td');

        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.textContent = (i + 1).toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = requirement.timestamp.toDate();
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
        spanCustomer.innerHTML = requirement.customer_name + "<br/>Phone Number: " + requirement.customer_phone + "<br />Email:" + requirement.customer_email;
        divCustomer.appendChild(spanCustomer);
        tdCustomer.appendChild(divCustomer);

        //Customer Requirement
        var divRequirement = document.createElement('div');
        var spanRequirement = document.createElement('span');
        spanRequirement.textContent = requirement.requirement;
        divRequirement.appendChild(spanRequirement);
        tdRequirement.appendChild(divRequirement);

        // var divAction = document.createElement("div");
        // var divChangeScope = document.createElement("div");
        // var btnChangeScope = document.createElement("button");
        // btnChangeScope.textContent = btnText;
        // btnChangeScope.setAttribute("id", i.toString());
        // btnChangeScope.style.marginBottom = "10px";
        // btnChangeScope.style.width = "150px";
        // divChangeScope.appendChild(btnChangeScope);
        // divAction.appendChild(divChangeScope);
        // tdAction.appendChild(divAction);

        tr.appendChild(tdSNo);
        tr.appendChild(tdDate);
        tr.appendChild(tdCustomer);
        tr.appendChild(tdRequirement);
        //tr.appendChild(tdAction);

        table.appendChild(tr);

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

