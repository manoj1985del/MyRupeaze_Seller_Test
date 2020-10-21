var pageHeader = document.getElementById("pageHeader");
var errorMsg = document.getElementById("errorMsg");
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var tblInvoices = document.getElementById("tblInvoices");
var imgLoading = document.getElementById("loading");
var btnNext = document.getElementById("next");
var btnPrevious = document.getElementById("previous");
var errMsg = document.getElementById("errorMsg");
var table = document.getElementById("tblInvoices");
var rupeeSymbol = "₹ ";
var lastVisibleDoc;

var docLimit = 25 ;

var invoiceList = [];
var lastVisibleDoc;
var queryList = [];
var pageIndex = 0;
var paginationFinished = false;


var sellerid = getQueryVariable("sellerid");


loadInvoices();


function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

btnNext.addEventListener("click", function () {
    divProgress.style.display = "block";
    divContent.style.display = "none";
    invoiceList = [];

    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex + 1];

    fetchInvoices(query).then(() => {

        showInvoices();
        nextQuery = firebase.firestore()
            .collection('seller').doc(sellerid).collection("invoices")
            .orderBy("timestamp", "desc")
            .limit(docLimit)
            .startAfter(lastVisibleDoc);
        pageIndex++;
        queryList.push(nextQuery);
        if (paginationFinished) {
            btnNext.style.display = "none";
        } else {
            btnNext.style.display = "block";
        }
        btnPrevious.style.display = "block";
    });



})

btnPrevious.addEventListener("click", function () {
    btnNext.style.display = "block";
    paginationFinished = false;
    divProgress.style.display = "block";
    divContent.style.display = "none";
   

    invoiceList = [];
   
    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex - 1];

    
    fetchInvoices(query).then(() => {

        showInvoices();
        pageIndex--;
        if (pageIndex == 0) {
            btnPrevious.style.display = "none";

        } else {
            btnPrevious.style.display = "block";
        }
    });

})


function loadInvoices() {

    pageHeader.textContent = "Offline Invoices";
    var query = firebase.firestore()
        .collection('seller').doc(sellerid).collection("invoices")
        .orderBy("timestamp", "desc")
        .limit(docLimit);

    queryList.push(query);

    fetchInvoices(query).then(() => {

        nextQuery = firebase.firestore()
            .collection('seller').doc(sellerid).collection("invoices")
            .orderBy("timestamp", "desc")
            .startAfter(lastVisibleDoc)
            .limit(docLimit);


        queryList.push(nextQuery);
        showInvoices();
    })


}

function fetchInvoices(query) {

    console.log(query);
    return new Promise((resolve, reject) => {

        query.get()
            .then(function (snapshot) {
                imgLoading.style.display = "none";
                divProgress.style.display = "none";
                divContent.style.display = "block";


                if (snapshot.docs.length < docLimit) {
                    btnNext.style.display = "none";
                } else {
                    btnNext.style.display = "block";
                }

                if (queryList.length > 1 && snapshot.docs.length == 0) {
                    errMsg.textContent = "No further rows to display";
                    errMsg.style.display = "block";

                    paginationFinished = true;
                    pageIndex++;
                    btnNext.style.display = "none";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";
                    return;
                }

                if (snapshot.docs.length == 0) {
                    errMsg.textContent = "No Invoices found";
                    errMsg.style.display = "block";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";

                    return;
                }

                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                console.log("last visible doc = " + lastVisibleDoc);

                divProgress.style.display = "none";
                divContent.style.display = "block";

                snapshot.forEach(function (doc) {
                    var invoice = doc.data();
                    invoiceList.push(invoice);
                })

            }).then(() => {
                console.log(invoiceList);
                resolve();
            });
    })
}

