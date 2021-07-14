var sellerList = [];
var allSellerList = [];
var arrSellerCategory = [];
var arrSellerCity = [];
var arrMerchantId = [];
var arrSellerName = [];
var arrAreaPin = [];

var docLimit = 1;
var queryList = [];
var pageIndex = 0;
var lastVisibleDoc;
var paginationFinished = false;
var nextQuery;


var arrSearchBy = [];
var mAppInfo = null;

var cmbSearchBy = document.getElementById("cmbSearchBy");
var divProgress = document.getElementById("divProgress");
var pageHeader = document.getElementById("pageHeader");
var table = document.getElementById("table");
var txtSearch = document.getElementById("txtSearch");
var btnSearch = document.getElementById("btnSearch");
var commision_map = new Map();
var errorMsg = document.getElementById("errorMsg");
var btnPrevious = document.getElementById("btnPrevious");
var btnNext = document.getElementById('btnNext');
var sellerProductMap = new Map();

var sellerOrderMap = new Map();
var doctorConsultationMap = new Map();
var pharmacyOrdersMap = new Map();
var ordersProductMap = new Map();
var ordersTobeSettled = new Map();
var amountTobeSettled = new Map();
var amoutnTobeSettledWithDocs = new Map();
var freezeStartDate;
var freezeEndDate;
var dtFreezeWindowStart = null;
var sellerAndAccountMap = new Map();

class SettleAccountProps {
    constructor(freezeDateStart, totalOrders, totalValue, cancelledOrders, cancelledOrdersValue,
        returnedOrders, returnedOrdersValue) {
        this.freezeDateStart = freezeDateStart;
        this.totalOrders = totalOrders;
        this.totalValue = totalValue;
        this.cancelledOrders = cancelledOrders;
        this.cancelledOrdersValue = cancelledOrdersValue;
        this.returnedOrders = returnedOrders;
        this.returnedOrdersValue = returnedOrdersValue;
    }
}

var type = getQueryVariable("type");
var mSellerType = getQueryVariable("sellerType");
var query = "";

loadSellerTags();

cmbSearchBy.addEventListener("change", function () {

    if (this.value == "None") {
        loadOrdersAndProductForSellers(sellerList);
    }

    if (this.value == "Seller Name") {
        arrSearchBy = mSellerTags.seller_names;
    }

    if (this.value == "Seller City") {
        arrSearchBy = mSellerTags.seller_cities;
    }

    if (this.value == "Seller Category") {
        arrSearchBy = mSellerTags.seller_categories;
    }

    if (this.value == "Merchant Id") {
        arrSearchBy = mSellerTags.seller_merchant_id_list;
    }

    if (this.value == "Area Pin") {
        arrSearchBy = mSellerTags.seller_area_pins;
    }

    autocomplete(txtSearch, arrSearchBy);

})

console.log(type);

prepareQuery(type, true);

loadSellers(query).then(() => {

    if (sellerList.length > 0) {
        prepareQuery(type, false);
        if (mSellerType == "seller") {
            loadComissionMap().then(() => {
                loadOrdersAndProductForSellers(sellerList);
            })
        }
        else {
            getAppInfo().then(() => {
                loadOrdersAndProductForSellers(sellerList);
            })

        }
    }
    // query = firebase.firestore().collection("seller");
});

btnNext.addEventListener("click", function () {
    sellerList = [];
    deleteTableRows();
    var nextQuery = queryList[pageIndex + 1];
    pageIndex++;
    loadSellers(nextQuery).then(() => {
        prepareQuery(type, false);
        loadOrdersAndProductForSellers(sellerList);



        if (pageIndex > 0) {
            btnPrevious.style.display = "block";
        }
        else {
            btnPrevious.style.display = "none";
        }

    })

})

btnPrevious.addEventListener("click", function () {
    sellerList = [];
    deleteTableRows();

    var prevQuery = queryList[pageIndex - 1];
    loadSellers(prevQuery).then(() => {
        loadOrdersAndProductForSellers(sellerList);
        pageIndex--;

        if (pageIndex == 0) {
            btnPrevious.style.display = "none";
        } else {
            btnPrevious.style.display = "block";
        }
    })

})



btnSearch.addEventListener("click", function () {


    sellerList = [];
    deleteTableRows();
    if (cmbSearchBy.value == "Seller Name") {
        prepareSearchQuery(type, "company_name", txtSearch.value);
       
    }

    if (cmbSearchBy.value == "Seller City") {
        prepareSearchQuery(type, "city", txtSearch.value);
    }

    if (cmbSearchBy.value == "Seller Category") {
        prepareSearchQuery(type, "seller_category", txtSearch.value);
    }

    if (cmbSearchBy.value == "Merchant Id") {
        prepareSearchQuery(type, "merchant_id", txtSearch.value);
    }

    if (cmbSearchBy.value == "Area Pin") {
        prepareSearchQuery(type, "seller_area_pin", txtSearch.value);
    }

    loadSellers(query).then(() => {
        loadOrdersAndProductForSellers(sellerList);
    })

    //loadOrdersAndProductForSellers(localSellerList);

})

// loadSellers(sellerList).then(() => {
//     if (sellerList.length > 0) {
//         loadComissionMap().then(() => {
//             loadOrdersAndProductForSellers();
//         })
//     }
// })

function loadOrdersAndProductForSellers(sellerList) {
    console.log(sellerList);
    var promiseList = [];
    for (var i = 0; i < sellerList.length; i++) {
        var seller = sellerList[i];
        if (seller.sellerType == "seller") {
            promiseList.push(getUnSettledOrders(seller));
        }
        else if (seller.sellerType == "pharmacist") {
            promiseList.push(getUnsettledPharmaOrders(seller));
        }
        else if (seller.sellerType == "doctor") {

            promiseList.push(getUnSettledConsultation(seller));
        }

    }
    Promise.all(promiseList).then(() => {
        divProgress.style.display = "none";
        divContent.style.display = "block";
        console.log(seller);
        if (seller.sellerType == "seller") {
            drawTable(sellerList);
        }
        else if (seller.sellerType == "pharmacist") {
            createPharmacyTable(sellerList);
        }
        else {
            createDoctorsTable(sellerList);
        }

    })
}
//Load Sellers
function loadSellers(query) {
    return new Promise((resolve, reject) => {
        pageHeader.textContent = "Seller Listing";
        divContent.style.display = "block";
        divProgress.style.display = "block";

        query
            .get()
            .then(function (querySnapshot) {

                if (querySnapshot.docs.length < docLimit) {
                    btnNext.style.display = "none";
                } else {
                    btnNext.style.display = "block";
                }

                if (querySnapshot.length > 1 && querySnapshot.docs.length == 0) {
                    divErrorMsg.style.display = "block";
                    errMsg.textContent = "No further rows to display";

                    //pageIndex++;
                    //  console.log("increased page index to:" + pageIndex);
                    btnNext.style.display = "none";
                    return;
                }

                if (querySnapshot.docs.length == 0) {
                    divContent.style.display = "none";
                    divProgress.style.display = "none";
                    errorMsg.textContent = "No Record Found";

                }
                lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];


                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    errorMsg.style.display = "none";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";
                    var seller = doc.data();
                    sellerList.push(seller);

                    if (!arrSellerCategory.includes(seller.seller_category)) {
                        arrSellerCategory.push(seller.seller_category);
                    }

                    if (!arrSellerCity.includes(seller.city)) {
                        arrSellerCity.push(seller.city);
                    }

                    if (!arrMerchantId.includes(seller.merchant_id)) {
                        arrMerchantId.push(seller.merchant_id);
                    }

                    if (!arrSellerName.includes(seller.company_name)) {
                        arrSellerName.push(seller.company_name);
                    }

                    if (!arrAreaPin.includes(seller.seller_area_pin)) {
                        arrAreaPin.push(seller.seller_area_pin);
                    }


                });
            }).then(function () {
                console.log("loaded sellers.. resolving");
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}

function loadAllSellers() {
    return new Promise((resolve, reject) => {
        pageHeader.textContent = "Seller Listing";

        firebase.firestore().collection("seller")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var seller = doc.data();
                    allSellerList.push(seller);




                });
            }).then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}


function getUnSettledOrders(seller) {


    return new Promise((resolve, reject) => {
        var orderList = [];
        var promiseList = [];
        firebase.firestore().collection("orders")
            .where("seller_id", "==", seller.seller_id)
            .where("settlement_done", "==", false)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var order = doc.data();
                    orderList.push(order);
                    promiseList.push(fetchProductsForOrder(order));
                });
            }).then(() => {
                Promise.all(promiseList).then(() => {
                    sellerOrderMap.set(seller.seller_id, orderList);
                    resolve();
                })

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    })
}

