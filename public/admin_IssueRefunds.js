//8 points == 1 rupee
var mPointsForOneRupee = 8;
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var table = document.getElementById("tblOrders");
var orderId = getQueryVariable("orderid");
var productList = [];
var mSeller;
var mOrder;
var mUser;
var mAddress;
var amountEligibleForReturn = 0;
var earnedPoints = 0;
var returnableProducts = [];
var mRemarks = null;

var rbFull = document.getElementById("rbFull");
var rbPartial = document.getElementById("rbPartial");
var rbReject = document.getElementById("rbReject");
var divPartial = document.getElementById("divPartial");
var divReject = document.getElementById("divReject");
var btnSubmit = document.getElementById("btnSubmit");
var txtAmount = document.getElementById("txtAmount");
var txtAmountBeingRefunded = document.getElementById("txtAmountBeingRefunded");
var txtReason = document.getElementById("txtReason");
var msgHeader = document.getElementById("msgHeader");
var imgHeader = document.getElementById("imgHeader");
var actionMsg = document.getElementById("actionMsg");
var txtRemarks = document.getElementById("txtRemarks");
var imgSaving = document.getElementById("imgSaving");

class RefundMailProps {
    constructor(destName, destEmail, orderId, productList, amtRefunded) {
        this.destName = destName;
        this.destEmail = destEmail;
        this.orderId = orderId;
        this.productList = productList;
        this.amtRefunded = amtRefunded;
    }
}

var amtPayable = 0;

var rupeeSymbol = "₹ ";

var promiseList = [];
var full = true;
var partial = false;
var reject = false;

rbFull.addEventListener("change", function () {
    divPartial.style.display = "none";
    divReject.style.display = "none";
    full = true;
    partial = false;
    reject = false;
    msgHeader.style.display = "none";
    actionMsg.innerHTML = "";

})

rbPartial.addEventListener("change", function () {

    divPartial.style.display = "block";
    divReject.style.display = "none";
    full = false;
    partial = true;
    reject = false;
    msgHeader.style.display = "none";
    actionMsg.innerHTML = "";
})

rbReject.addEventListener("change", function () {
    divPartial.style.display = "none";
    divReject.style.display = "block";
    full = false;
    partial = false;
    reject = true;
    msgHeader.style.display = "none";
    actionMsg.innerHTML = "";
})

loadUI();

function loadUI() {

    getOrderDetails().then(() => {
        console.log("going to fetch productlist");
        getProductListForOrder().then(() => {
            console.log("going to fetch user");
            fetchUser().then(() => {
                fetchAddressOfUser().then(() => {
                    fetchSeller().then(() => {
                        divProgress.style.display = "none";
                        divContent.style.display = "block";

                        addPendingOrdersToTable();
                        getPayableAmount();
                        //draw table
                    })
                })
            })
        })
    })



}

