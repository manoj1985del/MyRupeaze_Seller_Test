var sellerList = [];
var allSellerList = [];
var arrSellerCategory = [];
var arrSellerCity = [];
var arrMerchantId = [];
var arrSellerName = [];
var arrAreaPin = [];

var arrSearchBy = [];

var cmbSearchBy = document.getElementById("cmbSearchBy");
var divProgress = document.getElementById("divProgress");
var pageHeader = document.getElementById("pageHeader");
var table = document.getElementById("table");
var txtSearch = document.getElementById("txtSearch");
var btnSearch = document.getElementById("btnSearch");
var commision_map = new Map();
var errorMsg = document.getElementById("errorMsg");
var sellerProductMap = new Map();

var sellerOrderMap = new Map();
var ordersProductMap = new Map();
var ordersTobeSettled = new Map();
var amountTobeSettled = new Map();
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
var query = "";

cmbSearchBy.addEventListener("change", function(){

    if(this.value == "None"){
        loadOrdersAndProductForSellers(sellerList);
    }

    if(this.value == "Seller Name"){
        arrSearchBy = arrSellerName;
    }

    if(this.value == "Seller City"){
        arrSearchBy = arrSellerCity;
    }

    if(this.value == "Seller Category"){
        arrSearchBy = arrSellerCategory;
    }

    if(this.value == "Merchant Id"){
        arrSearchBy = arrMerchantId;
    }

    if(this.value == "Area Pin"){
        arrSearchBy = arrAreaPin;
    }

    autocomplete(txtSearch, arrSearchBy);

})
if (type == "all") {
     query = firebase.firestore().collection("seller")
            .where(sellerType, "==", "seller");
}

if (type == "byseller") {
    var merchantid = getQueryVariable("merchant_id");
    query = firebase.firestore().collection("seller").where("merchant_id", "==", merchantid);
}

if (type == "pending") {
    query = firebase.firestore().collection("seller").where("status", "==", "pending");
}

if (type == "suspended") {
    query = firebase.firestore().collection("seller").where("status", "==", "suspended");
}

if (type == "approved") {
    query = firebase.firestore().collection("seller").where("status", "==", "approved");
}

if (type == null) {
    query = firebase.firestore().collection("seller");
}

loadSellers(query).then(() => {

    if (sellerList.length > 0) {
        loadComissionMap().then(() => {
            loadOrdersAndProductForSellers(sellerList);
        })
    }
// query = firebase.firestore().collection("seller");
})