function fetchProductsForOrder(order) {
    return new Promise((resolve, reject) => {

        var productList = [];
        var query = firebase.firestore()
            .collection('orders').doc(order.order_id).collection("products");

        query.get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    var product = doc.data();
                    productList.push(product);
                })
            }).then(function () {
                ordersProductMap.set(order.order_id, productList);
                resolve();
            });

    })
}

function loadComissionMap() {
    return new Promise((resolve, reject) => {
        {

            var docRef = firebase.firestore().collection("commission").doc("35zAmgEt2EkrMGb0uzqs");

            docRef.get().then(function (doc) {
                if (doc.exists) {
                    var commission = doc.data();
                    var pf = commission.commision_map;

                    for (const property in pf) {
                        var propertyName = `${property}`;
                        var propertyValue = `${pf[property]}`;
                        commision_map.set(propertyName, propertyValue);
                    }
                    resolve();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    resolve();
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
                reject();
            });

        }
    })

}


function createTableHeaders() {
    var tr = document.createElement('tr');

    var docImage = document.createElement('th');
    var sellerDetailsHeader = document.createElement("th");
    var sellerAddressHeader = document.createElement("th");
    var bankDetailsHeader = document.createElement("th");
    var freezedAmountHeader = document.createElement('th');
    var disbursableAmountHeader = document.createElement('th');
    var freezedCommissionHeader = document.createElement('th');
    var availableCommissionHeader = document.createElement('th');
    var statusHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    docImage.innerHTML = "Image";
    sellerDetailsHeader.innerHTML = "Seller Details";
    sellerAddressHeader.innerHTML = "Address";
    bankDetailsHeader.innerHTML = "Bank Details";
    freezedAmountHeader.innerHTML = "Freezed Amount";
    disbursableAmountHeader.innerHTML = "Disbursable Amount";
    freezedCommissionHeader.innerHTML = "Freezed Commission";
    availableCommissionHeader.innerHTML = "Available Commission";
    statusHeader.innerHTML = "Status";
    actionHeader.innerHTML = "Action";

    if (mSellerType == "doctor") {
        tr.appendChild(docImage);
        sellerDetailsHeader.innerHTML = "Doctor Details";
    }
    tr.appendChild(sellerDetailsHeader);
    tr.appendChild(sellerAddressHeader);
    tr.appendChild(bankDetailsHeader);
    if (mSellerType != "doctor") {
        tr.appendChild(freezedAmountHeader);
    }

    tr.appendChild(disbursableAmountHeader);

    if (mSellerType != "doctor") {
        tr.appendChild(freezedCommissionHeader);
    }

    tr.appendChild(availableCommissionHeader);
    tr.appendChild(statusHeader);
    tr.appendChild(actionHeader);

    table.appendChild(tr);
}

function getDaysInMonth(month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    month = month + 1;
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

function drawTable(sellerList) {
    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < sellerList.length; i++) {

        var tr = document.createElement("tr");

        var tdDocImage = document.createElement('td');
        var tdSellerDetails = document.createElement("td");
        var tdSellerAddress = document.createElement("td");
        var tdBankDetails = document.createElement("td");
        var tdFreezedAmount = document.createElement('td');
        var tdDisbursableAmount = document.createElement('td');
        var tdFreezedCommission = document.createElement("td");
        var tdAvailableCommission = document.createElement("td");
        var tdStatus = document.createElement("td");
        var tdAction = document.createElement("td");

        var seller = sellerList[i];
        if (seller.sellerType == "admin") {
            continue;
        }

        var divDocImage = document.createElement('div');
        if (mSellerType == "doctor") {
            var imgDoc = document.createElement('img');
            imgDoc.style.width = "100px";
            imgDoc.style.height = "100px";
            imgDoc.src = seller.doctor_img_url;
            divDocImage.appendChild(imgDoc);
            tdDocImage.appendChild(divDocImage);
        }

        //ADD SELLER DETAILS
        var divSellerDetails = document.createElement("div");
        var spanSellerDetails = document.createElement("span");

        var subscriptionStatus = "<b>Subscription Status:</b> Not Subscribed";

        if (seller.subscription_end_date != null) {
            var ord = seller.subscription_end_date.toDate();
            var dd = ord.getDate();
            var mm = ord.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            var yyyy = ord.getFullYear();
            var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setMilliseconds(0);
            today.setSeconds(0);

            if (today > seller.subscription_end_date.toDate()) {
                subscriptionStatus = "<b>Subscription Status:</b> Expired <br/> <b>Subscription Expired On:</b>" + formattedDay
            }

            else {
                subscriptionStatus = "<b>Subscription Status:</b> Active <br/> <b>Subscription Valid Till:</b>" + formattedDay
            }
        }



        var details = "<b> Company Name: " + seller.company_name + "</b><br />"
            + "Name: " + seller.seller_name + "<br/> <br />"

            + "<b>Contact No. </b>" + seller.mobile + "<br />"
            + "Email: " + seller.email + "<br />"
            + "Merchant id: " + seller.merchant_id + "<br/>"
            + "Seller id: " + seller.seller_id + "<br/>"
            + "GST: " + seller.gstin + "<br /><br />" + subscriptionStatus;


        if (mSellerType == "doctor") {
            details += "<br /> <br /><b>Consultation Charges: </b>" + rupeeSymbol + seller.charges
                + "<br /><b>Speciality: </b>" + seller.speciality
                + "<br /><b>Degrees: </b> " + seller.degrees;
        }




        spanSellerDetails.innerHTML = details;
        divSellerDetails.appendChild(spanSellerDetails);

        //SELLER ADDRESS
        var divSellerAddress = document.createElement("div");
        var sellerAddressSpan = document.createElement("span");
        var address = seller.address_line1 + "<br/>"
            + seller.address_line2 + "<br />"
            + seller.address_line3 + "<br /> <br />"
            + seller.city + " - " + seller.state + "<br />"
            + "Pincode: " + seller.pincode;

        sellerAddressSpan.innerHTML = address;
        divSellerAddress.appendChild(sellerAddressSpan);

        //BANK DETAILS
        var divBankDetails = document.createElement("div");
        var bankDetailsSpan = document.createElement("span");
        var bankdetails = "Account Holder Name: " + seller.account_holder_name + "<br/><br/>"
            + "<b>Account Number: " + seller.account_no + "</b><br/>"

            + "Bank Name: " + seller.bank_name + "<br />"
            + "IFSC Code: " + seller.ifsc + "<br />"
            + "PAN No." + seller.pan_no;

        bankDetailsSpan.innerHTML = bankdetails;
        divBankDetails.appendChild(bankDetailsSpan);

        //SELLER STATUS
        var divStatus = document.createElement("div");
        var statusSpan = document.createElement("span");
        statusSpan.innerHTML = seller.status;
        divStatus.appendChild(statusSpan);

        //create divs for amount fields
        var divFreezedAmount = document.createElement("div");
        var divDisbursableAmount = document.createElement("div");
        var divFreezedCommission = document.createElement("div");
        var divAvailableCommission = document.createElement("div");

        var freezedAmount = 0;
        var disbursableAmount = 0;
        var freezedCommission = 0;
        var availableCommission = 0;
        var arrOrders = [];

        var orderList = sellerOrderMap.get(seller.seller_id);
        for (var orderNumber = 0; orderNumber < orderList.length; orderNumber++) {

            var order = orderList[orderNumber];
            //if order was a cancelled one.. no need to process it
            if (order.cancelled == true) {
                // ordersTobeSettled.set(seller.seller_id, order);
                continue;
            }
            var deliveryDate = order.delivery_date;
            var productList = ordersProductMap.get(order.order_id);

            var freezedAmountTemp = 0;
            var freezedCommissionTemp = 0;
            var disbursableAmountTemp = 0;
            var availableCommissionTemp = 0;
            for (var productNumber = 0; productNumber < productList.length; productNumber++) {
                var product = productList[productNumber];
                var amtToReduce = 0;
                if (product.return_requested && product.return_processed) {
                    amtToReduce = product.return_amount;
                }

                if (product.cancelled_by_seller) {
                    product.Offer_Price = 0;
                }

                var commission = commision_map.get(product.Category);
                var offer_price = product.Offer_Price * product.Qty;
                offer_price = offer_price - amtToReduce;
                var commission_value = (offer_price * commission) / 100;

                //If product is not delivered yet.. it will fall in freezed category
                if (deliveryDate == null) {
                    freezedAmountTemp += offer_price;
                    freezedCommissionTemp += commission_value;
                }
                else {
                    var dtDelivery = deliveryDate.toDate();

                    var dtCurrent = new Date();
                    var day = dtCurrent.getDate();
                    var month = dtCurrent.getMonth();
                    var year = dtCurrent.getFullYear();
                    if (month == 12) {
                        year = dtCurrent.getFullYear() - 1;
                    }

                    //var dtFreezeWindowStart;
                    if (day < 16) {
                        month = dtCurrent.getMonth() - 1;

                        dtFreezeWindowStart = new Date(year, month, 16);
                        //   dtFreezeWindowEnd = new Date(year, month, numberofDays);
                    }
                    else {
                        month = dtCurrent.getMonth();
                        year = dtCurrent.getFullYear();
                        //jaise hi 16 tarikh aayegi freezing window current month ki 1 tarikh se start ho jayegi
                        //aur ussey pehle ke sabhi orders available me aa jayege
                        dtFreezeWindowStart = new Date(year, month, 1);
                        var numberofDays = getDaysInMonth(month, year);
                        //if this is last day of the month move the orders from 1 to 15 in available range
                        if (day == numberofDays) {
                            dtFreezeWindowStart = new Date(year, month, 16);
                        }
                    }

                    //All the orders that were delivered before freezing window started will be available for disbursement
                    if (dtDelivery < dtFreezeWindowStart) {
                        disbursableAmountTemp += offer_price;
                        availableCommissionTemp += commission_value;
                        arrOrders.push(order);

                    }
                    else {
                        freezedAmountTemp += offer_price;
                        freezedCommissionTemp += commission_value;
                    }


                }

            }

            var tradeChargesFreezed = 28;
            var tradeChargesAvailable = 28;

            if (freezedAmountTemp == 0) {
                tradeChargesFreezed = 0;
            }

            if (disbursableAmountTemp == 0) {
                tradeChargesAvailable = 0;
            }

            var freezedDeductionsTaxable = freezedCommissionTemp + tradeChargesFreezed;
            var freezedTaxes = freezedDeductionsTaxable * 18 / 100;
            var freezedDeductions = freezedDeductionsTaxable + freezedTaxes;
            freezedAmount += freezedAmountTemp - freezedDeductions;
            freezedCommission += freezedDeductions;

            var disbursableDeductionsTaxable = availableCommissionTemp + tradeChargesAvailable;
            var disbursableTaxes = disbursableDeductionsTaxable * 18 / 100;
            var disbursableDeductions = disbursableDeductionsTaxable + disbursableTaxes;
            disbursableAmount += disbursableAmountTemp - disbursableDeductions;
            availableCommission += disbursableDeductions;


        }



        ordersTobeSettled.set(seller.seller_id, arrOrders);
        amountTobeSettled.set(seller.seller_id, disbursableAmount);

        var divAction = document.createElement("div");
        //Disable account button
        var divSuspendAccount = document.createElement("div");
        var btnSuspendAccount = document.createElement("button");
        btnSuspendAccount.textContent = "Suspend Account";
        btnSuspendAccount.setAttribute("id", i.toString());
        btnSuspendAccount.style.marginBottom = "10px";
        btnSuspendAccount.style.width = "150px";
        divSuspendAccount.appendChild(btnSuspendAccount);
        divAction.appendChild(divSuspendAccount);

        //Approve button
        var divApprove = document.createElement("div");
        var btnApprove = document.createElement("button");
        btnApprove.textContent = "Approve";
        btnApprove.style.width = "150px";
        btnApprove.setAttribute("id", i.toString());
        btnApprove.style.marginBottom = "10px";
        divApprove.appendChild(btnApprove);

        var divDownloadGSt = document.createElement("div");
        var btnDownloadGST = document.createElement("button");
        btnDownloadGST.textContent = "Download GST";
        btnDownloadGST.style.width = "150px";
        btnDownloadGST.setAttribute("id", i.toString());
        btnDownloadGST.style.marginBottom = "10px";
        divDownloadGSt.appendChild(btnDownloadGST);
        divApprove.appendChild(divDownloadGSt);

        var divDownloadCheque = document.createElement("div");
        var btnDownloadCheque = document.createElement("button");
        btnDownloadCheque.textContent = "Download Cheque";
        btnDownloadCheque.style.width = "150px";
        btnDownloadCheque.setAttribute("id", i.toString());
        btnDownloadCheque.style.marginBottom = "10px";
        divDownloadCheque.appendChild(btnDownloadCheque);
        divApprove.appendChild(divDownloadCheque);

        var divReject = document.createElement("div");
        var btnReject = document.createElement("button");
        btnReject.textContent = "Reject Application";
        btnReject.style.width = "150px";
        btnReject.setAttribute("id", i.toString());
        btnReject.style.marginBottom = "10px";
        divReject.appendChild(btnReject);
        divApprove.appendChild(divReject);

        var divDoctorDegrees = document.createElement('div');
        var btnViewDocDegree = document.createElement("button");
        btnViewDocDegree.textContent = "View Degree";
        btnViewDocDegree.style.width = "150px";
        btnViewDocDegree.setAttribute("id", i.toString());
        btnViewDocDegree.style.marginBottom = "10px";
        divDoctorDegrees.appendChild(btnViewDocDegree);
        divDoctorDegrees.style.display = "none";
        divApprove.appendChild(divDoctorDegrees);

        if (mSellerType == "doctor") {
            divDoctorDegrees.style.display = "block";
        }

        divAction.appendChild(divApprove);

        //Unsettled orders button button
        var divUnsettledOrders = document.createElement("div");
        var btnUnsettledOrders = document.createElement("button");
        btnUnsettledOrders.textContent = "Unsettled Orders";
        btnUnsettledOrders.style.width = "150px";
        btnUnsettledOrders.setAttribute("id", i.toString());
        btnUnsettledOrders.style.marginBottom = "10px";
        divUnsettledOrders.appendChild(btnUnsettledOrders);
        if (mSellerType == "doctor") {
            btnUnsettledOrders.textContent = "Unsettled Appointments";
        }

        var divSettleAccount = document.createElement("div");
        var btnSettleAccount = document.createElement("button");
        btnSettleAccount.textContent = "Settle Accounts";
        btnSettleAccount.style.width = "150px";
        btnSettleAccount.setAttribute("id", i.toString());
        btnSettleAccount.style.marginBottom = "10px";
        divSettleAccount.appendChild(btnSettleAccount);
        divUnsettledOrders.appendChild(divSettleAccount);
        divAction.appendChild(divUnsettledOrders);

        var divOfflineOrders = document.createElement("div");
        var btnOfflineInvoices = document.createElement("button");
        btnOfflineInvoices.textContent = "Offline Orders";
        btnOfflineInvoices.style.width = "150px";
        btnOfflineInvoices.setAttribute("id", i.toString());
        btnOfflineInvoices.style.marginBottom = "10px";
        divOfflineOrders.appendChild(btnOfflineInvoices);
        divUnsettledOrders.appendChild(divOfflineOrders);
        divAction.appendChild(divUnsettledOrders);

        var divOnlineOrders = document.createElement("div");
        var btnOnlineOrders = document.createElement("button");
        btnOnlineOrders.textContent = "Online Orders";
        btnOnlineOrders.style.width = "150px";
        btnOnlineOrders.setAttribute("id", i.toString());
        btnOnlineOrders.style.marginBottom = "10px";
        divOnlineOrders.appendChild(btnOnlineOrders);
        divUnsettledOrders.appendChild(divOnlineOrders);
        divAction.appendChild(divUnsettledOrders);


        if (seller.status == "pending" || seller.status == "suspended" || seller.status == "rejected") {
            divApprove.style.display = "block";
            divSuspendAccount.style.display = "none";
            divUnsettledOrders.style.display = "none";

            if (seller.status == "suspended") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Suspension Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);


            }

            if (seller.status == "rejected") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Rejection Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);
            }
        }

        else {
            divApprove.style.display = "none";
            divSuspendAccount.style.display = "block";
            divUnsettledOrders.style.display = "block";
        }

        if (disbursableAmount == 0) {
            btnSettleAccount.disabled = true;
        }




        var spanFreezeAmount = document.createElement("span");
        spanFreezeAmount.innerHTML = freezedAmount.toFixed(2);
        divFreezedAmount.appendChild(spanFreezeAmount);

        var spanDisbursableAmount = document.createElement("span");
        spanDisbursableAmount.innerHTML = disbursableAmount.toFixed(2);
        divDisbursableAmount.appendChild(spanDisbursableAmount);

        var spanFreezedCommission = document.createElement("span");
        spanFreezedCommission.innerHTML = freezedCommission.toFixed(2);
        divFreezedCommission.appendChild(spanFreezedCommission);

        var spanAvailablecommission = document.createElement("span");
        spanAvailablecommission.innerHTML = availableCommission.toFixed(2);
        divAvailableCommission.appendChild(spanAvailablecommission);

        tdSellerDetails.appendChild(divSellerDetails);
        tdSellerAddress.appendChild(divSellerAddress);
        tdBankDetails.appendChild(divBankDetails);
        tdFreezedAmount.appendChild(divFreezedAmount);
        tdFreezedCommission.appendChild(divFreezedCommission);
        tdDisbursableAmount.appendChild(divDisbursableAmount);
        tdAvailableCommission.appendChild(divAvailableCommission);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        if (mSellerType == "doctor") {
            tr.appendChild(tdDocImage);
        }
        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdSellerAddress);
        tr.appendChild(tdBankDetails);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedAmount);
        }

        tr.appendChild(tdDisbursableAmount);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedCommission);
        }

        tr.appendChild(tdAvailableCommission);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        //Click Handlers

        btnOfflineInvoices.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_view_offline_invoice.html?sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnOnlineOrders.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_orders.html?type=all&sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnSuspendAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            if (!confirm("Are you sure you want to suspend this account?\nAll the products of this seller will not be shown to buyers for purchase.")) {
                return;
            }

            var reason = prompt("Please enter suspension Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "suspended",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendAccountDisableMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })

        btnReject.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            var reason = prompt("Please enter rejection Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "rejected",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendApplicationRejectionMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })


        btnApprove.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, true));
                }

                Promise.all(promiseList).then(() => {
                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "approved"
                    })
                        .then(function () {
                            sendWelcomeEmail(seller);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });


                })

            })

        })

        btnDownloadGST.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.gst_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })

        btnViewDocDegree.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");

            if (link.download !== undefined) {
                link.setAttribute("href", seller.degree_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


        })


        btnDownloadCheque.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.cheque_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        })

        btnUnsettledOrders.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_orders.html?type=unsettled&sellerid=" + seller.seller_id;
            if (mSellerType == "doctor") {
                href = "pending_appointments.html?type=unsettled&sellerType=admin";
            }

            window.open(href, "_blank");
        })

        btnSettleAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var amount = amountTobeSettled.get(seller.seller_id);
            var amt = amount.toFixed(2);

            var msg = "You are about to settle the amount of - " + amt + " with seller - " + seller.company_name + ".\nDo you wish to continue?";

            if (!confirm(msg)) {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            //var orderList = map
            var orderList = ordersTobeSettled.get(seller.seller_id);
            var promiseList = [];
            for (var i = 0; i < orderList.length; i++) {
                var order = orderList[i];
                promiseList.push(settleOrders(order));
            }
            Promise.all(promiseList).then(() => {
                var formattedDate = formatDate(dtFreezeWindowStart);
                sendAccountSettlementEmail(seller, formattedDate, amt);
                window.location.href = "admin_seller_listing.html?type=all";

            })


        })
    }
}