function getOrderDetails() {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("orders").doc(orderId);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mOrder = doc.data();
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

function fetchUser() {

    return new Promise((resolve, reject) => {


        var docRef = firebase.firestore().collection("users").doc(mOrder.customer_id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mUser = doc.data();
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

function fetchSeller() {

    return new Promise((resolve, reject) => {


        var docRef = firebase.firestore().collection("seller").doc(mOrder.seller_id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mSeller = doc.data();
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

function fetchAddressOfUser() {

    return new Promise((resolve, reject) => {


        var docRef = firebase.firestore().collection("users").doc(mOrder.customer_id).collection("Addresses").doc(mUser.AddressId);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mAddress = doc.data();
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



function getProductListForOrder() {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("orders").doc(orderId).collection("products")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var product = doc.data();
                    productList.push(product);
                })
            }).then(function () {
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}


function createTableHeaders() {
    var tr = document.createElement('tr');

    var imageHeader = document.createElement("th");
    var dateHeader = document.createElement("th");
    var orderHeader = document.createElement('th');
    var customerNmaeHeader = document.createElement('th');
    var sellerDetailsHeader = document.createElement('th');
    var productNameHeader = document.createElement('th');
    var qtyHeader = document.createElement('th');
    var amtPayableHeader = document.createElement('th');
    var paymentIdHeader = document.createElement('th');
    var codHeader = document.createElement('th');
    var statusHeader = document.createElement('th');



    imageHeader.innerHTML = "Image";
    dateHeader.innerHTML = "Order Date";
    orderHeader.innerHTML = "Order Id";
    customerNmaeHeader.innerHTML = "Customer Name";
    sellerDetailsHeader.innerHTML = "Seller Details";
    productNameHeader.innerHTML = "Product Name";
    qtyHeader.innerHTML = "Qty";
    amtPayableHeader.innerHTML = "Amount Payable";
    paymentIdHeader.innerHTML = "Payment Id";
    codHeader.innerHTML = "COD";
    statusHeader.innerHTML = "Status";

    tr.appendChild(imageHeader);
    tr.appendChild(dateHeader);
    tr.appendChild(orderHeader);
    tr.appendChild(customerNmaeHeader);
    tr.appendChild(sellerDetailsHeader);
    tr.appendChild(productNameHeader);
    tr.appendChild(qtyHeader);
    tr.appendChild(amtPayableHeader);
    tr.appendChild(paymentIdHeader);
    tr.appendChild(codHeader);
    tr.append(statusHeader);


    table.appendChild(tr);

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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addPendingOrdersToTable() {


    createTableHeaders();

    var returnRequestedAndNotProcessed = false;



    var order = mOrder
    var user = mUser;
    var address = mAddress;
    var seller = mSeller;

    var tr = document.createElement("tr");


    var tdImage = document.createElement("td");
    var tdOrderDate = document.createElement("td");
    var tdOrderId = document.createElement("td");
    var tdCustomerName = document.createElement("td");
    var tdSellerDetails = document.createElement("td");
    var tdTitle = document.createElement("td");
    var tdProductQty = document.createElement("td");
    var tdAmtPayable = document.createElement("td");
    var tdPaymentId = document.createElement("td");
    var tdCOD = document.createElement("td");
    var tdStatus = document.createElement("td");



    var divCustomerName = document.createElement("div");
    var divSellerDetails = document.createElement("div");
    var divOrderId = document.createElement("div");
    var divPaymentId = document.createElement("div");
    var divCOD = document.createElement("div");
    var divOrderDate = document.createElement("div");

    var customerName = document.createElement("span");
    customerName.innerHTML = address.Name;
    var customerCity = document.createElement("span");
    customerCity.innerHTML = "<br/>" + address.City + ", " + address.State;
    var customerPIN = document.createElement("span");
    customerPIN.innerHTML = "<br />PinCode: " + address.Pincode + "<br />"
    var customerPhone = document.createElement("span");
    customerPhone.innerHTML = "<b>Phone Number: </b>" + address.Phone + "<br />";
    var customerEmail = document.createElement("span");
    customerEmail.innerHTML = "<b>Email : </b>" + user.Email;

    divCustomerName.appendChild(customerName);
    divCustomerName.appendChild(customerCity);
    divCustomerName.appendChild(customerPIN);
    divCustomerName.appendChild(customerPhone);
    divCustomerName.appendChild(customerEmail);

    var divSellerName = document.createElement('div');
    var spanSellerName = document.createElement("span");
    spanSellerName.textContent = seller.company_name;

    var spanSellerPhone = document.createElement("span");
    spanSellerPhone.innerHTML = "<br/><b>Phone Number: </b>" + seller.mobile;

    var spanSellerEmail = document.createElement("span");
    spanSellerEmail.innerHTML = "<br/><b>Email: </b>" + seller.email;

    divSellerName.appendChild(spanSellerName);
    divSellerDetails.appendChild(divSellerName);
    divSellerDetails.appendChild(spanSellerPhone);
    divSellerDetails.appendChild(spanSellerEmail);

    var orderId = document.createElement("span");
    orderId.textContent = order.order_id;
    divOrderId.appendChild(orderId);

    var orderDate = document.createElement("span");
    var ord = order.order_date.toDate();
    var dd = ord.getDate();
    var mm = ord.getMonth() + 1;
    if (dd < 10) {
        dd = '0' + dd;
    }
    var yyyy = ord.getFullYear();
    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
    orderDate.textContent = formattedDay;
    divOrderDate.appendChild(orderDate);


    var paymentId = document.createElement("span");
    paymentId.textContent = order.payment_id;
    divPaymentId.appendChild(paymentId);

    var cod = document.createElement("span");
    cod.textContent = order.COD;
    divCOD.appendChild(cod);


    var divStatus = document.createElement("div");
    var statusSpan = document.createElement("span");
    statusSpan.textContent = order.Status;
    divStatus.appendChild(statusSpan);


    var divImgProduct = document.createElement("div");
    var divProductName = document.createElement("div");
    var divProductQty = document.createElement("div");
    var divAmountPayable = document.createElement("div");




    for (var j = 0; j < productList.length; j++) {
        var product = productList[j];
        var variants = product.Variants;
        var totalVariants = "<br />";


        for (const property in variants) {
            var propertyName = `${property}`;
            var propertyValue = `${variants[property]}`;
            totalVariants += "<b>" + propertyName + "</b> : " + propertyValue + "<br />";
        }


        var divImgLocal = document.createElement("div");
        divImgLocal.style.marginBottom = "10px";


        var imgProduct = document.createElement("Img");
        imgProduct.style.width = "50px";
        imgProduct.style.height = "50px";
        imgProduct.setAttribute("src", product.ImageUrlCover);
        divImgLocal.appendChild(imgProduct);
        divImgProduct.appendChild(divImgLocal);

        var divProductTitleLocal = document.createElement("div");
        divProductTitleLocal.style.marginBottom = "10px";
        var productTitle = document.createElement("span");
        var title = product.Title;
        if (totalVariants != "<br />") {
            title = title + totalVariants;
        }
        var spanReturn = document.createElement("span");
        if (product.return_requested == true) {

            if (product.return_processed == false) {
                returnRequestedAndNotProcessed = true;

                spanReturn.innerHTML = "<br/><b>Return Requested</b>"
            }
            else {
                spanReturn.innerHTML = "<br/><b>Return Requested</b>"
            }
            spanReturn.style.color = "#ff0000";


        }


        productTitle.innerHTML = title;
        divProductTitleLocal.appendChild(productTitle);
        divProductTitleLocal.appendChild(spanReturn);
        divProductName.appendChild(divProductTitleLocal);

        var divQtyLocal = document.createElement("div");
        divQtyLocal.style.marginBottom = "10px";
        var productQty = document.createElement("span");
        productQty.textContent = product.Qty;
        divQtyLocal.appendChild(productQty);
        divProductQty.appendChild(divQtyLocal);

        var divAmtPayableLocal = document.createElement("div");
        divAmtPayableLocal.style.marginBottom = "10px";
        var amtPayable = product.Qty * product.Offer_Price;
        var formattedAmtPayable = rupeeSymbol + numberWithCommas(amtPayable);
        var amountPayable = document.createElement("span");
        amountPayable.textContent = formattedAmtPayable;
        divAmtPayableLocal.appendChild(amountPayable);
        divAmountPayable.appendChild(divAmtPayableLocal);

    }


    tdImage.appendChild(divImgProduct);
    tdOrderDate.appendChild(divOrderDate);
    tdOrderId.appendChild(divOrderId);
    tdCustomerName.appendChild(divCustomerName);
    tdSellerDetails.appendChild(divSellerDetails);
    tdTitle.appendChild(divProductName);
    tdProductQty.appendChild(divProductQty);
    tdAmtPayable.appendChild(divAmountPayable);
    tdPaymentId.appendChild(divPaymentId);
    tdCOD.appendChild(divCOD);
    tdStatus.appendChild(divStatus);
    tdAmtPayable.appendChild(divAmountPayable);


    tr.appendChild(tdImage);
    tr.appendChild(tdOrderDate);
    tr.appendChild(tdOrderId);
    tr.appendChild(tdCustomerName);
    tr.appendChild(tdSellerDetails)
    tr.appendChild(tdTitle);
    tr.appendChild(tdProductQty);
    tr.appendChild(tdAmtPayable);
    tr.appendChild(tdPaymentId);
    tr.appendChild(tdCOD);
    tr.appendChild(tdStatus);
    table.appendChild(tr);


}

function getPayableAmount() {


    //in case of order cancellation full refund has to be provided..
    if (mOrder.cancelled == true) {
        rbPartial.disabled = "true";
        rbReject.disabled = "true";
        if (mOrder.COD == true) {
            txtAmount.value = "0";
        }
    }

    for (var i = 0; i < productList.length; i++) {
        var product = productList[i];
        if (mOrder.cancelled) {
            amtPayable += product.Qty * product.Offer_Price;
            returnableProducts.push(product);
        }
        else {
            if (product.return_requested == true && product.return_processed == false) {
                amtPayable += product.Qty * product.Offer_Price;
                returnableProducts.push(product);
            }
        }
    }
    txtAmount.value = amtPayable.toString();



}

btnSubmit.addEventListener("click", function () {
    var error = false;
    var errorMsg = "";
    var amountToRefund = 0;
    imgSaving.style.display= "block";


    if (txtAmount.value == "0") {
        errorMsg += "Amount for refund is zero. Cannot process return request.<br />";
        error = true;
    }


    if (partial == true) {
        if (txtAmountBeingRefunded.value == "") {
            errorMsg += "Please Enter the amount being refunded<br/>";
            error = true;
        }
        if (txtRemarks.value == "") {
            errorMsg += "Please Enter the reason of partial refund.<br/>";
            error = true;
        }

        var amountAllowed = parseFloat(txtAmount.value);
        amountBeingRefunded = parseFloat(txtAmountBeingRefunded.value).toFixed(2);
        if (amountBeingRefunded > amountAllowed) {
            errorMsg += "Amount being refunded cannot be more than amount of eligible refund. <br/>";
            error = true;
        }

        if (error == true) {
            setErrorHeader(errorMsg);
            msgHeader.style.display = "block";
            return;
        }


        mRemarks = txtRemarks.value;
        amountToRefund = amountBeingRefunded;
    }

    if (reject == true) {

        if (txtReason.value == "") {
            errorMsg += "Please Enter the reason of refund rejection.<br/>";
            error = true;
        }

        if (error == true) {
            setErrorHeader(errorMsg);
            msgHeader.style.display = "block";
            return;
        }

        mRemarks = txtReason.value;
    }

    if (full == true) {

        if (error == true) {
            setErrorHeader(errorMsg);
            msgHeader.style.display = "block";
            return;
        }

        amountToRefund = parseFloat(txtAmount.value).toFixed(2);
    }

    
this.style.display = "none";
    refundOrder(amountToRefund).then(() => {

        //refund has to be processed for prpaid cancelled orders.
        if (mOrder.cancelled && mOrder.COD == false) {
            processCancelInDb().then(() => {
                sendMail();
                setSuccessHeader("Return Processed Successfully");
            })
        }
        else {

            for (var i = 0; i < returnableProducts.length; i++) {
                var product = returnableProducts[i];
                var amtToRefund = parseFloat(amountToRefund);
                promiseList.push(processReturnInDb(true, reject, mRemarks, product.Product_Id, amtToRefund));
            }

            Promise.all(promiseList).then(() => {
                sendMail();
                setSuccessHeader("Return Processed Successfully");
            })
        }
    })
})

function refundPrepaidOrder(amtTobeRefunded) {

    //wallet money has been used for this transaction. Refund will happen in form of points
    if (mOrder.wallet_money_used > 0) {

        console.log("going to adjust ponts");
        return new Promise((resolve, reject) => {

            var points = Math.floor(amtTobeRefunded) * mPointsForOneRupee;
            creditPoints(points).then(()=>{
                resolve();
            })
        })

    }
    else {
        console.log("going to refund amount");

        return new Promise((resolve, reject) => {


            var url = '/payments/' + mOrder.payment_id + "/refund";
            var params = {
                amount: amtTobeRefunded * 100
            };

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function (res) {
                if (xmlHttp.readyState == 4) {
                    console.log("response text = " + xmlHttp.responseText);

                    res = JSON.parse(xmlHttp.responseText);
                    if (res.status == "success") {
                        resolve();
                        //sendRefundMail(refundMailProps);
                    }
                    else {
                        setErrorHeader(res.status);
                        reject();
                    }
                }
            }
            xmlHttp.open("POST", url, true);
            xmlHttp.setRequestHeader("Content-type", "application/json");
            xmlHttp.send(JSON.stringify(params));

        })
    }
}



function creditPoints(points) {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("users").doc(mOrder.customer_id);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            points: firebase.firestore.FieldValue.increment(points)
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

function refundOrder(amtTobeRefunded) {
    return new Promise((resolve, reject) => {

        if (mOrder.COD == true) {
            refundCODOrder(amtTobeRefunded);
            resolve();
        }
        else {
            console.log("wallet money used - " + mOrder.wallet_money_used);
            refundPrepaidOrder(amtTobeRefunded);
            resolve();
        }


    })


}


function refundCODOrder(amtTobeRefunded) {


    return new Promise((resolve, reject) => {

        var points = Math.floor(amtTobeRefunded) * mPointsForOneRupee;
        creditPoints(points).then(() => {
            resolve();
        })
    })

}

function processReturnInDb(return_processed, return_rejected, seller_return_remarks, productId, refund_amount) {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("orders").doc(mOrder.order_id)
            .collection("products").doc(productId);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            return_processed: return_processed,
            return_rejected: return_rejected,
            seller_return_remarks: seller_return_remarks,
            return_amount: refund_amount

        })
            .then(function () {
                console.log("updated the doc");
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                reject();
            });

    })

}

function processCancelInDb() {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("orders").doc(mOrder.order_id);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            prepaid_cancellation_processed: true

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




function sendMail() {
    var body = "";
    if (full) {
        var subject = 'My-Rupeaze Refund Confirmation';
        body = getFullRefundEmailMsg();
        sendEmail(mUser.Email, subject, body);
    }
    if (partial) {
        var subject = 'My-Rupeaze Partial Refund Confirmation';
        body = getPartialRefundEmailMsg();

        sendEmail(mUser.Email, subject, body);
    }
    if (reject) {
        var subject = 'My-Rupeaze Return Rejection Confirmation';
        body = getRefundRejectionEmailMsg();
        sendEmail(mUser.Email, subject, body);
    }
}

function getFullRefundEmailMsg() {

    var productName = "";

    for (var i = 0; i < returnableProducts.length; i++) {
        var product = returnableProducts[i];
        productName += "   <b>" + product.Title + "</b> <br/>";
    }


    var prepaidMsg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have initiated a refund of INR " + txtAmount.value
        + ", against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p>This amount will be credited to your bank account within 5-7 working days."
        + "In case of any questions please feel free to revert us back. </p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    if(mOrder.wallet_money_used > 0){

        prepaidMsg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have deposited a refund of INR " + txtAmount.value
        + " in your wallet  against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p>This amount has been credited in your wallet since you had used wallet money while purchasing this item."
        + "In case of any questions please feel free to revert us back. </p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    }

    var codMsg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have deposited a refund of INR " + txtAmount.value + " into your My Rupeaze Wallet"
        + ", against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p>You can use this wallet money for shopping at My Rupeaze app."
        + "In case of any questions please feel free to revert us back. </p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    if (mOrder.COD) {
        return codMsg;
    } else {
        return prepaidMsg;
    }
}

function getPartialRefundEmailMsg() {
    var productName = "";

    for (var i = 0; i < returnableProducts.length; i++) {
        var product = returnableProducts[i];
        productName += "   <b>" + product.Title + "</b> <br/>";
    }


    var prepaidMsg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have initiated a partial refund of INR " + txtAmountBeingRefunded.value
        + ", against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p><b>Partial Refund Reason: </b>" + mRemarks + "</p>"

        if(mOrder.wallet_money_used > 0){

            prepaidMsg = "<h3>Hello " + mAddress.Name + "</h3>"
            + "<p>Greetings from My Rupeaze!!</p>"
            + "<p> This is to inform you that we have deposited the refund of INR " + txtAmountBeingRefunded.value
            + "in your wallet against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
            + productName + "</p>"
    
            + "<p>This amount has been credited in your wallet since you had used wallet money while purchasing this item."
            + "In case of any questions please feel free to revert us back. </p>"
    
            + "<p>Keep shopping with us!!</p>"
    
            + "<p>With Kind Regards,<br/>"
            + "My Rupeaze Team </p>";
    
        }
        + "In case of any questions please feel free to revert us back. </p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    var codMsg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have deposited a partial refund of INR " + txtAmountBeingRefunded.value + " into your My Rupeaze Wallet"
        + ", against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p><b>Partial Refund Reason: </b>" + mRemarks + "</p>"

        + "<p>You can use this wallet money for shopping at My Rupeaze app."
        + "In case of any questions please feel free to revert us back. </p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    if (mOrder.COD) {
        return codMsg;
    } else {
        return prepaidMsg;
    }
}

function getRefundRejectionEmailMsg() {

    var productName = "";

    for (var i = 0; i < returnableProducts.length; i++) {
        var product = returnableProducts[i];
        productName += "   <b>" + product.Title + "</b> <br/>";
    }

    var msg = "<h3>Hello " + mAddress.Name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p>We regret to inform you that your return request has been rejected"
        + " against order id - <b>" + mOrder.order_id + "</b> for below products <br /> <br/>"
        + productName + "</p>"

        + "<p><b>Rejection Reason: </b>" + mRemarks + "</p>"

        + "<p>The consignment will be shipped back to you in the condition you returned back to us.</p>"

        + "<p>Keep shopping with us!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    return msg;

}

function setSuccessHeader(msg) {
    msgHeader.classList.remove("errorBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_ok.png");
    actionMsg.innerHTML = msg;
    msgHeader.classList.add("successBorder");
    window.scrollTo(0, document.body.scrollHeight);

    imgSaving.style.display = "none";
}
function setErrorHeader(msg) {

    msgHeader.classList.remove("successBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_error.png");
    actionMsg.innerHTML = msg;
    msgHeader.classList.add("errorBorder");

}