var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var table = document.getElementById('tblData');
var btnSubmit = document.getElementById("btnSubmit");



var docId = getQueryVariable("docid");
var adm = getQueryVariable("adm");
var admin = false;
if (adm == '1') {
    admin = true;
}
var enquiry = null;

var statusValues = ["Select Status",
    "Available",
    "Not Available",
    "Pending"];


getEnquiryDetail().then(() => {
    divProgress.style.display = 'none';
    divContent.style.display = 'block';

    //show submit only if it is pending for seller confirmation
    if (enquiry.status_code != 0) {
        btnSubmit.style.display = "none";
    }

    createTable();

})

function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSNo = document.createElement("th");
    thSNo.textContent = "S.No.";

    var thProductName = document.createElement("th");
    thProductName.textContent = "Product Name";


    var thQty = document.createElement("th");
    thQty.textContent = "Quantity";


    var thUnitPrice = document.createElement("th");
    thUnitPrice.textContent = "Unit Price";

    var thTotalPrice = document.createElement("th");
    thTotalPrice.textContent = "total Price";

    var thStatus = document.createElement("th");
    thStatus.textContent = "Status";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thProductName);
    tr.appendChild(thQty);
    tr.appendChild(thUnitPrice);
    tr.appendChild(thTotalPrice);
    tr.appendChild(thStatus);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {
    createTableHeaders();

    for (var i = 0; i < enquiry.product_names.length; i++) {

        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdSNo = document.createElement('td');
        var tdProductName = document.createElement('td');
        var tdQty = document.createElement('td');
        var tdUnitPrice = document.createElement('td');
        var tdTotalPrice = document.createElement('td');
        var tdStatus = document.createElement('td');
        var tdAction = document.createElement('td');


        var divSNo = document.createElement('div');
        var rowNum = i + 1;
        var spanSNo = document.createElement('span');
        spanSNo.textContent = rowNum.toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divProductName = document.createElement('div');
        var spanProductName = document.createElement('span');
        spanProductName.textContent = enquiry.product_names[i];
        divProductName.appendChild(spanProductName);
        tdProductName.appendChild(divProductName);

        var divQty = document.createElement('div');
        var spanQty = document.createElement('span');
        spanQty.textContent = enquiry.product_qty[i];
        divQty.appendChild(spanQty);
        tdQty.appendChild(divQty);

        var divUnitPrice = document.createElement('div');
        // <input type="number" class="form-control" id="txtReturnWindow" required></input>
        var inputUnitPrice = document.createElement('input');
        inputUnitPrice.setAttribute("type", "number");
        inputUnitPrice.classList.add("form-control");
        inputUnitPrice.setAttribute("id", "unitPrice" + i.toString());
        inputUnitPrice.value = enquiry.product_prices[i];
        divUnitPrice.appendChild(inputUnitPrice);
        tdUnitPrice.appendChild(divUnitPrice);

        var divTotalPrice = document.createElement('div');
        var inputTotalPrice = document.createElement('input');
        inputTotalPrice.setAttribute("type", "number");
        inputTotalPrice.classList.add("form-control")
        inputTotalPrice.setAttribute("id", "totalPrice" + i.toString());
        inputTotalPrice.value = enquiry.product_prices_total[i];
        divTotalPrice.appendChild(inputTotalPrice);
        tdTotalPrice.appendChild(divTotalPrice);

        var divStatus = document.createElement('div');
        var select = document.createElement("select");
        select.setAttribute("id", "select" + i.toString());


        for (const val of statusValues) {
            var option = document.createElement("option");
            if (val == "Select Status") {
                option.selected = true;
                option.hidden = true;
                option.disabled = true;
                option.value = null;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
            }
            else {

                option.value = val;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
            }
            select.appendChild(option);
        }

        select.value = enquiry.available_status[i];


        divStatus.appendChild(select);
        tdStatus.appendChild(divStatus);


        var divAction = document.createElement('div');

        var divAccept = document.createElement('div');
        var btnAcceptEnquiry = document.createElement("button");
        btnAcceptEnquiry.style.width = "150px";
        btnAcceptEnquiry.textContent = "Accept";
        btnAcceptEnquiry.setAttribute("id", i.toString());
        btnAcceptEnquiry.setAttribute("type", "button");
        divAccept.appendChild(btnAcceptEnquiry);
        divAction.appendChild(divAccept);

        var divEdit = document.createElement('div');
        divEdit.style.marginTop = "10px";
        var btnEdit = document.createElement("button");
        btnEdit.style.width = "150px";
        btnEdit.textContent = "Edit Enquiry";
        btnEdit.setAttribute("id", i.toString());
        btnEdit.setAttribute("type", "button");
        divEdit.appendChild(btnEdit);
        divAction.appendChild(divEdit);

        tdAction.appendChild(divAction);

        if (admin) {
            divAction.style.display = "none";
        }

        tr.appendChild(tdSNo);
        tr.appendChild(tdProductName);
        tr.appendChild(tdQty);
        tr.appendChild(tdUnitPrice);
        tr.appendChild(tdTotalPrice);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnAcceptEnquiry.addEventListener("click", function () {
            var index = parseInt(this.id);
            var unitPriceElement = document.getElementById("unitPrice" + this.id);
            var totalPriceElement = document.getElementById("totalPrice" + this.id);
            var selectElement = document.getElementById("select" + this.id);

            if (selectElement.value == "Pending") {
                alert("Please Select Available or Not Available");
                selectElement.focus();
                return;
            }

            if (selectElement.value == "Available") {
                if (unitPriceElement.value == 0) {
                    alert("Unit Price Cannot be Zero");
                    unitPriceElement.focus();
                    return;
                }

                if (totalPriceElement.value == 0) {
                    alert("Total Price Cannot be Zero");
                    totalPriceElement.focus();
                    return;
                }
            }

            if (selectElement.value == "Not Available") {
                unitPriceElement.value = 0;
                totalPriceElement.value = 0;
            }



            unitPriceElement.disabled = true;
            totalPriceElement.disabled = true;
            selectElement.disabled = true;

            enquiry.product_prices[index] = parseFloat(unitPriceElement.value);
            enquiry.product_prices_total[index] = parseFloat(totalPriceElement.value);
            enquiry.available_status[index] = selectElement.value;

        })

        btnEdit.addEventListener("click", function () {
            var index = parseInt(this.id);

            var unitPriceElement = document.getElementById("unitPrice" + this.id);
            var totalPriceElement = document.getElementById("totalPrice" + this.id);
            var selectElement = document.getElementById("select" + this.id);

            unitPriceElement.value = 0;
            totalPriceElement.value = 0;
            selectElement.value = "Pending";

            unitPriceElement.disabled = false;
            totalPriceElement.disabled = false;
            selectElement.disabled = false;

            enquiry.product_prices[index] = parseFloat(unitPriceElement.value);
            enquiry.product_prices_total[index] = parseFloat(totalPriceElement.value);
            enquiry.available_status[index] = selectElement.value;



        })




    }
    if (admin) {
        btnSubmit.style.display = "none";
    }
}


