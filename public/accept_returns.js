var invoice = null;
var percentOfAmountCreditedIntoPoints = 1.25;
var txtInvoice = document.getElementById("txtInvoice");
var btnMobile = document.getElementById("btnMobile");
var spCustomerName = document.getElementById("spanCustomerName");
var spCustomerMobile = document.getElementById("spMobile");
var spEmail = document.getElementById("spEmail");
var txtProductName = document.getElementById("txtProductName");
var txtPrice = document.getElementById("txtPrice");
var txtGST = document.getElementById("txtGST");
var txtQty = document.getElementById("txtQty");
var btnAddProduct = document.getElementById("btnAddProduct");
var divCustomerDetails = document.getElementById("divCustomerDetails");
var table = document.getElementById("tblProducts");
var divAllReturn = document.getElementById("divAllReturn");
var btnReturnAll = document.getElementById('btnReturnAll');
var invoiceExist = false;
var sellerId = localStorage.getItem("sellerid");
var earnedPoints;
var customerId;
var pointList = [];
var mPointsUsedForPurchase = false;

var status_list;
var mPharmaEnquiry = null;
var invoiceId = getQueryVariable("invoiceid");
if (invoiceId != null) {
    txtInvoice.value = invoiceId;
    getInvoiceDetails(invoiceId);
    getPharmaEnquiry(invoiceId);
}


var productNames = [];
var priceList = [];
var gstlist = [];
var qtyList = [];
var statusList = [];

//get seller details
var sellerName = localStorage.getItem("sellerName");
var sellerAddressLine1 = localStorage.getItem("sellerAddressLine1");
var sellerAddressLine2 = localStorage.getItem("sellerAddressLine2");
var sellerAddressLine3 = localStorage.getItem("sellerAddressLine3");
var sellerCity = localStorage.getItem("sellerCity");
var sellerState = localStorage.getItem("sellerState");
var sellerCountry = "INDIA";
var sellerPin = localStorage.getItem("sellerpin");
var sellerPAN = localStorage.getItem("sellerPAN");
var sellerGST = localStorage.getItem("sellerGST");


table.style.display = "none";
divCustomerDetails.style.display = "none";
var customer = null;

var productList = [];



function getInvoiceDetails(invoiceId) {
    console.log("fetching invoice details -" + invoiceId);

    getInvoice(invoiceId).then(() => {
        console.log(invoice);
        divCustomerDetails.style.display = "block";
        if (invoice != null) {
            invoiceExist = true;
            spCustomerName.textContent = invoice.bill_to_name;
            spCustomerMobile.textContent = "Contact No. " + invoice.bill_to_phone;
            spEmail.textContent = "Email - " + invoice.bill_to_email;
            customerId = invoice.customer_id;

            createTable();
        }
        else {
            invoiceExist = false;
            spCustomerName.textContent = "No Invoice Found";
            spCustomerName.style.color = "red";

            spCustomerMobile.style.display = "none";
            spEmail.style.display = "none";
        }
    })

}
btnMobile.addEventListener("click", function () {
    console.log("before getting invoice detail for invoice " + txtInvoice.value);
    getInvoiceDetails(txtInvoice.value);
    getPharmaEnquiry(txtInvoice.value);

});


function createTableHeaders() {
    //     <thead>
    //     <tr>
    //         <th>ProductName</th>
    //         <th>Price</th>
    //         <th>GST</th>
    //         <th>Quantity</th>
    //         <th>Total Price</th>
    //         <th>Action</th>
    //     </tr>
    // </thead>

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thProductName = document.createElement("th");
    thProductName.textContent = "Product Name";
    var thPrice = document.createElement("th");
    thPrice.textContent = "Price";
    var thGST = document.createElement("th");
    thGST.textContent = "GST";
    var thQty = document.createElement("th");
    thQty.textContent = "Quantity";
    var thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    var thPoints = document.createElement("th");
    thPoints.textContent = "Points Value";
    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thProductName);
    tr.appendChild(thPrice);
    tr.appendChild(thGST);
    tr.appendChild(thQty);
    tr.appendChild(thTotal);
    tr.appendChild(thPoints);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}