function settleOrders(order) {


    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("orders").doc(order.order_id);
        washingtonRef.update({
            settlement_done: true,
            settlement_date: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log(error);
                reject();
                // The document probably doesn't exist.

            });

    })



}


function settleConsultation(consultation) {


    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("consultations").doc(consultation.consultation_id);
        washingtonRef.update({
            settlement_done: true,
            settlement_date: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log(error);
                reject();
                // The document probably doesn't exist.

            });

    })



}

function getSellerProducts(seller) {

    return new Promise((resolve, reject) => {

        var productList = [];
        var prodList = sellerProductMap.get(seller.seller_id);
        if (prodList != null) {
            resolve();
            return;
        }
        firebase.firestore().collection("products").where("seller_id", "==", seller.seller_id)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var product = doc.data();
                    productList.push(product);
                });
            })
            .then(() => {
                sellerProductMap.set(seller.seller_id, productList);
                resolve();

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}

function enableProducts(product_id, bEnable) {

    var washingtonRef = firebase.firestore().collection("products").doc(product_id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        Active: bEnable
    })
        .then(function () {
            console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}

function getMonthNmae(index) {
    var monthName;
    switch (index) {
        case 1:
            monthName = "Jan";
            break;

        case 2:
            monthName = "Feb";
            break;

        case 3:
            monthName = "Mar";
            break;

        case 4:
            monthName = "Apr";
            break;

        case 5:
            monthName = "May";
            break;

        case 6:
            monthName = "Jun";
            break;

        case 7:
            monthName = "July";
            break;

        case 8:
            monthName = "Aug";
            break;

        case 9:
            monthName = "Sep";
            break;

        case 10:
            monthName = "Oct";
            break;

        case 11:
            monthName = "Nov";
            break;

        case 12:
            monthName = "Dec";
            break;
    }

    return monthName;
}

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function formatDate(date) {


    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var year = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + year;

    return formattedDay;

}

function sendWelcomeEmail(seller) {

    var msg = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We are glad to inform you that your request has been approved and henceforth you are eligible to sell products at our platform. </p>"
        + "<p>To start with, you need to add your products so that those are visible to our buyers.</p>"
        + "<p>Wish you good luck!!</p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    console.log("going to send email");
    sendEmail(seller.email, "My Rupeaze Seller Account Approval", msg);

}

function sendAccountDisableMail(seller, reason) {

    var msg = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We regret to inform you that we have suspended your account for below reason - </p>"
        + "<p><b>Reason:" + reason + "</b></p>"
        + "<p>For more information please call us on our toll free number - <b> 1800 212 1484 </b></p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    console.log("going to send email");
    sendEmail(seller.email, "My Rupeaze Account Suspended!!", msg);

}

function sendApplicationRejectionMail(seller, reason) {

    var msg = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We regret to inform you that your application has been rejected due to below reason - </p>"
        + "<p><b>Reason:" + reason + "</b></p>"
        + "<p>Please update this information in the form and submit.</p>"
        + "<p>Alternatively,  you may reach us our toll free number - <b> 1800 212 1484 </b> for any further assistance.</p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    console.log("going to send email");
    sendEmail(seller.email, "My Rupeaze Seller Application Rejected!!", msg);

}

function sendAccountSettlementEmail(seller, dtStart, amount) {

    var msg = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We are pleased to inform you that we have deposited the amount of <b>" + amount + "</b> in your bank account against the orders"
        + " received before date - <b> " + dtStart + "</b></p>"
        + "<p>For any queries call us on our toll free number - <b> 1800 212 1484 </b></p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    console.log("going to send email");
    sendEmail(seller.email, "My Rupeaze Account Settlement", msg);

}

function sendDocsSettlementEmail(seller, amount) {

    var msg = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We are pleased to inform you that we have deposited the amount of <b>" + amount + "</b> in your bank account against your consultations"
        + "<p>For any queries call us on our toll free number - <b> 1800 212 1484 </b></p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    console.log("going to send email");
    sendEmail(seller.email, "My Rupeaze Account Settlement", msg);

}

function createTableHeadersForDoctors() {
    var tr = document.createElement('tr');

    var docImage = document.createElement('th');
    var sellerDetailsHeader = document.createElement("th");
    var sellerAddressHeader = document.createElement("th");
    var bankDetailsHeader = document.createElement("th");
    var freezedAmountHeader = document.createElement('th');
    var disbursableAmountHeader = document.createElement('th');
    var freezedCommissionHeader = document.createElement('th');
    var availableCommissionHeader = document.createElement('th');
    var statusHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    docImage.innerHTML = "Image";
    sellerDetailsHeader.innerHTML = "Seller Details";
    sellerAddressHeader.innerHTML = "Address";
    bankDetailsHeader.innerHTML = "Bank Details";
    freezedAmountHeader.innerHTML = "Freezed Amount";
    disbursableAmountHeader.innerHTML = "Disbursable Amount";
    freezedCommissionHeader.innerHTML = "Freezed Commission";
    availableCommissionHeader.innerHTML = "Available Commission";
    statusHeader.innerHTML = "Status";
    actionHeader.innerHTML = "Action";

    if (mSellerType == "doctor") {
        tr.appendChild(docImage);
        sellerDetailsHeader.innerHTML = "Doctor Details";
    }
    tr.appendChild(sellerDetailsHeader);
    tr.appendChild(sellerAddressHeader);
    tr.appendChild(bankDetailsHeader);
    if (mSellerType != "doctor") {
        tr.appendChild(freezedAmountHeader);
    }

    tr.appendChild(disbursableAmountHeader);

    if (mSellerType != "doctor") {
        tr.appendChild(freezedCommissionHeader);
    }

    tr.appendChild(availableCommissionHeader);
    tr.appendChild(statusHeader);
    tr.appendChild(actionHeader);

    table.appendChild(tr);
}

function createDoctorsTable() {
    createTableHeadersForDoctors();

    var disbursableAmount = 0;
    for (var i = 0; i < sellerList.length; i++) {

        var tr = document.createElement("tr");

        var tdDocImage = document.createElement('td');
        var tdSellerDetails = document.createElement("td");
        var tdSellerAddress = document.createElement("td");
        var tdBankDetails = document.createElement("td");
        var tdDisbursableAmount = document.createElement('td');
        var tdAvailableCommission = document.createElement("td");
        var tdStatus = document.createElement("td");
        var tdAction = document.createElement("td");

        var seller = sellerList[i];
        if (seller.sellerType == "admin") {
            continue;
        }

        var divDocImage = document.createElement('div');
        var imgDoc = document.createElement('img');
        imgDoc.style.width = "100px";
        imgDoc.style.height = "100px";
        imgDoc.src = seller.doctor_img_url;
        divDocImage.appendChild(imgDoc);
        tdDocImage.appendChild(divDocImage);


        //ADD SELLER DETAILS
        var divSellerDetails = document.createElement("div");
        var spanSellerDetails = document.createElement("span");

        var subscriptionStatus = "<b>Subscription Status:</b> Not Subscribed";

        if (seller.subscription_end_date != null) {
            var ord = seller.subscription_end_date.toDate();
            var dd = ord.getDate();
            var mm = ord.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            var yyyy = ord.getFullYear();
            var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setMilliseconds(0);
            today.setSeconds(0);

            if (today > seller.subscription_end_date.toDate()) {
                subscriptionStatus = "<b>Subscription Status:</b> Expired <br/> <b>Subscription Expired On:</b>" + formattedDay
            }

            else {
                subscriptionStatus = "<b>Subscription Status:</b> Active <br/> <b>Subscription Valid Till:</b>" + formattedDay
            }
        }



        var details = "<b> Company Name: " + seller.company_name + "</b><br />"
            + "Name: " + seller.seller_name + "<br/> <br />"

            + "<b>Contact No. </b>" + seller.mobile + "<br />"
            + "Email: " + seller.email + "<br />"
            + "Merchant id: " + seller.merchant_id + "<br/>"
            + "Seller id: " + seller.seller_id + "<br/>"
            + "GST: " + seller.gstin + "<br /><br />" + subscriptionStatus;



        details += "<br /> <br /><b>Consultation Charges: </b>" + rupeeSymbol + seller.charges
            + "<br /><b>Speciality: </b>" + seller.speciality
            + "<br /><b>Degrees: </b> " + seller.degrees;





        spanSellerDetails.innerHTML = details;
        divSellerDetails.appendChild(spanSellerDetails);

        //SELLER ADDRESS
        var divSellerAddress = document.createElement("div");
        var sellerAddressSpan = document.createElement("span");
        var address = seller.address_line1 + "<br/>"
            + seller.address_line2 + "<br />"
            + seller.address_line3 + "<br /> <br />"
            + seller.city + " - " + seller.state + "<br />"
            + "Pincode: " + seller.pincode;

        sellerAddressSpan.innerHTML = address;
        divSellerAddress.appendChild(sellerAddressSpan);

        //BANK DETAILS
        var divBankDetails = document.createElement("div");
        var bankDetailsSpan = document.createElement("span");
        var bankdetails = "Account Holder Name: " + seller.account_holder_name + "<br/><br/>"
            + "<b>Account Number: " + seller.account_no + "</b><br/>"

            + "Bank Name: " + seller.bank_name + "<br />"
            + "IFSC Code: " + seller.ifsc + "<br />"
            + "PAN No." + seller.pan_no;

        bankDetailsSpan.innerHTML = bankdetails;
        divBankDetails.appendChild(bankDetailsSpan);

        //SELLER STATUS
        var divStatus = document.createElement("div");
        var statusSpan = document.createElement("span");
        statusSpan.innerHTML = seller.status;
        divStatus.appendChild(statusSpan);

        //create divs for amount fields
        var consultationList = doctorConsultationMap.get(seller.seller_id);
        var amount = 0;
        disbursableAmount = 0;

        for (var c = 0; c < consultationList.length; c++) {
            var consultation = consultationList[c];
            amount += consultation.charges;
        }


        var commission = amount * (mAppInfo.doctor_commission / 100);
        disbursableAmount = amount - commission;
        amoutnTobeSettledWithDocs.set(seller.seller_id, disbursableAmount);



        var divDisbursable = document.createElement('div');
        var spanDisbursable = document.createElement('span');
        spanDisbursable.innerHTML = disbursableAmount.toFixed(2);
        divDisbursable.appendChild(spanDisbursable);

        var divAvailableCommission = document.createElement('div');
        var spanAvailablecommission = document.createElement('span');
        spanAvailablecommission.innerHTML = commission.toFixed(2);
        divAvailableCommission.appendChild(spanAvailablecommission);




        var divAction = document.createElement("div");
        //Disable account button
        var divSuspendAccount = document.createElement("div");
        var btnSuspendAccount = document.createElement("button");
        btnSuspendAccount.textContent = "Suspend Account";
        btnSuspendAccount.setAttribute("id", i.toString());
        btnSuspendAccount.style.marginBottom = "10px";
        btnSuspendAccount.style.width = "150px";
        divSuspendAccount.appendChild(btnSuspendAccount);
        divAction.appendChild(divSuspendAccount);

        //Approve button
        var divApprove = document.createElement("div");
        var btnApprove = document.createElement("button");
        btnApprove.textContent = "Approve";
        btnApprove.style.width = "150px";
        btnApprove.setAttribute("id", i.toString());
        btnApprove.style.marginBottom = "10px";
        divApprove.appendChild(btnApprove);

        var divDownloadGSt = document.createElement("div");
        var btnDownloadGST = document.createElement("button");
        btnDownloadGST.textContent = "Download GST";
        btnDownloadGST.style.width = "150px";
        btnDownloadGST.setAttribute("id", i.toString());
        btnDownloadGST.style.marginBottom = "10px";
        divDownloadGSt.appendChild(btnDownloadGST);
        divApprove.appendChild(divDownloadGSt);

        var divDownloadCheque = document.createElement("div");
        var btnDownloadCheque = document.createElement("button");
        btnDownloadCheque.textContent = "Download Cheque";
        btnDownloadCheque.style.width = "150px";
        btnDownloadCheque.setAttribute("id", i.toString());
        btnDownloadCheque.style.marginBottom = "10px";
        divDownloadCheque.appendChild(btnDownloadCheque);
        divApprove.appendChild(divDownloadCheque);

        var divDoctorDegrees = document.createElement('div');
        var btnViewDocDegree = document.createElement("button");
        btnViewDocDegree.textContent = "View Degree";
        btnViewDocDegree.style.width = "150px";
        btnViewDocDegree.setAttribute("id", i.toString());
        btnViewDocDegree.style.marginBottom = "10px";
        divDoctorDegrees.appendChild(btnViewDocDegree);
        divApprove.appendChild(divDoctorDegrees);

        var divReject = document.createElement("div");
        var btnReject = document.createElement("button");
        btnReject.textContent = "Reject Application";
        btnReject.style.width = "150px";
        btnReject.setAttribute("id", i.toString());
        btnReject.style.marginBottom = "10px";
        divReject.appendChild(btnReject);
        divApprove.appendChild(divReject);




        divAction.appendChild(divApprove);

        //Unsettled orders button button
        var divUnsettledOrders = document.createElement("div");
        var btnUnsettledOrders = document.createElement("button");
        btnUnsettledOrders.textContent = "Unsettled Appointments";
        btnUnsettledOrders.style.width = "150px";
        btnUnsettledOrders.setAttribute("id", i.toString());
        btnUnsettledOrders.style.marginBottom = "10px";
        divUnsettledOrders.appendChild(btnUnsettledOrders);


        var divSettleAccount = document.createElement("div");
        var btnSettleAccount = document.createElement("button");
        btnSettleAccount.textContent = "Settle Accounts";
        btnSettleAccount.style.width = "150px";
        btnSettleAccount.setAttribute("id", i.toString());
        btnSettleAccount.style.marginBottom = "10px";
        divSettleAccount.appendChild(btnSettleAccount);
        divUnsettledOrders.appendChild(divSettleAccount);
        divAction.appendChild(divUnsettledOrders);







        if (seller.status == "pending" || seller.status == "suspended" || seller.status == "rejected") {
            divApprove.style.display = "block";
            divSuspendAccount.style.display = "none";
            divUnsettledOrders.style.display = "none";

            if (seller.status == "suspended") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Suspension Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);


            }

            if (seller.status == "rejected") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Rejection Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);
            }
        }

        else {
            divApprove.style.display = "none";
            divSuspendAccount.style.display = "block";
            divUnsettledOrders.style.display = "block";
        }

        if (disbursableAmount == 0) {
            btnSettleAccount.disabled = true;
            divUnsettledOrders.style.display = "none";
        }







        tdSellerDetails.appendChild(divSellerDetails);
        tdSellerAddress.appendChild(divSellerAddress);
        tdBankDetails.appendChild(divBankDetails);
        tdDisbursableAmount.appendChild(divDisbursable);
        tdAvailableCommission.appendChild(divAvailableCommission);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        tr.appendChild(tdDocImage);

        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdSellerAddress);
        tr.appendChild(tdBankDetails);


        tr.appendChild(tdDisbursableAmount);

        tr.appendChild(tdAvailableCommission);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        //Click Handlers


        btnSuspendAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            if (!confirm("Are you sure you want to suspend this account?\nAll the products of this seller will not be shown to buyers for purchase.")) {
                return;
            }

            var reason = prompt("Please enter suspension Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "suspended",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendAccountDisableMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })

        btnReject.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            var reason = prompt("Please enter rejection Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "rejected",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendApplicationRejectionMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })


        btnApprove.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, true));
                }

                Promise.all(promiseList).then(() => {
                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "approved"
                    })
                        .then(function () {
                            sendWelcomeEmail(seller);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });


                })

            })

        })

        btnDownloadGST.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.gst_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })

        btnViewDocDegree.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");

            if (link.download !== undefined) {
                link.setAttribute("href", seller.degree_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


        })


        btnDownloadCheque.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.cheque_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        })

        btnUnsettledOrders.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_orders.html?type=unsettled&sellerid=" + seller.seller_id;
            if (mSellerType == "doctor") {
                href = "pending_appointments.html?type=unsettled&sellerType=doctor&sellerid=" + seller.seller_id;
            }

            window.open(href, "_blank");
        })

        btnSettleAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var amount = amoutnTobeSettledWithDocs.get(seller.seller_id);
            var amt = amount.toFixed(2);

            var msg = "You are about to settle the amount of - " + amt + " with doctor - " + seller.company_name + ".\nDo you wish to continue?";

            if (!confirm(msg)) {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            //var orderList = map
            var consultationList = doctorConsultationMap.get(seller.seller_id);
            var promiseList = [];
            for (var i = 0; i < consultationList.length; i++) {
                var consultation = consultationList[i];
                promiseList.push(settleConsultation(consultation));
            }
            Promise.all(promiseList).then(() => {

                sendDocsSettlementEmail(seller, amt);
                window.location.href = "admin_seller_listing.html?type=approved&sellerType=doctor";

            })


        })
    }
}


