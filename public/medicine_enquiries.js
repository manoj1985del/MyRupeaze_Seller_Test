
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var table = document.getElementById("tblData");
var rupeeSymbol = "₹ ";

var sellerId = getQueryVariable("sellerid");
if(sellerId == null){
    sellerId = localStorage.getItem("sellerid");
}

var mSeller;
var enquiryList = [];
var mCustomer = null;
var newInvoiceId = null;
var mSeller = null;
var mRedeemPoints = 0;


var mType = getQueryVariable("type");
var admin = false;
var sellerType = getQueryVariable('sellerType');
if(sellerType == 'admin'){
    admin = true;
}

console.log(admin);
getSellerDetails();
getEnquiries();

function getEnquiries() {

    var query;
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);

    if (!admin) {

        if (mType == "pending") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 0)
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "approved") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 3)
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');


        }

        if (mType == "waiting_for_pickup") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 6)
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');


        }

        if (mType == "unsettled") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", false)
                .where("status_code", "==", 5)
                .orderBy('timestamp', 'desc');

        }

        if (mType == "today_completed") {
             query = firebase.firestore()
                .collection('pharmacist_requests')
                .where("seller_id", "==", sellerId)
                .where("invoice_timestamp", ">=", today)
                .where("cancelled", "==", false);
        }



        if (mType == "all") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');
        }


    }
    else {

        if (mType == "pending") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 0)
                .orderBy('timestamp', 'desc');

        }

        if (mType == "approved") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 3)
                .orderBy('timestamp', 'desc');

        }

        if (mType == "today_completed") {
            var query = firebase.firestore()
                .collection('pharmacist_requests')
                .where("invoice_timestamp", ">=", today)
                .where("cancelled", "==", false);
        }

        if (mType == "waiting_for_pickup") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 6)
                .orderBy('timestamp', 'desc');


        }

        if (mType == "unsettled") {
            query = firebase.firestore().collection("pharmacist_requests")
                .where("status_code", "==", 6)
                .where("settlement_done", "==", false)
                .where("status_code", "==", 5)
                .orderBy('timestamp', 'desc');

        }

        if (mType == "all") {
            query = firebase.firestore().collection("pharmacist_requests")
                .orderBy('timestamp', 'desc');

        }


    }

    loadEnquiry(query).then(() => {

        divProgress.style.display = "none";
        divContent.style.display = "block";
        console.log(enquiryList);

        createTable();
        //createTableHeaders();

    })
}