function createTableHeaders() {
    var tr = document.createElement('tr');

    var dateHeader = document.createElement("th");
    var invoiceIdHeader = document.createElement('th');
    var sellerDetail = document.createElement("th");
    var customerHeader = document.createElement("th");
    var productDetail = document.createElement("th");
    var TotalPriceDetail = document.createElement("th");

    dateHeader.innerHTML = "Order Date";
    invoiceIdHeader.innerHTML = "Invoice Id";
    sellerDetail.innerHTML = "Seller Details";
    customerHeader.innerHTML = "Customer Details";
    productDetail.innerHTML = "Product Details";
    TotalPriceDetail.innerHTML = "Total Price";


    tr.appendChild(dateHeader);
    tr.appendChild(invoiceIdHeader);
    tr.appendChild(sellerDetail);
    tr.appendChild(customerHeader);
    tr.appendChild(productDetail);
    tr.appendChild(TotalPriceDetail);
    table.appendChild(tr);

}

function showInvoices() {
    createTableHeaders();

    for (var i = 0; i < invoiceList.length; i++) {
        var invoice = invoiceList[i];
        var tr = document.createElement('tr');
        var tdDate = document.createElement('td');
        var tdInvoice = document.createElement('td');
        var tdSeller = document.createElement('td');
        var tdCustomer = document.createElement('td');
        var tdProduct = document.createElement('td');
        var tdTotalPrice = document.createElement('td');

        //order date
        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = invoice.timestamp.toDate();
        var dd = ord.getDate();
        var mm = ord.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        var yyyy = ord.getFullYear();
        var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
        orderDate.textContent = formattedDay;
        divOrderDate.appendChild(orderDate);

        //invoice id
        var divInvoiceId = document.createElement('div');
        var invoiceId = document.createElement('span');
        invoiceId.innerHTML = invoice.invoice_id;
        divInvoiceId.appendChild(invoiceId);

        //seller details
        var divSellerDetails = document.createElement('div');

        var divSellerName = document.createElement('div');
        var spanSellerName = document.createElement("span");
        spanSellerName.textContent = invoice.seller_name;
        divSellerName.appendChild(spanSellerName);
        divSellerDetails.appendChild(divSellerName);

        //customer details
        var divCustomerDetails = document.createElement('div');
        var spanCustomerDetails = document.createElement("span");
        spanCustomerDetails.innerHTML = invoice.bill_to_name + "<br />" + "Mobile No: " + invoice.bill_to_phone;
        divCustomerDetails.appendChild(spanCustomerDetails);

        //product Details
        var divProductDetails = document.createElement('div');
        var productList = invoice.product_names;
        var totalPrice = 0;
        for (var prIndex = 0; prIndex < productList.length; prIndex++) {
            var divProduct = document.createElement('div');
            var productName = invoice.product_names[prIndex];
            var gst = invoice.gst_list[prIndex];
            var price = invoice.price_list[prIndex];
            var qty = invoice.product_qty[prIndex];
            var status = invoice.status_list[prIndex];

            var spanProduct = document.createElement('span');
            spanProduct.innerHTML = productName + "<br />"
                + "(GST: " + gst + "%, Price: " + rupeeSymbol + numberWithCommas(price) + ", Qty: " + qty + ")";

            totalPrice += price * qty;

            var spanReturn = document.createElement("span");
            if (status == "Returned") {
                spanReturn.innerHTML = "<br/><b>(Returned)</b><br/>";
                spanReturn.style.color = "#ff0000";
                totalPrice -= price * qty;
            }

            divProduct.appendChild(spanProduct);
            divProduct.appendChild(spanReturn);

            divProductDetails.appendChild(divProduct);

        }


        var divTotalPrice = document.createElement('div');
        var spanTotalPrice = document.createElement('span');
        spanTotalPrice.innerHTML = totalPrice;
        divTotalPrice.appendChild(spanTotalPrice);

        tdDate.appendChild(divOrderDate);
        tdInvoice.appendChild(divInvoiceId);
        tdSeller.appendChild(divSellerDetails);
        tdCustomer.appendChild(divCustomerDetails);
        tdProduct.appendChild(divProductDetails);
        tdTotalPrice.appendChild(divTotalPrice);

        tr.appendChild(tdDate);
        tr.appendChild(tdInvoice);
        tr.appendChild(tdSeller);
        tr.appendChild(tdCustomer);
        tr.appendChild(tdProduct);
        tr.appendChild(tdTotalPrice);

        table.appendChild(tr);




    }
}