function getUnSettledConsultation(seller) {

    return new Promise((resolve, reject) => {
        var consultationList = [];
        firebase.firestore().collection("consultations")
            .where("seller_id", "==", seller.seller_id)
            .where("settlement_done", "==", false)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var consultation = doc.data();
                    consultationList.push(consultation);
                });
            }).then(() => {
                doctorConsultationMap.set(seller.seller_id, consultationList);
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });
    })
}

function getAppInfo() {
    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("AppInfo").doc("AppInfo");
        docRef.get().then(function (doc) {
            if (doc.exists) {
                mAppInfo = doc.data();
                resolve();
            } else {
                mAppInfo = null;
                reject();
                // doc.data() will be undefined in this case
                console.log("No such document!");

            }
        }).catch(function (error) {
            mAppInfo = null;
            reject();
            console.log("Error getting document:", error);
        });

    })

}

function getUnsettledPharmaOrders(seller) {

    return new Promise((resolve, reject) => {
        var orderList = [];
        firebase.firestore().collection("pharmacist_requests")
            .where("seller_id", "==", seller.seller_id)
            .where("settlement_done", "==", false)
            .where("status_code", "==", 5)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var order = doc.data();
                    orderList.push(order);
                });
            }).then(() => {
                pharmacyOrdersMap.set(seller.seller_id, orderList);
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });
    })
}