function createTable() {

    deleteTableRows();
    createTableHeaders();

    table.style.display = "block";

    // var product = new Products(txtProductName.value, txtGST.value, txtPrice.value, txtQty.value);
    var productNames = invoice.product_names;
    var price_list = invoice.price_list;
    var product_qty = invoice.product_qty;
    var gst_list = invoice.gst_list;
    status_list = invoice.status_list;

    for (var i = 0; i < productNames.length; i++) {
        if (status_list[i] != "success") {
            continue;
        }
        var productName = productNames[i];
        var qty = product_qty[i];
        var price = price_list[i];
        var gst = gst_list[i];
        var status = status_list[i];

        var price = qty * price;

        var points = 0;
        mPointsUsedForPurchase = invoice.points_redeemed;

        if (mPointsUsedForPurchase == false) {
            //amout credited would have been 1.25 percent of price.
            var priceTwoAndHalfPercent = (price * percentOfAmountCreditedIntoPoints) / 100;
            points = Math.floor(priceTwoAndHalfPercent * 8);
            // //for every 100 rs spent 20 points will be earned
            // var points = factor * 20;
            // points = Math.floor(points);

        }
        pointList.push(points);




        var tr = document.createElement("tr");
        var trId = "tr" + (productList.length - 1).toString();
        tr.setAttribute("id", trId);
        var tdProductName = document.createElement("td");
        var tdPrice = document.createElement("td");
        var tdGST = document.createElement("td");
        var tdQty = document.createElement("td");
        var tdTotalPrice = document.createElement("td");
        var tdPoints = document.createElement("td");
        var tdAction = document.createElement("td");

        var divProductName = document.createElement("div");
        var productNameSpan = document.createElement("span");
        productNameSpan.textContent = productName;
        divProductName.appendChild(productNameSpan);

        var divGST = document.createElement("div");
        var gstSapn = document.createElement("span");
        gstSapn.textContent = gst.toString();
        divGST.appendChild(gstSapn);

        var divPrice = document.createElement("div");
        var productPriceSpan = document.createElement("span");
        productPriceSpan.textContent = price_list[i].toString();
        divPrice.appendChild(productPriceSpan);

        var divQty = document.createElement("div");
        var qtySpan = document.createElement("span");
        qtySpan.textContent = qty.toString();
        divQty.appendChild(qtySpan);

        var divFinalPrice = document.createElement("div");
        var finalPriceSpan = document.createElement("span");
        finalPriceSpan.textContent = qty * price_list[i];
        divFinalPrice.appendChild(finalPriceSpan);

        var divPoints = document.createElement("div");
        var pointsSpan = document.createElement("span");
        pointsSpan.textContent = points;
        divPoints.appendChild(pointsSpan);


        var divAction = document.createElement("div");
        var btnAcceptReturn = document.createElement("button");
        btnAcceptReturn.style.width = "150px";
        btnAcceptReturn.textContent = "Accept Return";
        var id = i.toString();
        btnAcceptReturn.setAttribute("id", id);
        btnAcceptReturn.setAttribute("type", "button");
        divAction.appendChild(btnAcceptReturn);

        if (mPointsUsedForPurchase) {
            btnAcceptReturn.style.display = "none";
            divAllReturn.style.display = "block";
        }

        tdProductName.appendChild(divProductName);
        tdPrice.appendChild(divPrice);
        tdGST.appendChild(divGST);
        tdQty.appendChild(divQty);
        tdTotalPrice.appendChild(divFinalPrice);
        tdPoints.appendChild(divPoints);
        tdAction.appendChild(divAction);

        tr.appendChild(tdProductName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdGST);

        tr.appendChild(tdQty);
        tr.appendChild(tdTotalPrice);
        tr.appendChild(tdPoints);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnAcceptReturn.addEventListener("click", function () {
            var index = parseInt(this.id);
            var pointsToReduce = pointList[index];
            status_list[index] = "Returned";
            creditAndDebitPoints(pointsToReduce, true).then(() => {
                returnItem(status_list);
            })


            // getPoints().then(() => {

            //     var index = parseInt(this.id);
            //     var pointBalance = earnedPoints - pointList[index];
            //     status_list[index] = "Returned";
            //     returnItem(status_list, pointBalance);
            //     return false;

            // })

        })
    }
    //productList.push(product);
}

btnReturnAll.addEventListener("click", function(){

    for (var i = 0; i < invoice.product_names.length; i++) {
        status_list[i] = "Returned";
    }

    creditAndDebitPoints(invoice.points_used_for_purchase, true).then(()=>{
        
        returnItem(status_list);
    })
    
    
})




function creditAndDebitPoints(points, debit) {

    return new Promise((resolve, reject) => {
        if(debit)
        {
            points = -points;
        }
       

        var washingtonRef = firebase.firestore().collection("users").doc(customerId);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            points: firebase.firestore.FieldValue.increment(points)
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                resolve();
            });

    })


}


function returnItem(status_list) {

    var invoiceRef = firebase.firestore().collection("offline_invoices").doc(txtInvoice.value);
    if(mPharmaEnquiry != null){

        updatePharmaStatus(status_list);
    }
    

    // Set the "capital" field of the city 'DC'
    return invoiceRef.update({
        status_list: status_list
    })
        .then(function () {
            window.location.href = "accept_returns.html?invoiceid=" + txtInvoice.value;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}

function updatePharmaStatus(status_list) {

    if(mPharmaEnquiry != null){
        for(var i = 0; i < status_list.length; i++){
            if(status_list[i].toUpperCase() != "SUCCESS"){
                mPharmaEnquiry.available_status[i] = status_list[i];
            }
        }
    }
    var invoiceRef = firebase.firestore().collection("pharmacist_requests").doc(mPharmaEnquiry.doc_id);

    // Set the "capital" field of the city 'DC'
    return invoiceRef.update({
        available_status: mPharmaEnquiry.available_status
    })
        .then(function () {
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}


function appendNumber(number, digits) {
    return String(number).padStart(digits, '0');
}



function getInvoice(invoiceId) {

    return new Promise((resolve, reject) => {
        var query = firebase.firestore()
            .collection('offline_invoices').doc(invoiceId);

        query.get()
            .then(function (doc) {
                if (doc.exists) {
                    invoice = doc.data();
                    resolve();
                }
                else {
                    invoice = null;
                    reject();
                }

            })
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


function getPharmaEnquiry(invoiceId) {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection("pharmacist_requests")
            .where("invoice_id", "==", invoiceId)
            .limit(1)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    mPharmaEnquiry = doc.data();
                   console.log("pharma enquiry found");
                   console.log(mPharmaEnquiry);
                });
            })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });


    })
}