var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var table = document.getElementById('tblData');
var btnSubmit = document.getElementById("btnSubmit");

var txtProductName = document.getElementById("txtProductName");
var txtQty = document.getElementById("txtQty");
var txtUnitPrice = document.getElementById("txtUnitPrice");
var txtTotalPrice = document.getElementById("txtTotalPrice");
var cmbStatus = document.getElementById("cmbStatus");
var btnAddToList = document.getElementById("btnAddToList");
//var tblPrescription = document.getElementById("tblPrescription");

var mProductName = "";
var mProductQty = 0;
var mUnitPrice = 0;
var mTotalPrice = 0;
var mStatus = "Available";
var tableCreated = false;



var docId = getQueryVariable("docid");
var adm = getQueryVariable("adm");
var admin = false;
if (adm == '1') {
    admin = true;
}
var enquiry = null;

var statusValues = ["Select Status",
    "Available",
    "Not Available"];


getEnquiryDetail().then(() => {
    divProgress.style.display = 'none';
    divContent.style.display = 'block';

    //show submit only if it is pending for seller confirmation
    if (enquiry.status_code != 0) {
        btnSubmit.style.display = "none";
    }

    if(enquiry.product_names != null || enquiry.product_names != undefined){
        if(enquiry.product_names.length > 0){
            createTable();
        }
        
    }

  //  createTableForPrescription();
    //createTable();

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

    // var thAction = document.createElement("th");
    // thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thProductName);
    tr.appendChild(thQty);
    tr.appendChild(thUnitPrice);
    tr.appendChild(thTotalPrice);
    tr.appendChild(thStatus);
    // tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {
   deleteTableRows();

    createTableHeaders();

    console.log(enquiry);
    var type = enquiry.prescription_type;
    // if (type == "image") {
    //     var condition = 1;
    // }
    // else {
    //     var condition = enquiry.product_names.length;
    // }

    for (var i = 0; i < enquiry.product_names.length; i++) {


        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdSNo = document.createElement('td');
        var tdProductName = document.createElement('td');
        var tdQty = document.createElement('td');
        var tdUnitPrice = document.createElement('td');
        var tdTotalPrice = document.createElement('td');
        var tdStatus = document.createElement('td');
        // var tdAction = document.createElement('td');


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
        var spanUnitPrice = document.createElement('span');
        spanUnitPrice.textContent = enquiry.product_prices[i];
        divUnitPrice.appendChild(spanUnitPrice);
        tdUnitPrice.appendChild(divUnitPrice);

        
        var divTotalPrice = document.createElement('div');
        var spanTotalPrice = document.createElement('span');
        spanTotalPrice.textContent = enquiry.product_prices_total[i];
        divTotalPrice.appendChild(spanTotalPrice);
        tdTotalPrice.appendChild(divTotalPrice);

        var divStatus = document.createElement('div');
        var spanStatus = document.createElement('span');
        spanStatus.textContent = enquiry.available_status[i];
        divStatus.appendChild(spanStatus);
        tdStatus.appendChild(divStatus);
        

        // var divAction = document.createElement('div');

        // var divAccept = document.createElement('div');
        // var btnAcceptEnquiry = document.createElement("button");
        // btnAcceptEnquiry.style.width = "150px";
        // btnAcceptEnquiry.textContent = "Accept";
        // btnAcceptEnquiry.setAttribute("id", i.toString());
        // btnAcceptEnquiry.setAttribute("type", "button");
        // divAccept.appendChild(btnAcceptEnquiry);
        // divAction.appendChild(divAccept);

        // var divEdit = document.createElement('div');
        // divEdit.style.marginTop = "10px";
        // var btnEdit = document.createElement("button");
        // btnEdit.style.width = "150px";
        // btnEdit.textContent = "Edit Enquiry";
        // btnEdit.setAttribute("id", i.toString());
        // btnEdit.setAttribute("type", "button");
        // divEdit.appendChild(btnEdit);
        // divAction.appendChild(divEdit);

        // tdAction.appendChild(divAction);

        // if (admin) {
        //     divAction.style.display = "none";
        // }

        tr.appendChild(tdSNo);
        tr.appendChild(tdProductName);
        tr.appendChild(tdQty);
        tr.appendChild(tdUnitPrice);
        tr.appendChild(tdTotalPrice);
        tr.appendChild(tdStatus);
        //tr.appendChild(tdAction);

        table.appendChild(tr);

        // btnAcceptEnquiry.addEventListener("click", function () {
        //     var index = parseInt(this.id);
        //     var unitPriceElement = document.getElementById("unitPrice" + this.id);
        //     var totalPriceElement = document.getElementById("totalPrice" + this.id);
        //     var selectElement = document.getElementById("select" + this.id);

        //     if (selectElement.value == "Pending") {
        //         alert("Please Select Available or Not Available");
        //         selectElement.focus();
        //         return;
        //     }

        //     if (selectElement.value == "Available") {
        //         if (unitPriceElement.value == 0) {
        //             alert("Unit Price Cannot be Zero");
        //             unitPriceElement.focus();
        //             return;
        //         }

        //         if (totalPriceElement.value == 0) {
        //             alert("Total Price Cannot be Zero");
        //             totalPriceElement.focus();
        //             return;
        //         }
        //     }

        //     if (selectElement.value == "Not Available") {
        //         unitPriceElement.value = 0;
        //         totalPriceElement.value = 0;
        //     }



        //     unitPriceElement.disabled = true;
        //     totalPriceElement.disabled = true;
        //     selectElement.disabled = true;

        //     enquiry.product_prices[index] = parseFloat(unitPriceElement.value);
        //     enquiry.product_prices_total[index] = parseFloat(totalPriceElement.value);
        //     enquiry.available_status[index] = selectElement.value;

        // })

        // btnEdit.addEventListener("click", function () {
        //     var index = parseInt(this.id);

        //     var unitPriceElement = document.getElementById("unitPrice" + this.id);
        //     var totalPriceElement = document.getElementById("totalPrice" + this.id);
        //     var selectElement = document.getElementById("select" + this.id);

        //     unitPriceElement.value = 0;
        //     totalPriceElement.value = 0;
        //     selectElement.value = "Pending";

        //     unitPriceElement.disabled = false;
        //     totalPriceElement.disabled = false;
        //     selectElement.disabled = false;

        //     enquiry.product_prices[index] = parseFloat(unitPriceElement.value);
        //     enquiry.product_prices_total[index] = parseFloat(totalPriceElement.value);
        //     enquiry.available_status[index] = selectElement.value;



        // })




    }
    if (admin) {
        btnSubmit.style.display = "none";
    }
}


function createTableHeadersForPrescription() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");


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

    tr.appendChild(thProductName);
    tr.appendChild(thQty);
    tr.appendChild(thUnitPrice);
    tr.appendChild(thTotalPrice);
    tr.appendChild(thStatus);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

var mIndex = 0;

function createTableForPrescription() {
    createTableHeadersForPrescription();


    var tr = document.createElement('tr');
    var tdProductName = document.createElement('td');
    var tdQty = document.createElement('td');
    var tdUnitPrice = document.createElement('td');
    var tdTotalPrice = document.createElement('td');
    var tdStatus = document.createElement('td');
     var tdAction = document.createElement('td');



     var divProductName = document.createElement('div');
     // <input type="number" class="form-control" id="txtReturnWindow" required></input>
     var inputProductName = document.createElement('input');
     inputProductName.setAttribute("type", "text");
     inputProductName.classList.add("form-control");
     inputProductName.setAttribute("id", "productName1");
     divProductName.appendChild(inputProductName);
     tdProductName.appendChild(divProductName);

     var divQty = document.createElement('div');
     // <input type="number" class="form-control" id="txtReturnWindow" required></input>
     var inputQty = document.createElement('input');
     inputQty.setAttribute("type", "number");
     inputQty.classList.add("form-control");
     inputQty.setAttribute("id", "qty1");
     divQty.appendChild(inputQty);
     tdQty.appendChild(inputQty);


    var divUnitPrice = document.createElement('div');
    // <input type="number" class="form-control" id="txtReturnWindow" required></input>
    var inputUnitPrice = document.createElement('input');
    inputUnitPrice.setAttribute("type", "number");
    inputUnitPrice.classList.add("form-control");
    inputUnitPrice.setAttribute("id", "unitPrice1");
    divUnitPrice.appendChild(inputUnitPrice);
    tdUnitPrice.appendChild(divUnitPrice);

    var divTotalPrice = document.createElement('div');
    var inputTotalPrice = document.createElement('input');
    inputTotalPrice.setAttribute("type", "number");
    inputTotalPrice.classList.add("form-control")
    inputTotalPrice.setAttribute("id", "totalPrice1");
    divTotalPrice.appendChild(inputTotalPrice);
    tdTotalPrice.appendChild(divTotalPrice);

    var divStatus = document.createElement('div');
    var select = document.createElement("select");
    select.setAttribute("id", "select1");


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

    select.value = "Available";


    divStatus.appendChild(select);
    tdStatus.appendChild(divStatus);


    var divAction = document.createElement('div');

    var divAddToList = document.createElement('div');
    var btnAddToList = document.createElement("button");
    btnAddToList.style.width = "150px";
    btnAddToList.textContent = "Add to List";
    btnAddToList.setAttribute("id", "btnAddtoList");
    btnAddToList.setAttribute("type", "button");
    divAddToList.appendChild(btnAddToList);
    divAction.appendChild(divAddToList);
    tdAction.appendChild(divAction);


    tr.appendChild(tdProductName);
    tr.appendChild(tdQty);
    tr.appendChild(tdUnitPrice);
    tr.appendChild(tdTotalPrice);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    table.appendChild(tr);

    btnAddToList.addEventListener("click", function () {
        var productNameElement = document.getElementById("productName1");
        var qtyElement = document.getElementById("qty1");
        var unitPriceElement = document.getElementById("unitPrice1");
        var totalPriceElement = document.getElementById("totalPrice1");
        var selectElement = document.getElementById("select1");

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



        // unitPriceElement.disabled = true;
        // totalPriceElement.disabled = true;
        // selectElement.disabled = true;

        console.log(enquiry);
        if(enquiry.product_names == undefined || enquiry.product_names == null){
            enquiry.product_names = [];
        }

        if(enquiry.product_qty == undefined || enquiry.product_qty == null){
            enquiry.product_qty = [];
        }

        if(enquiry.product_prices == undefined || enquiry.product_prices == null){
            enquiry.product_prices = [];
        }

        if(enquiry.product_prices_total == undefined || enquiry.product_prices_total == null){
            enquiry.product_prices_total = [];
        }

        if(enquiry.available_status == undefined || enquiry.available_status == null){
            enquiry.available_status = [];
        }


        enquiry.product_names[mIndex] = parseFloat(productNameElement.value);
        enquiry.product_qty[mIndex] = parseInt(qtyElement.value);
        enquiry.product_prices[mIndex] = parseFloat(unitPriceElement.value);
        enquiry.product_prices_total[mIndex] = parseFloat(totalPriceElement.value);
        enquiry.available_status[mIndex] = selectElement.value;

        createTable();

        mIndex++;

    })

    // btnEdit.addEventListener("click", function () {
    //     var index = parseInt(this.id);

    //     var unitPriceElement = document.getElementById("unitPrice" + this.id);
    //     var totalPriceElement = document.getElementById("totalPrice" + this.id);
    //     var selectElement = document.getElementById("select" + this.id);

    //     unitPriceElement.value = 0;
    //     totalPriceElement.value = 0;
    //     selectElement.value = "Pending";

    //     unitPriceElement.disabled = false;
    //     totalPriceElement.disabled = false;
    //     selectElement.disabled = false;

    //     enquiry.product_prices[index] = parseFloat(unitPriceElement.value);
    //     enquiry.product_prices_total[index] = parseFloat(totalPriceElement.value);
    //     enquiry.available_status[index] = selectElement.value;



    // })





    if (admin) {
        btnSubmit.style.display = "none";
    }
}

btnAddToList.addEventListener("click", ()=>{

    if(enquiry.product_names == undefined || enquiry.product_names == null){
        enquiry.product_names = [];
    }

    if(enquiry.product_qty == undefined || enquiry.product_qty == null){
        enquiry.product_qty = [];
    }

    if(enquiry.product_prices == undefined || enquiry.product_prices == null){
        enquiry.product_prices = [];
    }

    if(enquiry.product_prices_total == undefined || enquiry.product_prices_total == null){
        enquiry.product_prices_total = [];
    }

    if(enquiry.available_status == undefined || enquiry.available_status == null){
        enquiry.available_status = [];
    }


    enquiry.product_names.push(txtProductName.value);
    enquiry.product_qty.push(parseInt(txtQty.value));
    enquiry.product_prices.push(parseFloat(txtUnitPrice.value));
    enquiry.product_prices_total.push(parseFloat(txtTotalPrice.value));
    enquiry.available_status.push(cmbStatus.value);

    createTable();
})

function submitResponse() {

    var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
    washingtonRef.update({
        product_names: enquiry.product_names,
        product_qty: enquiry.product_qty,
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

        if (status == "Available") {
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
        var docRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
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

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}