function createPharmacyTable(sellerList) {
    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < sellerList.length; i++) {

        var tr = document.createElement("tr");

        var tdSellerDetails = document.createElement("td");
        var tdSellerAddress = document.createElement("td");
        var tdBankDetails = document.createElement("td");
        var tdFreezedAmount = document.createElement('td');
        var tdDisbursableAmount = document.createElement('td');
        var tdFreezedCommission = document.createElement("td");
        var tdAvailableCommission = document.createElement("td");
        var tdStatus = document.createElement("td");
        var tdAction = document.createElement("td");

        var seller = sellerList[i];
        if (seller.sellerType == "admin") {
            continue;
        }


        //ADD SELLER DETAILS
        var divSellerDetails = document.createElement("div");
        var spanSellerDetails = document.createElement("span");

        var subscriptionStatus = "<b>Subscription Status:</b> Not Subscribed";

        if (seller.subscription_end_date != null) {
            var ord = seller.subscription_end_date.toDate();
            var dd = ord.getDate();
            var mm = ord.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            var yyyy = ord.getFullYear();
            var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setMilliseconds(0);
            today.setSeconds(0);

            if (today > seller.subscription_end_date.toDate()) {
                subscriptionStatus = "<b>Subscription Status:</b> Expired <br/> <b>Subscription Expired On:</b>" + formattedDay
            }

            else {
                subscriptionStatus = "<b>Subscription Status:</b> Active <br/> <b>Subscription Valid Till:</b>" + formattedDay
            }
        }



        var details = "<b> Company Name: " + seller.company_name + "</b><br />"
            + "Name: " + seller.seller_name + "<br/> <br />"

            + "<b>Contact No. </b>" + seller.mobile + "<br />"
            + "Email: " + seller.email + "<br />"
            + "Merchant id: " + seller.merchant_id + "<br/>"
            + "Seller id: " + seller.seller_id + "<br/>"
            + "GST: " + seller.gstin + "<br /><br />" + subscriptionStatus;


        spanSellerDetails.innerHTML = details;
        divSellerDetails.appendChild(spanSellerDetails);

        //SELLER ADDRESS
        var divSellerAddress = document.createElement("div");
        var sellerAddressSpan = document.createElement("span");
        var address = seller.address_line1 + "<br/>"
            + seller.address_line2 + "<br />"
            + seller.address_line3 + "<br /> <br />"
            + seller.city + " - " + seller.state + "<br />"
            + "Pincode: " + seller.pincode;

        sellerAddressSpan.innerHTML = address;
        divSellerAddress.appendChild(sellerAddressSpan);

        //BANK DETAILS
        var divBankDetails = document.createElement("div");
        var bankDetailsSpan = document.createElement("span");
        var bankdetails = "Account Holder Name: " + seller.account_holder_name + "<br/><br/>"
            + "<b>Account Number: " + seller.account_no + "</b><br/>"

            + "Bank Name: " + seller.bank_name + "<br />"
            + "IFSC Code: " + seller.ifsc + "<br />"
            + "PAN No." + seller.pan_no;

        bankDetailsSpan.innerHTML = bankdetails;
        divBankDetails.appendChild(bankDetailsSpan);

        //SELLER STATUS
        var divStatus = document.createElement("div");
        var statusSpan = document.createElement("span");
        statusSpan.innerHTML = seller.status;
        divStatus.appendChild(statusSpan);

        //create divs for amount fields
        var divFreezedAmount = document.createElement("div");
        var divDisbursableAmount = document.createElement("div");
        var divFreezedCommission = document.createElement("div");
        var divAvailableCommission = document.createElement("div");

        var freezedAmount = 0;
        var disbursableAmount = 0;
        var freezedCommission = 0;
        var availableCommission = 0;
        var arrOrders = [];

        var orderList = pharmacyOrdersMap.get(seller.seller_id);
        console.log("order list");
        console.log(orderList);
        for (var orderNumber = 0; orderNumber < orderList.length; orderNumber++) {

            var order = orderList[orderNumber];
            //if order was a cancelled one.. no need to process it
            if (order.cancelled == true) {
                // ordersTobeSettled.set(seller.seller_id, order);
                continue;
            }
            var deliveryDate = order.delivery_date;
            var productList = order.product_names;

            var freezedAmountTemp = 0;
            var freezedCommissionTemp = 0;
            var disbursableAmountTemp = 0;
            var availableCommissionTemp = 0;
            for (var productNumber = 0; productNumber < productList.length; productNumber++) {
                var product = productList[productNumber];
                var amtToReduce = 0;
                var status = order.available_status[productNumber];

                if (status != "Available") {
                    continue;
                }


                var commission = mAppInfo.pharma_commission;

                var offer_price = order.product_prices_total[productNumber];
                offer_price = offer_price - amtToReduce;
                var commission_value = (offer_price * commission) / 100;

                //If product is not delivered yet.. it will fall in freezed category
                if (deliveryDate == null) {
                    freezedAmountTemp += offer_price;
                    freezedCommissionTemp += commission_value;
                }
                else {
                    var dtDelivery = deliveryDate.toDate();

                    var dtCurrent = new Date();
                    var day = dtCurrent.getDate();
                    var month = dtCurrent.getMonth();
                    var year = dtCurrent.getFullYear();
                    if (month == 12) {
                        year = dtCurrent.getFullYear() - 1;
                    }

                    //var dtFreezeWindowStart;
                    if (day < 16) {
                        month = dtCurrent.getMonth() - 1;

                        dtFreezeWindowStart = new Date(year, month, 16);
                        //   dtFreezeWindowEnd = new Date(year, month, numberofDays);
                    }
                    else {
                        month = dtCurrent.getMonth();
                        year = dtCurrent.getFullYear();
                        //jaise hi 16 tarikh aayegi freezing window current month ki 1 tarikh se start ho jayegi
                        //aur ussey pehle ke sabhi orders available me aa jayege
                        dtFreezeWindowStart = new Date(year, month, 1);
                        var numberofDays = getDaysInMonth(month, year);
                        //if this is last day of the month move the orders from 1 to 15 in available range
                        if (day == numberofDays) {
                            dtFreezeWindowStart = new Date(year, month, 16);
                        }
                    }

                    //All the orders that were delivered before freezing window started will be available for disbursement
                    if (dtDelivery < dtFreezeWindowStart) {
                        disbursableAmountTemp += offer_price;
                        availableCommissionTemp += commission_value;
                        arrOrders.push(order);

                    }
                    else {
                        freezedAmountTemp += offer_price;
                        freezedCommissionTemp += commission_value;
                    }


                }

            }

            // var tradeChargesFreezed = 28;
            // var tradeChargesAvailable = 28;

            var tradeChargesFreezed = 0;
            var tradeChargesAvailable = 0;

            if (freezedAmountTemp == 0) {
                tradeChargesFreezed = 0;
            }

            if (disbursableAmountTemp == 0) {
                tradeChargesAvailable = 0;
            }

            var freezedDeductionsTaxable = freezedCommissionTemp + tradeChargesFreezed;
            var freezedTaxes = freezedDeductionsTaxable * 18 / 100;
            var freezedDeductions = freezedDeductionsTaxable + freezedTaxes;
            freezedAmount += freezedAmountTemp - freezedDeductions;
            freezedCommission += freezedDeductions;

            var disbursableDeductionsTaxable = availableCommissionTemp + tradeChargesAvailable;
            var disbursableTaxes = disbursableDeductionsTaxable * 18 / 100;
            var disbursableDeductions = disbursableDeductionsTaxable + disbursableTaxes;
            disbursableAmount += disbursableAmountTemp - disbursableDeductions;
            availableCommission += disbursableDeductions;


        }



        ordersTobeSettled.set(seller.seller_id, arrOrders);
        amountTobeSettled.set(seller.seller_id, disbursableAmount);

        var divAction = document.createElement("div");
        //Disable account button
        var divSuspendAccount = document.createElement("div");
        var btnSuspendAccount = document.createElement("button");
        btnSuspendAccount.textContent = "Suspend Account";
        btnSuspendAccount.setAttribute("id", i.toString());
        btnSuspendAccount.style.marginBottom = "10px";
        btnSuspendAccount.style.width = "150px";
        divSuspendAccount.appendChild(btnSuspendAccount);
        divAction.appendChild(divSuspendAccount);

        //Approve button
        var divApprove = document.createElement("div");
        var btnApprove = document.createElement("button");
        btnApprove.textContent = "Approve";
        btnApprove.style.width = "150px";
        btnApprove.setAttribute("id", i.toString());
        btnApprove.style.marginBottom = "10px";
        divApprove.appendChild(btnApprove);

        var divDownloadGSt = document.createElement("div");
        var btnDownloadGST = document.createElement("button");
        btnDownloadGST.textContent = "Download GST";
        btnDownloadGST.style.width = "150px";
        btnDownloadGST.setAttribute("id", i.toString());
        btnDownloadGST.style.marginBottom = "10px";
        divDownloadGSt.appendChild(btnDownloadGST);
        divApprove.appendChild(divDownloadGSt);

        var divDownloadCheque = document.createElement("div");
        var btnDownloadCheque = document.createElement("button");
        btnDownloadCheque.textContent = "Download Cheque";
        btnDownloadCheque.style.width = "150px";
        btnDownloadCheque.setAttribute("id", i.toString());
        btnDownloadCheque.style.marginBottom = "10px";
        divDownloadCheque.appendChild(btnDownloadCheque);
        divApprove.appendChild(divDownloadCheque);

        var divReject = document.createElement("div");
        var btnReject = document.createElement("button");
        btnReject.textContent = "Reject Application";
        btnReject.style.width = "150px";
        btnReject.setAttribute("id", i.toString());
        btnReject.style.marginBottom = "10px";
        divReject.appendChild(btnReject);
        divApprove.appendChild(divReject);

        var divDoctorDegrees = document.createElement('div');
        var btnViewDocDegree = document.createElement("button");
        btnViewDocDegree.textContent = "View Degree";
        btnViewDocDegree.style.width = "150px";
        btnViewDocDegree.setAttribute("id", i.toString());
        btnViewDocDegree.style.marginBottom = "10px";
        divDoctorDegrees.appendChild(btnViewDocDegree);
        divDoctorDegrees.style.display = "none";
        divApprove.appendChild(divDoctorDegrees);

        if (mSellerType == "doctor") {
            divDoctorDegrees.style.display = "block";
        }

        divAction.appendChild(divApprove);

        //Unsettled orders button button
        var divUnsettledOrders = document.createElement("div");
        var btnUnsettledOrders = document.createElement("button");
        btnUnsettledOrders.textContent = "Unsettled Orders";
        btnUnsettledOrders.style.width = "150px";
        btnUnsettledOrders.setAttribute("id", i.toString());
        btnUnsettledOrders.style.marginBottom = "10px";
        divUnsettledOrders.appendChild(btnUnsettledOrders);
        if (mSellerType == "doctor") {
            btnUnsettledOrders.textContent = "Unsettled Appointments";
        }

        var divSettleAccount = document.createElement("div");
        var btnSettleAccount = document.createElement("button");
        btnSettleAccount.textContent = "Settle Accounts";
        btnSettleAccount.style.width = "150px";
        btnSettleAccount.setAttribute("id", i.toString());
        btnSettleAccount.style.marginBottom = "10px";
        divSettleAccount.appendChild(btnSettleAccount);
        divUnsettledOrders.appendChild(divSettleAccount);
        divAction.appendChild(divUnsettledOrders);

        var divOfflineOrders = document.createElement("div");
        var btnOfflineInvoices = document.createElement("button");
        btnOfflineInvoices.textContent = "Offline Orders";
        btnOfflineInvoices.style.width = "150px";
        btnOfflineInvoices.setAttribute("id", i.toString());
        btnOfflineInvoices.style.marginBottom = "10px";
        divOfflineOrders.appendChild(btnOfflineInvoices);
        divUnsettledOrders.appendChild(divOfflineOrders);
        divAction.appendChild(divUnsettledOrders);

        var divOnlineOrders = document.createElement("div");
        var btnOnlineOrders = document.createElement("button");
        btnOnlineOrders.textContent = "Online Orders";
        btnOnlineOrders.style.width = "150px";
        btnOnlineOrders.setAttribute("id", i.toString());
        btnOnlineOrders.style.marginBottom = "10px";
        divOnlineOrders.appendChild(btnOnlineOrders);
        divUnsettledOrders.appendChild(divOnlineOrders);
        divAction.appendChild(divUnsettledOrders);

        divOnlineOrders.style.display = "none";


        if (seller.status == "pending" || seller.status == "suspended" || seller.status == "rejected") {
            divApprove.style.display = "block";
            divSuspendAccount.style.display = "none";
            divUnsettledOrders.style.display = "none";

            if (seller.status == "suspended") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Suspension Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);


            }

            if (seller.status == "rejected") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Rejection Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);
            }
        }

        else {
            divApprove.style.display = "none";
            divSuspendAccount.style.display = "block";
            divUnsettledOrders.style.display = "block";
        }

        if (disbursableAmount == 0) {
            btnSettleAccount.disabled = true;
        }




        var spanFreezeAmount = document.createElement("span");
        spanFreezeAmount.innerHTML = freezedAmount.toFixed(2);
        divFreezedAmount.appendChild(spanFreezeAmount);

        var spanDisbursableAmount = document.createElement("span");
        spanDisbursableAmount.innerHTML = disbursableAmount.toFixed(2);
        divDisbursableAmount.appendChild(spanDisbursableAmount);

        var spanFreezedCommission = document.createElement("span");
        spanFreezedCommission.innerHTML = freezedCommission.toFixed(2);
        divFreezedCommission.appendChild(spanFreezedCommission);

        var spanAvailablecommission = document.createElement("span");
        spanAvailablecommission.innerHTML = availableCommission.toFixed(2);
        divAvailableCommission.appendChild(spanAvailablecommission);

        tdSellerDetails.appendChild(divSellerDetails);
        tdSellerAddress.appendChild(divSellerAddress);
        tdBankDetails.appendChild(divBankDetails);
        tdFreezedAmount.appendChild(divFreezedAmount);
        tdFreezedCommission.appendChild(divFreezedCommission);
        tdDisbursableAmount.appendChild(divDisbursableAmount);
        tdAvailableCommission.appendChild(divAvailableCommission);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        if (mSellerType == "doctor") {
            tr.appendChild(tdDocImage);
        }
        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdSellerAddress);
        tr.appendChild(tdBankDetails);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedAmount);
        }

        tr.appendChild(tdDisbursableAmount);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedCommission);
        }

        tr.appendChild(tdAvailableCommission);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        //Click Handlers

        btnOfflineInvoices.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_view_offline_invoice.html?sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnOnlineOrders.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_orders.html?type=all&sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnSuspendAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            if (!confirm("Are you sure you want to suspend this account?\nAll the products of this seller will not be shown to buyers for purchase.")) {
                return;
            }

            var reason = prompt("Please enter suspension Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "suspended",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendAccountDisableMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })

        btnReject.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            var reason = prompt("Please enter rejection Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "rejected",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendApplicationRejectionMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })


        btnApprove.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, true));
                }

                Promise.all(promiseList).then(() => {
                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "approved"
                    })
                        .then(function () {
                            sendWelcomeEmail(seller);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });


                })

            })

        })

        btnDownloadGST.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.gst_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })

        btnViewDocDegree.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");

            if (link.download !== undefined) {
                link.setAttribute("href", seller.degree_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


        })


        btnDownloadCheque.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.cheque_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        })

        btnUnsettledOrders.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "medicine_enquiries.html?type=unsettled&sellerid=" + seller.seller_id;
            if (mSellerType == "doctor") {
                href = "pending_appointments.html?type=unsettled&sellerType=admin";
            }

            window.open(href, "_blank");
        })

        btnSettleAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var amount = amountTobeSettled.get(seller.seller_id);
            var amt = amount.toFixed(2);

            var msg = "You are about to settle the amount of - " + amt + " with seller - " + seller.company_name + ".\nDo you wish to continue?";

            if (!confirm(msg)) {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            //var orderList = map
            var orderList = ordersTobeSettled.get(seller.seller_id);
            var promiseList = [];
            for (var i = 0; i < orderList.length; i++) {
                var order = orderList[i];
                promiseList.push(settlePharmaOrder(order));
            }
            Promise.all(promiseList).then(() => {
                var formattedDate = formatDate(dtFreezeWindowStart);
                sendAccountSettlementEmail(seller, formattedDate, amt);
                window.location.href = "admin_seller_listing.html?type=approved&sellerType=pharmacist";

            })


        })
    }
}