function loadEnquiry(query) {

    return new Promise((resolve, reject) => {

        query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    var enquery = doc.data();
                    enquiryList.push(enquery);
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

    var thDate = document.createElement("th");
    thDate.textContent = "Date";

    var thEnquiryId = document.createElement("th");
    thEnquiryId.textContent = "Enquiry Id";

    var thCustomer = document.createElement("th");
    thCustomer.textContent = "Customer Details";

    var thSeller = document.createElement("th");
    thSeller.textContent = "Seller Details";

    var thProdcutDetails = document.createElement("th");
    thProdcutDetails.textContent = "Prescription";

    var thPreferredPickupTime = document.createElement("th");
    thPreferredPickupTime.textContent = "Desired Pickiup Time";

    var thTotalPrice = document.createElement("th");
    thTotalPrice.textContent = "Total Price";

    var thPickupFromStore = document.createElement("th");
    thPickupFromStore.textContent = "Pickup From Store";

    var thCOD = document.createElement("th");
    thCOD.textContent = "COD";

    var thPaymentId = document.createElement("th");
    thPaymentId.textContent = "Payment Id";

    var thStatus = document.createElement("th");
    thStatus.textContent = "Status";

    var thRedeemPoints = document.createElement('th');
    thRedeemPoints.textContent = "Wallet Money Used";

    var thNoteToSeller = document.createElement('th');
    thNoteToSeller.textContent = "Buyer's Note";


    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thDate);
    tr.appendChild(thEnquiryId);
    tr.appendChild(thCustomer);
    tr.appendChild(thSeller);
    tr.appendChild(thProdcutDetails);
    tr.appendChild(thPreferredPickupTime);
    tr.appendChild(thTotalPrice);
    tr.appendChild(thStatus);
    tr.appendChild(thPickupFromStore);
    tr.appendChild(thCOD);
    tr.appendChild(thPaymentId);
    tr.appendChild(thRedeemPoints);
    tr.appendChild(thNoteToSeller);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {

    createTableHeaders();

    // table.style.display = "block";

    // var product = new Products(txtProductName.value, txtGST.value, txtPrice.value, txtQty.value);


    for (var i = 0; i < enquiryList.length; i++) {

        var enquiry = enquiryList[i];


        var tr = document.createElement("tr");
        var tdOrderDate = document.createElement('td');
        var tdEnquiryId = document.createElement('td');
        var tdCustomerDetails = document.createElement('td');
        var tdSellerDetails = document.createElement('td');
        var tdProductDetails = document.createElement('td');
        var tdPreferredTime = document.createElement('td');
        var tdStatus = document.createElement('td');
        var tdTotalPrice = document.createElement('td');
        var tdPickupFromStore = document.createElement('td');
        var tdPayByCash = document.createElement('td');
        var tdPaymentId = document.createElement('td');
        var tdWalletMoneyUsed = document.createElement('td');
        var tdNoteToSeller = document.createElement('td');
        var tdAction = document.createElement('td');


        //Order Date
        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = enquiry.timestamp.toDate();
        var dd = ord.getDate();
        var mm = ord.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        var yyyy = ord.getFullYear();
        var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
        orderDate.textContent = formattedDay;
        divOrderDate.appendChild(orderDate);
        tdOrderDate.appendChild(divOrderDate);

        //EnquiryId
        var divEnquiryId = document.createElement('div');
        var spanEnqiry = document.createElement('span');
        spanEnqiry.textContent = enquiry.doc_id;
        divEnquiryId.appendChild(spanEnqiry);
        tdEnquiryId.appendChild(divEnquiryId);

        //Customer Details
        var divCustomerDetails = document.createElement('div');
        var spanCustomerDetails = document.createElement('span');
        spanCustomerDetails.innerHTML = enquiry.customer_name + "<br />Phone No. " + enquiry.customer_phone
            + "<br />" + enquiry.customer_address_line1 + "<br />" + enquiry.customer_address_line2 + "<br/>" + enquiry.customer_address_line3
            + "<br />" + enquiry.customer_city + " - (" + enquiry.customer_state + ")" + "<br />"
            + "Pincode: " + enquiry.customer_pin;

        divCustomerDetails.appendChild(spanCustomerDetails);
        tdCustomerDetails.appendChild(divCustomerDetails);

        //Seller Details
        var divSellerDetails = document.createElement('div');
        var spanSellerDetails = document.createElement('span');
        spanSellerDetails.innerHTML = enquiry.company_name + "<br />Phone No. " + enquiry.seller_phone
            + "<br />" + enquiry.seller_address_line1 + "<br />" + enquiry.seller_address_line2 + "<br/>" + enquiry.seller_address_line3
            + "<br />" + enquiry.seller_city + " - (" + enquiry.seller_state + ")" + "<br />"
            + "Pincode: " + enquiry.seller_pin;

        divSellerDetails.appendChild(spanSellerDetails);
        tdSellerDetails.appendChild(divSellerDetails);


        //prescription details

        if (enquiry.prescription_type == "image") {
            var divPrescriptionDetails = document.createElement("div");
            var urlPrescription = document.createElement('a');
            urlPrescription.href = enquiry.prescription_url;
            urlPrescription.textContent = "Download Prescription";
            urlPrescription.target = "_blank";
            divPrescriptionDetails.appendChild(urlPrescription);
            tdProductDetails.appendChild(divPrescriptionDetails);




            // var prescription = document.createElement("img");
            // prescription.setAttribute("src", enquiry.prescription_url);
            // prescription.setAttribute("height", "200px");
            // prescription.setAttribute("width", "100px");
            // divPrescriptionDetails.appendChild(prescription);
            // tdProductDetails.appendChild(divPrescriptionDetails);
        }
        else if (enquiry.prescription_type == "text" || enquiry.prescription_type == "by_consultation") {
            var divProductDetails = document.createElement('div');
            var spanProductDetails = document.createElement('span');

            var arrProducts = enquiry.product_names;
            var arrQty = enquiry.product_qty;

            for (var idx = 0; idx < arrProducts.length; idx++) {
                var productName = arrProducts[idx];
                var qty = arrQty[idx];

                spanProductDetails.innerHTML += productName + " (" + qty + ")<br/>"
            }

            divProductDetails.appendChild(spanProductDetails);
            tdProductDetails.appendChild(divProductDetails);
        }


        //Product Details



        //Preferred pickup time
        var divPreferredTime = document.createElement('div');

        var spanPickupDate = document.createElement("span");

        var pickupDate = enquiry.pickup_timestamp;


        spanPickupDate.textContent = pickupDate;
        divPreferredTime.appendChild(spanPickupDate);
        tdPreferredTime.appendChild(divPreferredTime);

        var divTotalPrice = document.createElement('div');
        var spanToalPrice = document.createElement('span');

        var total = 0;
        for (var tp = 0; tp < enquiry.product_prices_total.length; tp++) {
            total += enquiry.product_prices_total[tp];
        }
        spanToalPrice.textContent = rupeeSymbol + total.toString();
        divTotalPrice.appendChild(spanToalPrice);
        tdTotalPrice.appendChild(divTotalPrice);


        var divStatus = document.createElement('div');
        var spanStatus = document.createElement("span");

        //Status Code 0: Requested by customer
        //Status Code 1: Accepted by Seller
        //Status Code 2: Rejected by seller
        //Status Code 3: Accepted by Buyer
        //Status Code 4: Rejected by Buyer
        //Status Code 5: Delivered to Buyer
        //Status Code 6: Order Ready for Pickup

        if (enquiry.status_code == 0) {
            spanStatus.textContent = "Pending For Seller Confirmation";
        }

        if (enquiry.status_code == 1) {
            spanStatus.textContent = "Accepted by Seller and Pending for Customer Confirmation";
        }

        if (enquiry.status_code == 2) {
            spanStatus.style.color = "#ff0000";
            var content = "Rejected by seller";

            if (enquiry.seller_rejection_reason != null) {
                content += " (Reason: " + enquiry.seller_rejection_reason + ")";
            }

            spanStatus.textContent = content;

        }

        if (enquiry.status_code == 3) {
            spanStatus.textContent = "Accepted by Buyer";
        }

        if (enquiry.status_code == 4) {
            var content = "Rejected by Buyer";
            if (enquiry.buyer_rejection_reason != null) {
                content += " (Reason: " + enquiry.buyer_rejection_reason + ")";
            }
            spanStatus.style.color = "#ff0000";
            spanStatus.textContent = content;
        }

        if (enquiry.status_code == 5) {
            spanStatus.textContent = "Delivered to Buyer";
        }

        if (enquiry.status_code == 6) {
            spanStatus.textContent = "Order Ready for Pickup";
        }

        divStatus.appendChild(spanStatus);
        tdStatus.appendChild(divStatus);

        var divPickupFromStore = document.createElement('div');
        var spanPickup = document.createElement('span');
        var pickupFromStroe = "No";
        if (enquiry.pickup_from_store) {
            pickupFromStroe = "Yes";
        }
        spanPickup.textContent = pickupFromStroe;
        divPickupFromStore.appendChild(spanPickup);
        tdPickupFromStore.appendChild(divPickupFromStore);


        var divCOD = document.createElement('div');
        var spanCOD = document.createElement('span');
        if(enquiry.status_code == 3 || enquiry.status_code == 5 || enquiry.status_code == 6){
            var payByCash = "No";
            if (enquiry.COD) {
                payByCash = "Yes";
            }
            spanCOD.textContent = payByCash;
           
        }
        else{
            spanCOD.textContent = "-";
        }
        divCOD.appendChild(spanCOD);
        tdPayByCash.appendChild(divCOD);

        var divPaymentId = document.createElement('div');
        var spanPaymentId = document.createElement('span');
        if(enquiry.payment_id == null){
            spanPaymentId.textContent = "null";
        }else{
            spanPaymentId.textContent = enquiry.payment_id;
        }
    
    
        divPaymentId.appendChild(spanPaymentId);
        tdPaymentId.appendChild(divPaymentId);

        var divWalletMoneyUsed = document.createElement('div');
        var spanWalletMoneyUsed = document.createElement('span');
        if(enquiry.status_code == 3 || enquiry.status_code == 5 || enquiry.status_code == 6){
            spanWalletMoneyUsed.textContent = rupeeSymbol +  enquiry.wallet_money_used;
          
        }
        else{
            spanWalletMoneyUsed.textContent = "-";
        }
    
        divWalletMoneyUsed.appendChild(spanWalletMoneyUsed);
        tdWalletMoneyUsed.appendChild(divWalletMoneyUsed);

        var divNoteToSeller = document.createElement('div');
        var spanNoteToSeller = document.createElement('span');
        if (enquiry.note_to_seller == null) {
            spanNoteToSeller.textContent = "-";
        }
        else {
            spanNoteToSeller.textContent = enquiry.note_to_seller;
        }
        divNoteToSeller.appendChild(spanNoteToSeller);
        tdNoteToSeller.appendChild(divNoteToSeller);




        var divAction = document.createElement('div');

        var divPrepareEstimate = document.createElement('div');
        var btnPrepareEstimate = document.createElement("button");
        btnPrepareEstimate.style.width = "150px";
        btnPrepareEstimate.textContent = "Prepare Estimate";
        btnPrepareEstimate.setAttribute("id", i.toString());
        btnPrepareEstimate.setAttribute("type", "button");
        divPrepareEstimate.appendChild(btnPrepareEstimate);
        divAction.appendChild(divPrepareEstimate);

        if (enquiry.prescription_type == "image") {
            var divViewPrescription = document.createElement('div');
            var btnViewPrescription = document.createElement("button");
            btnViewPrescription.style.width = "150px";
            btnViewPrescription.textContent = "View Prescription";
            btnViewPrescription.setAttribute("id", enquiry.prescription_url);
            btnViewPrescription.style.marginTop = "10px";
            btnViewPrescription.setAttribute("type", "button");
            divViewPrescription.appendChild(btnViewPrescription);
            divAction.appendChild(divViewPrescription);
        }

        var divRejectEnquiry = document.createElement('div');
        var btnReject = document.createElement("button");
        divRejectEnquiry.style.marginTop = "10px";
        btnReject.style.width = "150px";
        btnReject.textContent = "Reject";
        btnReject.setAttribute("id", enquiry.doc_id);
        btnReject.setAttribute("type", "button");
        divRejectEnquiry.appendChild(btnReject);
        divRejectEnquiry.style.display = "none";
        divAction.appendChild(divRejectEnquiry);
        if(admin){
            divAction.style.display = "none";
        }

        if(enquiry.status_code == 0){
            divRejectEnquiry.style.display = "block";
        }
        tdAction.appendChild(divAction);

        var divReadyForPickup = document.createElement('div');
        var btnReadyForPickup = document.createElement("button");
        btnReadyForPickup.style.marginTop = "10px";
        btnReadyForPickup.style.width = "150px";
        btnReadyForPickup.textContent = "Ready For Pickup";
        btnReadyForPickup.setAttribute("id", enquiry.doc_id);
        btnReadyForPickup.setAttribute("type", "button");
        divReadyForPickup.appendChild(btnReadyForPickup);
        divReadyForPickup.style.display = "none";
        divAction.appendChild(divReadyForPickup);

        var divIssueInvoice = document.createElement('div');
        var btnIssueInvoice = document.createElement("button");
        btnIssueInvoice.style.marginTop = "10px";
        btnIssueInvoice.style.width = "150px";
        btnIssueInvoice.textContent = "Issue Invoice";
        btnIssueInvoice.setAttribute("id", i.toString());
        btnIssueInvoice.setAttribute("type", "button");
        divIssueInvoice.appendChild(btnIssueInvoice);
        divAction.appendChild(divIssueInvoice);

        var divViewInvoice = document.createElement('div');
        var btnViewInvoice = document.createElement("button");
        btnViewInvoice.style.marginTop = "10px";
        btnViewInvoice.style.width = "150px";
        btnViewInvoice.textContent = "View Invoice";
        btnViewInvoice.setAttribute("id", i.toString());
        btnViewInvoice.setAttribute("type", "button");
        divViewInvoice.appendChild(btnViewInvoice);
        divAction.appendChild(divViewInvoice);


        //2. Rejected by Seller
        //4. Rejected by Buyer
        //5. Delivery Complete

        //estimate can be prepared only for pending enquiries..
        if (enquiry.status_code == 0) {
            console.log("showing prepare estimate");
            divPrepareEstimate.style.display = "block";

        }
        else {
            divPrepareEstimate.style.display = "none";
        }

        if (enquiry.status_code == 3) {
            divPrepareEstimate.style.display = "block";
            btnPrepareEstimate.textContent = "View Estimate";
        }

        //invoice can be viewed only for delivered products
        if (enquiry.status_code == 5) {
            divViewInvoice.style.display = "block";
        }
        else {
            divViewInvoice.style.display = "none";
        }

        if (enquiry.status_code == 2 || enquiry.status_code == 4 || enquiry.status_code == 5 || enquiry.status_code == 6) {
            divRejectEnquiry.style.display = "none";
        }



        if (enquiry.status_code == 3 && enquiry.pickup_from_store) {
            divReadyForPickup.style.display = "block";
        }

        else {
            //show mark delivery button only if it was accepted by buyer or ready for pickup.
            if (enquiry.status_code == 3 || enquiry.status_code == 6) {
                divIssueInvoice.style.display = "block";

            } else {
                divIssueInvoice.style.display = "none";
            }
        }




        //for admin disable mark delivery or reject enquery buttons
        if (admin) {
            divIssueInvoice.style.display = "none";
            divRejectEnquiry.style.display = "none";
            divReadyForPickup.style.display = "none";
        }

        tr.appendChild(tdOrderDate);
        tr.appendChild(tdEnquiryId);
        tr.appendChild(tdCustomerDetails);
        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdProductDetails);
        tr.appendChild(tdPreferredTime);
        tr.appendChild(tdTotalPrice);
        tr.appendChild(tdStatus);
        tr.appendChild(tdPickupFromStore);
        tr.appendChild(tdPayByCash);
        tr.appendChild(tdPaymentId);
        tr.appendChild(tdWalletMoneyUsed);
        tr.appendChild(tdNoteToSeller);
        tr.appendChild(tdAction);

        if (enquiry.status_code == 0) {
            tr.style.background = "#FFC133";
        }

        table.appendChild(tr);

        btnPrepareEstimate.addEventListener("click", function () {
            var id = parseInt(this.id);
            var enquiry = enquiryList[id];
            if (enquiry.prescription_type == "image") {
                openInNewTab("pharmacist_accept_enquiry_prescription.html?docid=" + enquiry.doc_id + "&adm=" + admin + "&et=" + enquiry.prescription_type);
            }
            else {
                openInNewTab("pharmacist_accept_enquiry.html?docid=" + enquiry.doc_id + "&adm=" + admin + "&et=" + enquiry.prescription_type);
            }

        })

        btnReject.addEventListener("click", function () {
            var reason = prompt("Please enter rejection reason");
            if (reason.trim() == "") {
                return;
            }

            rejectEnquiry(this.id, reason);
        })

        btnIssueInvoice.addEventListener("click", function () {
            var index = parseInt(this.id);
            var enquiry = enquiryList[index];
            getCustomerDetails(enquiry.customer_id).then(() => {
                var total = 0;
                for (var tp = 0; tp < enquiry.product_prices_total.length; tp++) {
                    total += enquiry.product_prices_total[tp];
                }

                var bDebit = false;
                //if wallet moeny has been used, debit the points instead of credit
                if(enquiry.wallet_money_used > 0){
                    bDebit = true;
                    total = enquiry.wallet_money_used;
                    var pointsToDebit =  Math.ceil(enquiry.wallet_money_used * mNumberOfPointsInOneRupee);
                    creditAndDebitPoints(enquiry.customer_id, pointsToDebit, bDebit)

                }
                else{
                    common_CreditAndDebitPoints(total, enquiry.customer_id, bDebit);
                }
               
                markDelivery(enquiry.doc_id);
                addProductsToDb(enquiry)

            })


        })

        btnViewInvoice.addEventListener("click", function () {
            var index = parseInt(this.id);
            var enquiry = enquiryList[index];
            window.location.href = "offline_invoice.html?invoiceid=" + enquiry.invoice_id;
        })

        btnReadyForPickup.addEventListener("click", function () {
            updateStatusCode(6, this.id);
        })

        if (enquiry.prescription_type == "image") {
            btnViewPrescription.addEventListener("click", function () {
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    link.setAttribute("href", this.id);
                    link.setAttribute("target", "_blank");
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })

        }

    }
}

function rejectEnquiry(docId, reason) {

    var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
    washingtonRef.update({
        status_code: 2,
        seller_rejection_reason: reason

    })
        .then(function () {
            alert("Enquiry has ben rejected by you!!");
            window.location.href = "medicine_enquiries.html?type=" + mType;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}

function markDelivery(docId) {

    var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
    washingtonRef.update({
        status_code: 5,
        delivery_date: firebase.firestore.FieldValue.serverTimestamp()

    })
        .then(function () {
            alert("Product delivery marked!!");
            // window.location.href = "medicine_enquiries.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}

function updateStatusCode(statusCode, docId) {

    var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
    washingtonRef.update({
        status_code: statusCode

    })
        .then(function () {
            alert("Update Successful!!");
            // window.location.href = "medicine_enquiries.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });
}

function updateInvoiceId(docId) {

    return new Promise((resolve, reject) => {
        var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(docId);
        washingtonRef.update({
            invoice_id: newInvoiceId,
            invoice_timestamp: firebase.firestore.FieldValue.serverTimestamp()

        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                reject();

            });
    })


}

function getCustomerDetails(customerid) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore()
            .collection('users').doc(customerid);


        docRef.get().then(function (doc) {
            if (doc.exists) {
                mCustomer = doc.data();
                resolve();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            reject();
        });

    })
}

//to be uncommented for inovice generation..
function addProductsToDb(enquiry) {
    getNewInvoiceId().then(() => {
        createInvoice(enquiry).then(() => {
            updateInvoiceId(enquiry.doc_id).then(() => {
                window.location.href = "offline_invoice.html?invoiceid=" + newInvoiceId;
            })

        })
    })
}

function createInvoice(enquiry) {

    var statusList = [];
    return new Promise((resolve, reject) => {

        for (var i = 0; i < enquiry.product_names.length; i++) {
            // var product = productList[i];
            // productNames.push(product.productName);
            // gstlist.push(parseInt(product.gst));
            // priceList.push(parseInt(product.price));
            // qtyList.push(parseInt(product.qty));
            if(enquiry.available_status[i] == "Available"){
                statusList.push("success");
            }
            else{
                statusList.push(enquiry.available_status[i]);
            }
        }
        

        var pointsUsedForPurchase = enquiry.wallet_money_used * mNumberOfPointsInOneRupee;
        firebase.firestore().collection('offline_invoices').doc(newInvoiceId).set({
            invoice_id: newInvoiceId,
            customer_id: mCustomer.customer_id,
            seller_id: sellerId,
            points_redeemed: mRedeemPoints,
            seller_name: mSeller.seller_name,
            sellerAddressLine1: mSeller.address_line1,
            sellerAddressLine2: mSeller.address_line2,
            sellerAddressLine3: mSeller.address_line3,
            sellerCity: mSeller.city,
            sellerState: mSeller.state,
            sellerCountry: "INDIA",
            sellerPin: mSeller.pincode,
            sellerPAN: mSeller.pan_no,
            sellerGST: mSeller.gstin,
            seller_mobile: mSeller.mobile,
            seller_email: mSeller.email,
            merchant_id: mSeller.merchant_id,
            company_name: mSeller.company_name,
            bill_to_name: mCustomer.Name,
            bill_to_phone: mCustomer.Phone,
            bill_to_address_line1: mCustomer.AddressLine1,
            bill_to_address_line2: mCustomer.AddressLine2,
            bill_to_address_line3: mCustomer.AddressLine3,
            bill_to_city: mCustomer.City,
            bill_to_pincode: mCustomer.Pincode,
            bill_to_email: mCustomer.Email,
            product_names: enquiry.product_names,
            product_qty: enquiry.product_qty,
            gst_list: enquiry.gst_list,
            price_list: enquiry.product_prices,
            status_list: statusList,
            amount_against_points: 0,
            points_used_for_purchase: pointsUsedForPurchase,
            wallet_money_used: enquiry.wallet_money_used,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.error('Error writing new message to database', error);
                reject();
                return false;
            });
    });
}

function getNewInvoiceId() {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection('offline_invoices')
            .where("seller_id", '==', mSeller.seller_id)
            .orderBy("timestamp", "desc").limit(1)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("invoice found");
                    var invoice = doc.data();
                    var invoiceId = invoice.invoice_id;
                    var tmpInvoice = invoiceId.split('_');
                    var tmpInvoiceId = tmpInvoice[1];
                    var invoiceNum = parseInt(tmpInvoiceId.substring(3, tmpInvoiceId.length));
                    invoiceNum = invoiceNum + 1;
                    var newInvoiceNum = appendNumber(invoiceNum, 3);
                    newInvoiceId = mSeller.merchant_id + "_INS" + newInvoiceNum;
                    resolve();


                });
            })
            .then(function () {
                console.log("no invoice found");
                if (newInvoiceId == null) {
                    newInvoiceId = mSeller.merchant_id + "_INS001";
                    resolve();
                }
            })
            .catch(function (error) {
                console.log(error);
                newInvoiceId = mSeller.merchant_id + "_INS001";
                resolve();
            });


    })

}

function getSellerDetails() {
    return new Promise((resolve, reject) => {
        var docRef = firebase.firestore().collection("seller").doc(sellerId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                mSeller = doc.data();
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


