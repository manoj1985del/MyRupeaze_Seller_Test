
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var table = document.getElementById("tblData");
var rupeeSymbol = "₹ ";

var sellerId = localStorage.getItem("sellerid");
var mSeller;
var enquiryList = [];

var adm = getQueryVariable("adm");
var admin = false;
if (adm == "1") {
    admin = true;
}

getEnquiries();

function getEnquiries() {

    var query;
    if (!admin) {

        query = firebase.firestore().collection("offline_requests")
            .where("seller_id", "==", sellerId)
            .orderBy('timestamp', 'desc');

    }
    else {

        query = firebase.firestore().collection("offline_requests")
            .orderBy('timestamp', 'desc');;
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
    thProdcutDetails.textContent = "Products";

    var thPreferredPickupTime = document.createElement("th");
    thPreferredPickupTime.textContent = "Desired Pickiup Time";

    var thTotalPrice = document.createElement("th");
    thTotalPrice.textContent = "Total Price";

    var thPickupFromStore = document.createElement("th");
    thPickupFromStore.textContent = "Pickup From Store";

    var thPayByCash = document.createElement("th");
    thPayByCash.textContent = "Pay By Cash";

    var thStatus = document.createElement("th");
    thStatus.textContent = "Status";

    var thRedeemPoints = document.createElement('th');
    thRedeemPoints.textContent = "Redeem Points";

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
    tr.appendChild(thPayByCash);
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
        var tdRedeemPoints = document.createElement('td');
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

        //Product Details
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

            if(enquiry.seller_rejection_reason != null){
                content += " (Reason: " + enquiry.seller_rejection_reason + ")";
            }

            spanStatus.textContent = content;

        }

        if (enquiry.status_code == 3) {
            spanStatus.textContent = "Accepted by Buyer";
        }

        if (enquiry.status_code == 4) {
            var content = "Rejected by Buyer";
            if(enquiry.buyer_rejection_reason != null){
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


        var divPayByCash = document.createElement('div');
        var spanPayByCash = document.createElement('span');
        var payByCash = "No";
        if (enquiry.pay_by_cash) {
            payByCash = "Yes";
        }
        spanPayByCash.textContent = payByCash;
        divPayByCash.appendChild(spanPayByCash);
        tdPayByCash.appendChild(divPayByCash);

        var divRedeemPoints = document.createElement('div');
        var spanRedeemPoints = document.createElement('span');
        spanRedeemPoints.textContent = "No";
        if(enquiry.redeem_points){
            spanRedeemPoints.textContent = "Yes";
        }
        divRedeemPoints.appendChild(spanRedeemPoints);
        tdRedeemPoints.appendChild(divRedeemPoints);

        var divNoteToSeller = document.createElement('div');
        var spanNoteToSeller = document.createElement('span');
        if(enquiry.note_to_seller == null){
            spanNoteToSeller.textContent = "-";
        }
        else{
            spanNoteToSeller.textContent = enquiry.note_to_seller;
        }
        divNoteToSeller.appendChild(spanNoteToSeller);
        tdNoteToSeller.appendChild(divNoteToSeller);




        var divAction = document.createElement('div');

        var divViewEnquiry = document.createElement('div');
        var btnAcceptEnquiry = document.createElement("button");
        btnAcceptEnquiry.style.width = "150px";
        btnAcceptEnquiry.textContent = "View Enquiry";
        btnAcceptEnquiry.setAttribute("id", enquiry.doc_id);
        btnAcceptEnquiry.setAttribute("type", "button");
        divViewEnquiry.appendChild(btnAcceptEnquiry);
        divAction.appendChild(divViewEnquiry);

        var divRejectEnquiry = document.createElement('div');
        var btnReject = document.createElement("button");
        divRejectEnquiry.style.marginTop = "10px";
        btnReject.style.width = "150px";
        btnReject.textContent = "Reject";
        btnReject.setAttribute("id", enquiry.doc_id);
        btnReject.setAttribute("type", "button");
        divRejectEnquiry.appendChild(btnReject);
        divAction.appendChild(divRejectEnquiry);
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

        var divMarkDelivry = document.createElement('div');
        var btnMarkDelivery = document.createElement("button");
        btnMarkDelivery.style.marginTop = "10px";
        btnMarkDelivery.style.width = "150px";
        btnMarkDelivery.textContent = "Mark Delivery";
        btnMarkDelivery.setAttribute("id", enquiry.doc_id);
        btnMarkDelivery.setAttribute("type", "button");
        divMarkDelivry.appendChild(btnMarkDelivery);
        divAction.appendChild(divMarkDelivry);


        //2. Rejected by Seller
        //4. Rejected by Buyer
        //5. Delivery Complete
        if (enquiry.status_code == 2 || enquiry.status_code == 4 || enquiry.status_code == 5 || enquiry.status_code == 6) {
            divRejectEnquiry.style.display = "none";
        }

        if (enquiry.status_code == 3 && enquiry.pickup_from_store) {
            divReadyForPickup.style.display = "block";
        }

        else {
            //show mark delivery button only if it was accepted by buyer or ready for pickup.
            if (enquiry.status_code == 3 || enquiry.status_code == 6) {
                divMarkDelivry.style.display = "block";

            } else {
                divMarkDelivry.style.display = "none";
            }
        }


        //for admin disable mark delivery or reject enquery buttons
        if (admin) {
            divMarkDelivry.style.display = "none";
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
        tr.appendChild(tdRedeemPoints);
        tr.appendChild(tdNoteToSeller);
        tr.appendChild(tdAction);

        if (enquiry.status_code == 0) {
            tr.style.background = "#FFC133";
        }

        table.appendChild(tr);

        btnAcceptEnquiry.addEventListener("click", function () {

            openInNewTab("order_accept_enquiries.html?docid=" + this.id + "&adm=" + adm);
        })


        btnReject.addEventListener("click", function () {
            var reason = prompt("Please enter rejection reason");
            if(reason.trim() == ""){
                return;
            }

            rejectEnquiry(this.id, reason);

            
           

        })

        btnMarkDelivery.addEventListener("click", function () {
            markDelivery(this.id);

        })

        btnReadyForPickup.addEventListener("click", function () {
            updateStatusCode(6, this.id);
        })
    }

}

function rejectEnquiry(docId, reason) {

    var washingtonRef = firebase.firestore().collection("offline_requests").doc(docId);
    washingtonRef.update({
        status_code: 2,
        seller_rejection_reason: reason

    })
        .then(function () {
            alert("Enquiry has ben rejected by you!!");
            window.location.href = "order_enquiries.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}

function markDelivery(docId) {
    updateStatusCode(5, docId);
}

function updateStatusCode(statusCode, docId) {

    var washingtonRef = firebase.firestore().collection("offline_requests").doc(docId);
    washingtonRef.update({
        status_code: statusCode

    })
        .then(function () {
            alert("Update Successful!!");
            window.location.href = "order_enquiries.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });
}

// function getSellerDetails() {
//     return new Promise((resolve, reject)=>{
//         var docRef = firebase.firestore().collection("seller").doc(sellerId);
//         docRef.get().then(function (doc) {
//             if (doc.exists) {
//                 mSeller = doc.data();
//                 resolve();
//             } else {
//                 mSeller = null;
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//                 reject();

//             }
//         }).catch(function (error) {
//             seller = null;
//             console.log("Error getting document:", error);
//             reject();
//         });

//     })

// }

