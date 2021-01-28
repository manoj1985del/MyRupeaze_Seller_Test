var invoice = null;
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
var invoiceExist = false;
var sellerId = localStorage.getItem("sellerid");
var earnedPoints;
var customerId;
var pointList = [];

var status_list;
var invoiceId = getQueryVariable("invoiceid");
if (invoiceId != null) {
    txtInvoice.value = invoiceId;
    getInvoiceDetails(invoiceId);
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

        //amout credited would have been 2.5 percent of price..
        var priceTwoAndHalfPercent = (price * 2.5) / 100;
        var points = Math.floor(priceTwoAndHalfPercent * 8);
        // //for every 100 rs spent 20 points will be earned
        // var points = factor * 20;
        // points = Math.floor(points);

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
        productPriceSpan.textContent = price.toString();
        divPrice.appendChild(productPriceSpan);

        var divQty = document.createElement("div");
        var qtySpan = document.createElement("span");
        qtySpan.textContent = qty.toString();
        divQty.appendChild(qtySpan);

        var divFinalPrice = document.createElement("div");
        var finalPriceSpan = document.createElement("span");
        finalPriceSpan.textContent = qty * price;
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
            returnItem(status_list, pointsToReduce);
            return false;

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

function debitPoints(points) {

    return new Promise((resolve, reject) =>{
        points = -points;

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

function returnItem(status_list, points) {

    debitPoints(points).then(()=>{


        var invoiceRef = firebase.firestore().collection("offline_invoices").doc(txtInvoice.value);

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
    })


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