function submitResponse() {

    var washingtonRef = firebase.firestore().collection("offline_requests").doc(docId);
    washingtonRef.update({
        available_status: enquiry.available_status,
        product_prices: enquiry.product_prices,
        product_prices_total: enquiry.product_prices_total,
        status_code: 1

    })
        .then(function () {
            alert("details saved successfully");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}

btnSubmit.addEventListener("click", function () {
    for (var i = 0; i < enquiry.product_names.length; i++) {
        var productPrice = enquiry.product_prices[i];
        var productPriceTotal = enquiry.product_prices_total[i];
        var status = enquiry.available_status[i];

        var rowNum = i + 1;




        if (status == "Pending") {
            alert("Status Value Cannot be Pending at row - " + rowNum.toString());
            totalPriceElement.focus();
            return;
        }

        if(status == "Available")
        {
            if (productPrice == 0) {
                alert("Unit Price Cannot be Zero at row - " + rowNum.toString());
                return;
            }
    
            if (productPriceTotal == 0) {
                alert("Total Price Cannot be Zero at row - " + rowNum.toString());
                totalPriceElement.focus();
                return;
            }

        }
      



    }

    submitResponse();

})


function getEnquiryDetail() {
    return new Promise((resolve, reject) => {
        var docRef = firebase.firestore().collection("offline_requests").doc(docId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                enquiry = doc.data();
                resolve();
            } else {
                mSeller = null;
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();

            }
        }).catch(function (error) {
            seller = null;
            console.log("Error getting document:", error);
            reject();
        });

    })

}