function settlePharmaOrder(order) {


    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("pharmacist_requests").doc(order.doc_id);
        washingtonRef.update({
            settlement_done: true,
            settlement_date: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log(error);
                reject();
                // The document probably doesn't exist.

            });

    })



}


function prepareQuery(type, isFirst) {
    if (isFirst) {

        if (type == "all") {
            query = firebase.firestore().collection("seller")
                .where("sellerType", "==", mSellerType)
                .limit(docLimit);;
        }

        if (type == "byseller") {
            var merchantid = getQueryVariable("merchant_id");
            query = firebase.firestore().collection("seller")
                .where("merchant_id", "==", merchantid)
                .limit(docLimit);;
        }

        if (type == "pending") {
            query = firebase.firestore().collection("seller")
                .where("status", "==", "pending")
                .where("sellerType", "==", mSellerType)
                .limit(docLimit);;
        }

        if (type == "suspended") {
            query = firebase.firestore().collection("seller")
                .where("status", "==", "suspended")
                .where("sellerType", "==", mSellerType)
                .limit(docLimit);;
        }

        if (type == "approved") {
            console.log(mSellerType);
            query = firebase.firestore().collection("seller")
                .where("status", "==", "approved")
                .where("sellerType", "==", mSellerType)
                .limit(docLimit);;
        }

        if (type == null) {
            query = firebase.firestore().collection("seller")
                .limit(docLimit);;
        }

        queryList.push(query);
    }
    else {

        if (type == "all") {
            query = firebase.firestore().collection("seller")
                .where("sellerType", "==", mSellerType)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }

        if (type == "byseller") {
            var merchantid = getQueryVariable("merchant_id");
            query = firebase.firestore().collection("seller")
                .where("merchant_id", "==", merchantid)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }

        if (type == "pending") {
            query = firebase.firestore().collection("seller")
                .where("status", "==", "pending")
                .where("sellerType", "==", mSellerType)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }

        if (type == "suspended") {
            query = firebase.firestore().collection("seller")
                .where("status", "==", "suspended")
                .where("sellerType", "==", mSellerType)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }

        if (type == "approved") {
            console.log(mSellerType);
            query = firebase.firestore().collection("seller")
                .where("status", "==", "approved")
                .where("sellerType", "==", mSellerType)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }

        if (type == null) {
            query = firebase.firestore().collection("seller")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);;
        }
        queryList.push(query);


    }
}