btnSearch.addEventListener("click", function () {


    var localSellerList = [];
    if(cmbSearchBy.value == "Seller Name"){
        arrSearchBy = arrSellerName;
        for(var i = 0; i < sellerList.length; i++){
            var seller = sellerList[i];
            if(seller.company_name == txtSearch.value){
                localSellerList.push(seller);
            }
        }
    }

    if(cmbSearchBy.value == "Seller City"){
        arrSearchBy = arrSellerCity;
        for(var i = 0; i < sellerList.length; i++){
            var seller = sellerList[i];
            if(seller.city == txtSearch.value){
                localSellerList.push(seller);
            }
        }
    }

    if(cmbSearchBy.value == "Seller Category"){
        arrSearchBy = arrSellerCategory;
        for(var i = 0; i < sellerList.length; i++){
            var seller = sellerList[i];
            if(seller.seller_category == txtSearch.value){
                localSellerList.push(seller);
            }
        }
    }

    if(cmbSearchBy.value == "Merchant Id"){
        arrSearchBy = arrMerchantId;
        for(var i = 0; i < sellerList.length; i++){
            var seller = sellerList[i];
            if(seller.merchant_id == txtSearch.value){
                localSellerList.push(seller);
            }
        }
    }

    if(cmbSearchBy.value == "Area Pin"){
        arrSearchBy = arrMerchantId;
        for(var i = 0; i < sellerList.length; i++){
            var seller = sellerList[i];
            if(seller.seller_area_pin == txtSearch.value){
                localSellerList.push(seller);
            }
        }
    }

    loadOrdersAndProductForSellers(localSellerList);

    // var merchatId = txtSearch.value;
    // window.location.href = "admin_seller_listing.html?type=byseller&merchant_id=" + merchatId;

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
        promiseList.push(getUnSettledOrders(seller));
    }
    Promise.all(promiseList).then(() => {
        divProgress.style.display = "none";
        divContent.style.display = "block";
        drawTable(sellerList);
    })
}
//Load Sellers
function loadSellers(query) {
    return new Promise((resolve, reject) => {
        pageHeader.textContent = "Seller Listing";

        query
            .get()
            .then(function (querySnapshot) {
                if (querySnapshot.docs.length == 0) {
                    divContent.style.display = "none";
                    divProgress.style.display = "none";
                    errorMsg.textContent = "No Record Found";

                }
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var seller = doc.data();
                    sellerList.push(seller);

                    if(!arrSellerCategory.includes(seller.seller_category)){
                        arrSellerCategory.push(seller.seller_category);
                    }

                    if(!arrSellerCity.includes(seller.city)){
                        arrSellerCity.push(seller.city);
                    }

                    if(!arrMerchantId.includes(seller.merchant_id)){
                        arrMerchantId.push(seller.merchant_id);
                    }

                    if(!arrSellerName.includes(seller.company_name)){
                        arrSellerName.push(seller.company_name);
                    }

                    if(!arrAreaPin.includes(seller.seller_area_pin)){
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

    var sellerDetailsHeader = document.createElement("th");
    var sellerAddressHeader = document.createElement("th");
    var bankDetailsHeader = document.createElement("th");
    var freezedAmountHeader = document.createElement('th');
    var disbursableAmountHeader = document.createElement('th');
    var freezedCommissionHeader = document.createElement('th');
    var availableCommissionHeader = document.createElement('th');
    var statusHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    sellerDetailsHeader.innerHTML = "Seller Details";
    sellerAddressHeader.innerHTML = "Address";
    bankDetailsHeader.innerHTML = "Bank Details";
    freezedAmountHeader.innerHTML = "Freezed Amount";
    disbursableAmountHeader.innerHTML = "Disbursable Amount";
    freezedCommissionHeader.innerHTML = "Freezed Commission";
    availableCommissionHeader.innerHTML = "Available Commission";
    statusHeader.innerHTML = "Status";
    actionHeader.innerHTML = "Action";

    tr.appendChild(sellerDetailsHeader);
    tr.appendChild(sellerAddressHeader);
    tr.appendChild(bankDetailsHeader);
    tr.appendChild(freezedAmountHeader);
    tr.appendChild(disbursableAmountHeader);
    tr.appendChild(freezedCommissionHeader);
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
        if(seller.merchant_id == "texpedia"){
            continue;
        }

        //ADD SELLER DETAILS
        var divSellerDetails = document.createElement("div");
        var spanSellerDetails = document.createElement("span");

        var subscriptionStatus = "<b>Subscription Status:</b> Not Subscribed";

        if(seller.subscription_end_date != null)
        {
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

        if(today > seller.subscription_end_date.toDate()){
            subscriptionStatus = "<b>Subscription Status:</b> Expired <br/> <b>Subscription Expired On:</b>" + formattedDay
        }

        else{
            subscriptionStatus = "<b>Subscription Status:</b> Active <br/> <b>Subscription Valid Till:</b>" + formattedDay
        }
    }



        var details = "<b> Company Name: " + seller.company_name + "</b><br />"
            + "Seller Name: " + seller.seller_name + "<br/> <br />"

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

                if(product.cancelled_by_seller){
                    product.Offer_Price= 0;
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

        if(freezedAmountTemp == 0){
            tradeChargesFreezed = 0;
        }

        if(disbursableAmountTemp == 0){
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




        divAction.appendChild(divApprove);

        //Unsettled orders button button
        var divUnsettledOrders = document.createElement("div");
        var btnUnsettledOrders = document.createElement("button");
        btnUnsettledOrders.textContent = "Unsettled Orders";
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

        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdSellerAddress);
        tr.appendChild(tdBankDetails);
        tr.appendChild(tdFreezedAmount);
        tr.appendChild(tdDisbursableAmount);
        tr.appendChild(tdFreezedCommission);
        tr.appendChild(tdAvailableCommission);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        //Click Handlers

        btnOfflineInvoices.addEventListener("click", function(){
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_view_offline_invoice.html?sellerid=" + seller.seller_id;
            window.open(href, "_blank"); 
            //window.location.href = href;
        })

        btnOnlineOrders.addEventListener("click", function(){
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