function prepareSearchQuery(type, searchBy, searchValue) {

    if (type == "all") {
        query = firebase.firestore().collection("seller")
            .where("sellerType", "==", mSellerType)
            .where(searchBy, "==", searchValue);
    }

    if (type == "byseller") {
        var merchantid = getQueryVariable("merchant_id");
        query = firebase.firestore().collection("seller")
            .where("merchant_id", "==", merchantid)
            .where(searchBy, "==", searchValue);
    }

    if (type == "pending") {
        query = firebase.firestore().collection("seller")
            .where("status", "==", "pending")
            .where("sellerType", "==", mSellerType)
            .where(searchBy, "==", searchValue);
    }

    if (type == "suspended") {
        query = firebase.firestore().collection("seller")
            .where("status", "==", "suspended")
            .where("sellerType", "==", mSellerType)
            .where(searchBy, "==", searchValue);
    }

    if (type == "approved") {
        query = firebase.firestore().collection("seller")
            .where("status", "==", "approved")
            .where("sellerType", "==", mSellerType)
            .where(searchBy, "==", searchValue);
    }

    if (type == null) {
        query = firebase.firestore().collection("seller")
            .where(searchBy, "==", searchValue);
    }

}


var mSellerTags = null;
function loadSellerTags() {
    var collectionName;
    if(mSellerType == "seller"){
        collectionName = "tags_seller";
    }
    else if(mSellerType == "pharmacist"){
        collectionName = "tags_pharma"
    }
    else{
        collectionName = "tags_doctor"
    }
    return new Promise((resolve, reject) => {
        firebase.firestore().collection(collectionName)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    mSellerTags = doc.data();
                    console.log(mSellerTags);
                });
            })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                mSellerTags = null;
                reject();
            });


    })
}

