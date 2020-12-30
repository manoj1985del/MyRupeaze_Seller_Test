//const { connected } = require("process");

//const { DocumentReference } = require("@google-cloud/firestore");

var docLimit = 25;
var rupeeSymbol = "₹ ";
var pendingOrders = [];
// var users = [];
// var addresses = [];
var invoices = [];
var lastVisibleDoc;
var paginationFinished = false;

var queryList = [];
var pageIndex = 0;

let ordersProductMap = new Map();
let invoiceProductMap = new Map();

let ordersUsersMap = new Map();
let ordersAddressMap = new Map();

let productList = [];
var commision_map = new Map();

var mSeller;



var orderId;
var customerName;
var COD = "No";
var productName;
var qty;
var amt_payable;
var ordresFetched = false;
var usersFetched = false;
var addressesFetched = false;
var newInvoiceId = null;
var imgLoading = document.getElementById("loading");
var errMsg = document.getElementById("errorMsg");
var divErrorMsg = document.getElementById("divErrorMsg");

var btnNext = document.getElementById("next");
var btnPrevious = document.getElementById("previous");
var btnHome = document.getElementById("btnHome");
//var divContent = document.getElementById("content");
var btnSearch = document.getElementById("btnSearch");
var txtSearch = document.getElementById("txtSearch");

var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");

var nextQuery;


errMsg.textContent = "";


var statusValues = ["Select Status",
    "Order Confirmed. Preparing for Dispatch",
    "Order received. Seller Confirmation pending.",
    "Ready For Dispatch",
    "Order Ready. Waiting for Customre's Pickup",
    "Local Delivery Successful"];

var table = document.getElementById("tblPendingOrders");

var sellerId = localStorage.getItem("sellerid");
var pageHeader = document.getElementById("pageHeader");

var orderType = getQueryVariable("type");

loadComissionMap().then(() => {
    loadSellerDetails(sellerId).then(()=>{
        loadOrders();
    })
})

btnNext.addEventListener("click", function () {
    divProgress.style.display = "block";
    divContent.style.display = "none";
    //manoj new changes
    // imgLoading.style.display = "block";
    // divErrorMsg.style.width = "500px";
    // divErrorMsg.style.height = "500px";
    // btnPrevious.style.display = "block";
    // btnNext.style.display = "none";
    // btnPrevious.style.display = "none";
    pendingOrders = [];

    ordersUsersMap.clear();
    ordersAddressMap.clear();

    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex + 1];

    if (orderType == "pending") {
        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("Status", "==", "Order received. Seller Confirmation pending.")
                .limit(docLimit)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);


            pageIndex++;
            queryList.push(nextQuery);
            if (paginationFinished) {
                btnNext.style.display = "none";
            } else {
                btnNext.style.display = "block";
            }
            btnPrevious.style.display = "block";

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "all") {
        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            pageIndex++;
            queryList.push(nextQuery);

            if (paginationFinished) {
                btnNext.style.display = "none";
            } else {
                btnNext.style.display = "block";
            }
            btnPrevious.style.display = "block";

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "today") {
        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("order_date", ">=", today)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);


            pageIndex++;
            queryList.push(nextQuery);

            if (paginationFinished) {
                btnNext.style.display = "none";
            } else {
                btnNext.style.display = "block";
            }
            btnPrevious.style.display = "block";

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "unsettled") {
        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", false)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            pageIndex++;
            queryList.push(nextQuery);

            if (paginationFinished) {
                btnNext.style.display = "none";
            } else {
                btnNext.style.display = "block";
            }
            btnPrevious.style.display = "block";

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "settled") {
        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", true)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            pageIndex++;
            queryList.push(nextQuery);

            if (paginationFinished) {
                btnNext.style.display = "none";
            } else {
                btnNext.style.display = "block";
            }
            btnPrevious.style.display = "block";

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }
})

btnPrevious.addEventListener("click", function () {
    btnNext.style.display = "block";
    paginationFinished = false;
    divProgress.style.display = "block";
    divContent.style.display = "none";
    // imgLoading.style.display = "block";
    // divErrorMsg.style.width = "500px";
    // divErrorMsg.style.height = "500px";
    // errMsg.style.display = "none";
    // errMsg.textContent = "";
    // btnNext.style.display = "none";
    // btnPrevious.style.display = "none";

    pendingOrders = [];
    ordersUsersMap.clear();
    ordersAddressMap.clear();

    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex - 1];

    fetchOrders(query).then(() => {

        pageIndex--;
        if (pageIndex == 0) {
            btnPrevious.style.display = "none";

        } else {
            btnPrevious.style.display = "block";
        }

        fetchUsers().then(() => {
            fetchAddresses().then(() => {
                addPendingOrdersToTable();
            });
        });
    });

})

btnSearch.addEventListener("click", function () {
    if (txtSearch.value == "") {
        alert("Please enter order id");
        return;
    }

    pendingOrders = [];
    ordersAddressMap.clear();
    ordersUsersMap.clear();
    deleteTableRows();
    divProgress.style.display = "block";
    divContent.style.display = "none";
    // imgLoading.style.display = "block";
    // divErrorMsg.style.width = "500px";
    // divErrorMsg.style.height = "500px";
    // divContent.style.display = "none";

    var query = firebase.firestore()
        .collection('orders')
        .where("order_id", "==", txtSearch.value);
    txtSearch.value = "";



    fetchOrders(query).then(() => {
        fetchUsers().then(() => {
            fetchAddresses().then(() => {
                console.log("going to draw table");
                addPendingOrdersToTable();
            });
        });
    })


})
function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function loadOrders() {

    if (orderType == "pending") {
        pageHeader.textContent = "Pending Orders";
        var query = firebase.firestore()
            .collection('orders')
            .where("seller_id", "==", sellerId)
            .where("Status", "==", "Order received. Seller Confirmation pending.")
            .limit(docLimit);


        queryList.push(query);

        fetchOrders(query).then(() => {

            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("Status", "==", "Order received. Seller Confirmation pending.")
                .limit(docLimit)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);


            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        })
    }

    if (orderType == "all") {
        pageHeader.textContent = "Order History";
        var query = firebase.firestore()
            .collection('orders')
            .where("seller_id", "==", sellerId)
            .orderBy("order_date", "desc")
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "today") {
        pageHeader.textContent = "Today Orders";

        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);
        today.setSeconds(0);


        var query = firebase.firestore()
            .collection('orders')
            .where("seller_id", "==", sellerId)
            .where("order_date", ">=", today)
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("order_date", ">=", today)
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }



    if (orderType == "unsettled") {
        pageHeader.textContent = "Unsettled Orders";
        var query = firebase.firestore()
            .collection('orders')
            .where("seller_id", "==", sellerId)
            .where("settlement_done", "==", false)
            .orderBy("order_date", "desc")
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", false)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

    if (orderType == "settled") {
        pageHeader.textContent = "Settled Orders";
        var query = firebase.firestore()
            .collection('orders')
            .where("seller_id", "==", sellerId)
            .where("settlement_done", "==", true)
            .orderBy("order_date", "desc")
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", true)
                .orderBy("order_date", "desc")
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }

}




// if (orderType == "all") {

//     pageHeader.textContent = "Order History";
//     loadInvoices().then(() => {
//         addAllOrderstoTable();
//     });

// }




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

                // .then(function(){
                //    // ordersProductMap.set(order.order_id, productList);
                //     resolve();
                // });

            }).then(function () {
                //console.log("hello");
                ordersProductMap.set(order.order_id, productList);
                resolve();
            });

    })
}




function fetchOrders(query) {

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
                    errMsg.textContent = "No orders found";
                    errMsg.style.display = "block";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";

                    return;
                }



                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

                divProgress.style.display = "none";
                divContent.style.display = "block";

                // divErrorMsg.style.display = "none";
                // divErrorMsg.style.width = "0px";
                // divErrorMsg.style.height = "0px";
                // imgLoading.style.display = "none";
                // divContent.style.display = "block";

                snapshot.forEach(function (doc) {
                    var order = doc.data();

                    fetchProductsForOrder(order).then(() => {
                        console.log("product fetched for order");
                        pendingOrders.push(order);
                    }).then(() => {

                        console.log("pending orders length =" + pendingOrders.length);
                        console.log("snapshot docs length =" + snapshot.docs.length);



                        if (pendingOrders.length == snapshot.docs.length) {
                            resolve();


                        }
                    })

                })


            });
    })
}


function fetchUserAgainstOrder(order) {

    return new Promise((resolve, reject) => {
        var query = firebase.firestore()
            .collection('users').doc(order.customer_id);

        query.get()
            .then(function (doc) {

                if (doc.exists) {

                    var user = doc.data();
                    ordersUsersMap.set(order.order_id, user);
                    resolve();
                }
                else {
                    alert("Deleted user found against order id - " + order.order_id);
                    resolve();
                }
            });

    })
}


function fetchUsers() {
    var promiseList = [];
    return new Promise((resolve, reject) => {

        for (var i = 0; i < pendingOrders.length; i++) {
            var order = pendingOrders[i];
            promiseList.push(fetchUserAgainstOrder(order));

            // console.log(order.order_id);
            // var query = firebase.firestore()
            //     .collection('users').doc(order.customer_id);

            // query.get()
            //     .then(function (doc) {
            //         var user = doc.data();

            //         console.log(user.Name);
            //         users.push(user);
            //         if (users.length == pendingOrders.length) {
            //             resolve();
            //         }

            //     })

        }
        Promise.all(promiseList).then(() => {
            resolve();
        })


    });
}


function fetchAddressAgainstOrder(order) {

    return new Promise((resolve, reject) => {

        var user = ordersUsersMap.get(order.order_id);
        if (user == null || user == undefined) {
            alert("Order found against a deleted user - " + order.customer_id);
            resolve();
            return;
        }

        var query = firebase.firestore()
            .collection('users').doc(order.customer_id).collection("Addresses").doc(user.AddressId);

        query.get()
            .then(function (doc) {

                if (doc.exists) {

                    var address = doc.data();
                    ordersAddressMap.set(order.order_id, address);
                    resolve();
                }
                else {
                    resolve();
                }
            });

    })



}

function fetchAddresses() {

    var promiseList = [];
    return new Promise((resolve, reject) => {


        for (var i = 0; i < pendingOrders.length; i++) {
            var order = pendingOrders[i];
            promiseList.push(fetchAddressAgainstOrder(order));


            // var query = firebase.firestore()
            //     .collection('users').doc(order.customer_id).collection("Addresses").doc(user.AddressId);



            // query.get()
            //     .then(function (doc) {

            //         var address = doc.data();
            //         addresses.push(address);
            //         if (addresses.length == pendingOrders.length) {
            //             resolve();
            //         }

            //     });
        }
        Promise.all(promiseList).then(() => {
            resolve();
        })

    });
}

function createTableHeadersForPendingOrders() {
    var tr = document.createElement('tr');

    var imageHeader = document.createElement("th");
    var orderHeader = document.createElement('th');
    var customerNmaeHeader = document.createElement('th');
    var productNameHeader = document.createElement('th');
    var qtyHeader = document.createElement('th');
    var amtPayableHeader = document.createElement('th');
    var codHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    imageHeader.innerHTML = "Image";
    orderHeader.innerHTML = "Order Id";
    customerNmaeHeader.innerHTML = "Customer Name";
    productNameHeader.innerHTML = "Product Name";
    qtyHeader.innerHTML = "Qty";
    amtPayableHeader.innerHTML = "Amount Payable";
    codHeader.innerHTML = "COD";
    actionHeader.innerHTML = "Action";

    tr.appendChild(imageHeader);
    tr.appendChild(orderHeader);
    tr.appendChild(customerNmaeHeader);
    tr.appendChild(productNameHeader);
    tr.appendChild(qtyHeader);
    tr.appendChild(amtPayableHeader);
    tr.appendChild(codHeader);
    tr.appendChild(actionHeader);

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

function addPendingOrdersToTable() {


    createTableHeaders();
    for (var i = 0; i < pendingOrders.length; i++) {

        var index = i.toString();

        var order = pendingOrders[i];
        var user = ordersUsersMap.get(order.order_id);
        var address = ordersAddressMap.get(order.order_id);

        //create a table row
        var tr = document.createElement("tr");
        var id = "tr" + i.toString();
        tr.setAttribute("id", id);

        var tdImage = document.createElement("td");
        var tdOrderDate = document.createElement("td");
        var tdOrderId = document.createElement("td");
        var tdCustomerName = document.createElement("td");
        var tdTitle = document.createElement("td");
        var tdProductQty = document.createElement("td");
        var tdAmtPayable = document.createElement("td");
        var tdPaymentId = document.createElement("td");
        var tdCOD = document.createElement("td");
        var tdStatus = document.createElement("td");
        var tdAction = document.createElement("td");


        var divCustomerName = document.createElement("div");
        var divOrderId = document.createElement("div");
        var divPaymentId = document.createElement("div");
        var divCOD = document.createElement("div");
        var divAction = document.createElement("div");
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


        var orderId = document.createElement("span");
        orderId.textContent = order.order_id;
        divOrderId.appendChild(orderId);

        if (order.pickup_from_store != null) {
            if (order.pickup_from_store) {
                var divPikcupFromStore = document.createElement('div');
                var spanPickupFromStore = document.createElement('span');
                spanPickupFromStore.textContent = "Pickup from the store order";
                spanPickupFromStore.style.color = "#ff0000";
                spanPickupFromStore.style.marginTop = "10px";
                spanPickupFromStore.style.fontWeight = "bold";
                divPikcupFromStore.appendChild(spanPickupFromStore);
                divOrderId.appendChild(divPikcupFromStore);
            }
        }

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

        var divConfirm = document.createElement("div");
        divConfirm.setAttribute("id", "idConfrimDiv" + index);

        var divConfirmOder = document.createElement("div");
        divConfirmOder.style.marginBottom = "10px";
        var btnConfirmOrder = document.createElement("button");
        btnConfirmOrder.setAttribute("id", index);
        btnConfirmOrder.textContent = "Confirm Order";
        btnConfirmOrder.style.width = "150px";
        divConfirmOder.appendChild(btnConfirmOrder);
        divConfirm.appendChild(divConfirmOder);



        var divViewProducts = document.createElement("div");
        divViewProducts.style.marginBottom = "10px";
        var btnViewOrders = document.createElement("button");
        btnViewOrders.textContent = "View Products";
        btnViewOrders.style.width = "150px";
        btnViewOrders.setAttribute("id", order.order_id);
        divViewProducts.appendChild(btnViewOrders);
        divConfirm.appendChild(divViewProducts);


        var divCancelOrder = document.createElement("div");
        divCancelOrder.style.marginBottom = "10px";
        var btnCancelOrder = document.createElement("button");
        btnCancelOrder.textContent = "Cancel Order";
        btnCancelOrder.style.width = "150px";
        btnCancelOrder.setAttribute("id", order.order_id);
        divCancelOrder.appendChild(btnCancelOrder);
        divConfirm.appendChild(divCancelOrder);

        if (order.Status == "Order Confirmed. Preparing for Dispatch" || order.Status == "Order received. Seller Confirmation pending."
            || order.Status == "Delivery Failed." || order.Status == "Customer denied delivery") {
            //console.log("hiding cancel order div for status " + order.Status);
            divCancelOrder.style.display = "block";
            divViewProducts.style.display = "block";
        }
        else {
            divCancelOrder.style.display = "none";
            divViewProducts.style.display = "none";
        }

        //append confirm button and cancel button to divActoin
        divAction.appendChild(divConfirm);


        var divAfterConfirm = document.createElement("div");
        divAfterConfirm.setAttribute("id", "idAfterConfimrDiv" + index);
        var divPrintInvoice = document.createElement("div");
        divPrintInvoice.style.marginBottom = "10px";
        var btnPrintInvoice = document.createElement("button");
        btnPrintInvoice.textContent = "Print Invoice";
        btnPrintInvoice.setAttribute("id", index);
        btnPrintInvoice.style.width = "150px";
        divPrintInvoice.appendChild(btnPrintInvoice);
        divAfterConfirm.appendChild(divPrintInvoice);

        var divPrintShipLabel = document.createElement("div");
        divPrintShipLabel.style.marginBottom = "10px";
        var btnPrintShipLabel = document.createElement("button");
        btnPrintShipLabel.textContent = "Print Shipping Label";
        btnPrintShipLabel.setAttribute("id", index);
        btnPrintShipLabel.style.width = "150px";
        divPrintShipLabel.appendChild(btnPrintShipLabel);
        divAfterConfirm.appendChild(divPrintShipLabel);

        var divLocalDelivery = document.createElement("div");
        divLocalDelivery.style.marginBottom = "10px";
        var btnLocalDelivery = document.createElement("button");
        btnLocalDelivery.textContent = "Local Delivery";
        btnLocalDelivery.setAttribute("id", index);
        btnLocalDelivery.style.width = "150px";
        divLocalDelivery.appendChild(btnLocalDelivery);
        divAfterConfirm.appendChild(divLocalDelivery);

        if (order.cancelled) {
            divConfirm.style.display = "none";
            divAfterConfirm.style.display = "none";
        }
        else {

            if (order.invoice_id == null) {
                divAfterConfirm.style.display = "none";
            }
            else {
                divConfirmOder.style.display = "none";
            }
        }



        if (order.delivery_agent_id != null) {
            btnLocalDelivery.disabled = true;
        }
        else {
            btnLocalDelivery.disabled = false;
        }



        divAction.appendChild(divAfterConfirm);

        var divStatus = document.createElement("div");


        var divStatusText = document.createElement("div");
        divStatusText.style.marginBottom = "10px";
        var spanStatusText = document.createElement("span");
        spanStatusText.innerHTML = order.Status + "<br/><hr/>";
        spanStatusText.setAttribute("id", "StatusText|" + order.order_id);
        divStatusText.appendChild(spanStatusText);
        divStatus.appendChild(spanStatusText);

        var divChangeStatus = document.createElement("div");
        var textChangeStatus = document.createElement("span");
        textChangeStatus.innerHTML = "<b>Change Status:</b>";
        divChangeStatus.appendChild(textChangeStatus);
        var select = document.createElement("select");
        var btnSetStatus = document.createElement("button");
        btnSetStatus.setAttribute("id", "status|" + order.order_id);

        btnSetStatus.style.marginTop = "10px";
        btnSetStatus.textContent = "Set Status";
        divChangeStatus.appendChild(select);
        divChangeStatus.appendChild(btnSetStatus);
        divStatus.appendChild(divChangeStatus);


        select.name = "status";
        select.id = "select|" + order.order_id;


        if (order.Status.includes("Delivered") || order.Status.includes("Cancelled") || order.Status.includes("rejected")
            || order.invoice_id == null) {
            select.disabled = true;
        }




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

        var status = order.Status;

        if (order.pickup_from_store == false) {
            if (status == "Order Confirmed. Preparing for Dispatch" || status ==
                "Order received. Seller Confirmation pending.") {
                divChangeStatus.style.display = "block";
            } else {
                divChangeStatus.style.display = "none";
            }
        }

        btnSetStatus.style.display = "none";

        // select.value = status;

        select.addEventListener("change", function () {
            for (var i = 0; i < pendingOrders.length; i++) {
                var order = pendingOrders[i];
                var selectedOrdrerId = this.id.toString().split("|")[1];
                if (selectedOrdrerId == order.order_id) {
                    var btn = document.getElementById("status|" + order.order_id);
                    status = this.value;
                    btn.style.display = "block";
                    break;

                }
            }
        })

        btnSetStatus.addEventListener("click", function () {

            var id = this.id.toString();
            var res = id.split("|");
            var orderid = res[1];
            var lOrder;
            for (var i = 0; i < pendingOrders.length; i++) {
                var ord = pendingOrders[i];
                if (ord.order_id == orderid) {
                    lOrder = ord;
                    break;
                }
            }

            if (status == "Cancelled" || status == "Order Cancelled by admin due to non-conformance.") {
                alert("You cannot set this status");
                return;
            }

            var statusElement = document.getElementById("StatusText|" + lOrder.order_id);
            statusElement.textContent = status;

            updateOrderStatusFromInvoice(lOrder.invoice_id, lOrder.order_id, lOrder.product_id, status);
            this.style.display = "none";

        })

        var divImgProduct = document.createElement("div");
        var divProductName = document.createElement("div");
        var divProductQty = document.createElement("div");
        var divAmountPayable = document.createElement("div");


        var totalAmtPayable = 0;
        var productList = ordersProductMap.get(order.order_id);
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

                    spanReturn.innerHTML = "<br/><b>Return Requested (Qty : " + product.return_qty + ")</b>"
                }
                else {
                    spanReturn.innerHTML = "<br/><b>Return Requested  (Qty : " + product.return_qty + ") And Processed.</b>"
                }
                spanReturn.style.color = "#ff0000";
            }

            var spanReplacement = document.createElement("span");
            if (product.replacement_requested != null) {
                if (product.replacement_requested) {
                    spanReplacement.style.color = "#ff0000";
                    spanReplacement.innerHTML = "<br/><b>Replacement Requested (Qty : " + product.replacement_qty + ")</b>"
                }
            }

            var spanCancellation = document.createElement("span");
            if (product.cancelled_by_seller != null) {
                if (product.cancelled_by_seller) {
                    spanCancellation.style.color = "#ff0000";
                    spanCancellation.innerHTML = "<b>(Product Cancelled by Seller)</b>"
                }
            }

            var spanIsReplaceOrder = document.createElement("span");
            if (order.replacement_order != null) {
                if (order.replacement_order) {
                    spanIsReplaceOrder.style.color = "#ff0000";
                    spanIsReplaceOrder.innerHTML = "<br/><b>Replacement Order (Original Order Id : " + order.original_order_id + ")</b>"
                }

            }

            productTitle.innerHTML = title;
            divProductTitleLocal.appendChild(productTitle);
            divProductName.appendChild(divProductTitleLocal);
            divProductName.appendChild(spanReturn);
            divProductName.appendChild(spanReplacement);
            divProductName.appendChild(spanIsReplaceOrder);
            divProductName.appendChild(spanCancellation);

            var divQtyLocal = document.createElement("div");
            divQtyLocal.style.marginBottom = "10px";
            var productQty = document.createElement("span");
            productQty.textContent = product.Qty;
            console.log("prodcut qty = " + product.Qty);
            divQtyLocal.appendChild(productQty);
            divProductQty.appendChild(divQtyLocal);

            var divAmtPayableLocal = document.createElement("div");
            divAmtPayableLocal.style.marginBottom = "10px";
            var amtPayable = product.Qty * product.Offer_Price;
            if (order.cancelled) {
                amtPayable = 0;
            }

            if(product.cancelled_by_seller){
                amtPayable = 0;
            }

            if (product.return_requested && product.return_processed) {
                amtPayable = amtPayable - product.return_amount;
            }

            totalAmtPayable += amtPayable;
            var formattedAmtPayable = rupeeSymbol + numberWithCommas(amtPayable);
            var amountPayable = document.createElement("span");

            var commission = commision_map.get(product.Category);

            var seller_part = amtPayable - (amtPayable * commission / 100);
            var admin_part = amtPayable - seller_part;

            seller_part = seller_part.toFixed(2);
            admin_part = admin_part.toFixed(2);
            // var text = "<hr /><b>Commission: </b> " + commission + "%<br/>"
            //     + "<b>Seller: </b>" + seller_part + "<br/>"
            //     + "<b>Admin: </b>" + admin_part;
              var text = "";
            formattedAmtPayable += "<br/>" + text;
            amountPayable.innerHTML = formattedAmtPayable;
            divAmtPayableLocal.appendChild(amountPayable);
            divAmountPayable.appendChild(divAmtPayableLocal);

            // var formattedAmtPayable = rupeeSymbol + numberWithCommas(amtPayable);
            // var amountPayable = document.createElement("span");
            // amountPayable.textContent = formattedAmtPayable;
            // divAmtPayableLocal.appendChild(amountPayable);
            // divAmountPayable.appendChild(divAmtPayableLocal);
        }

        var span = document.createElement("span");
        var text = "<br/><hr/>Total: " + rupeeSymbol + numberWithCommas(totalAmtPayable);
        span.innerHTML = text;
        divAmountPayable.appendChild(span);

        if (order.cancelled) {
            var spanCancel = document.createElement("span");
            if (order.prepaid_cancellation_processed == false) {
                spanCancel.innerHTML = "<br/><b>Order Cancelled.</b>";
            } else {
                spanCancel.innerHTML = "<br/><b>Order Cancelled And Processed.</b>"
            }

            spanCancel.style.color = "#ff0000";
            divProductName.appendChild(spanCancel);

        }

        if (order.COD == false && order.payment_id == null) {
            var spanNoPaymentDone = document.createElement("span");
            spanNoPaymentDone.innerHTML = "<br/><b>Payment not captured yet.</b>";
            spanNoPaymentDone.style.color = "#ff0000";
            divPaymentId.appendChild(spanNoPaymentDone);
            //was a prepaid order but payment id was not captured.. Seller cannot take any action on such products.
            divAction.style.display = "none";
            divAfterConfirm.style.display = "none";

        }

        tdImage.appendChild(divImgProduct);
        tdOrderDate.appendChild(divOrderDate);
        tdOrderId.appendChild(divOrderId);
        tdCustomerName.appendChild(divCustomerName);
        tdTitle.appendChild(divProductName);
        tdAmtPayable.appendChild(divAmountPayable);
        tdPaymentId.appendChild(divPaymentId);
        tdProductQty.appendChild(divProductQty);
        tdCOD.appendChild(divCOD);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        tr.appendChild(tdImage);
        tr.appendChild(tdOrderDate);
        tr.appendChild(tdOrderId);
        tr.appendChild(tdCustomerName)
        tr.appendChild(tdTitle);
        tr.appendChild(tdProductQty);
        tr.appendChild(tdAmtPayable);
        tr.appendChild(tdPaymentId);
        tr.appendChild(tdCOD);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);
        table.appendChild(tr);

        btnConfirmOrder.addEventListener("click", function () {

            var index = parseInt(this.id);
            var order = pendingOrders[index];
            var user = ordersUsersMap.get(order.order_id);
            var address = ordersAddressMap.get(order.order_id);

            var products = ordersProductMap.get(order.order_id);

            //console.log(pendingOrders[index]);

            newInvoiceId = null;
            getNewInvoiceId().then(() => {
                pendingOrders[index].invoice_id = newInvoiceId;
                invoices.push(newInvoiceId);
                updateOrderInvoice(order.order_id, newInvoiceId).then(() => {
                    updateOrderStatus(order.order_id, "Order Confirmed. Preparing for Dispatch").then(() => {
                        createInvoice(order, user, address).then(() => {

                            var divConfirmId = "idConfrimDiv" + this.id.toString();
                            var divAfterConfimrId = "idAfterConfimrDiv" + this.id.toString();

                            var divConfirm = document.getElementById(divConfirmId);
                            var divAfterConfirm = document.getElementById(divAfterConfimrId);

                            divConfirm.style.display = "none";
                            divAfterConfirm.style.display = "block";
                        })
                    });

                });


            });

        });

        btnPrintInvoice.addEventListener("click", function () {
            var index = parseInt(this.id);
            var order = pendingOrders[index];
            window.location.href = "pdf.html?invoiceid=" + order.invoice_id;
        })

        btnViewOrders.addEventListener("click", function(){
            var orderId = this.id.toString();
            window.location.href = "view_products_against_order.html?order_id=" + orderId;
        })

        btnLocalDelivery.addEventListener("click", function () {
            var index = parseInt(this.id);
            var order = pendingOrders[index];
            window.location.href = "local_delivery.html?orderid=" + order.order_id;
        })

        btnPrintShipLabel.addEventListener("click", function () {
            var index = parseInt(this.id);
            console.log(pendingOrders);
            // alert(index);

            var invoiceId = pendingOrders[index].invoice_id;
            // alert(invoiceId);
            window.location.href = "shipping_label.html?invoiceid=" + invoiceId;
        })

        btnCancelOrder.addEventListener("click", function () {
            if (confirm("Are you sure you want to cancel this order?")) {
                var index = parseInt(this.id);
                var order;
                for(var i = 0; i < pendingOrders.length; i++){
                    var ord = pendingOrders[i];
                    if(ord.order_id == this.id){
                        order = ord;
                        break;
                    }
                }
                
                cancelOrder(order);
            }
        })

    }
}

function cancelOrder(order) {

    var washingtonRef = firebase.firestore().collection("orders").doc(order.order_id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        Status: "Order Cancelled by Seller",
        cancelled: true
    })
        .then(function () {
            creditPoints(order).then(()=>{
                alert("order cancelled successfully");
            })
          
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}




function createTableHeaders() {
    var tr = document.createElement('tr');

    var imageHeader = document.createElement("th");
    var dateHeader = document.createElement("th");
    var orderHeader = document.createElement('th');
    var customerNmaeHeader = document.createElement('th');
    var productNameHeader = document.createElement('th');
    var qtyHeader = document.createElement('th');
    var amtPayableHeader = document.createElement('th');
    var paymentIdHeader = document.createElement('th');
    var codHeader = document.createElement('th');
    var statusHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    imageHeader.innerHTML = "Image";
    dateHeader.innerHTML = "Order Date";
    orderHeader.innerHTML = "Order Id";
    customerNmaeHeader.innerHTML = "Customer Name";
    productNameHeader.innerHTML = "Product Name";
    qtyHeader.innerHTML = "Qty";
    amtPayableHeader.innerHTML = "Amount Payable";
    paymentIdHeader.innerHTML = "Payment Id";
    codHeader.innerHTML = "COD";
    statusHeader.innerHTML = "Status";
    actionHeader.innerHTML = "Action";

    tr.appendChild(imageHeader);
    tr.appendChild(dateHeader);
    tr.appendChild(orderHeader);
    tr.appendChild(customerNmaeHeader);
    tr.appendChild(productNameHeader);
    tr.appendChild(qtyHeader);
    tr.appendChild(amtPayableHeader);
    tr.appendChild(paymentIdHeader);
    tr.appendChild(codHeader);
    tr.append(statusHeader);
    tr.appendChild(actionHeader);

    table.appendChild(tr);

}


function getNewInvoiceId() {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection('online_invoices')
        .where("seller_id", '==', mSeller.seller_id)
        .orderBy("timestamp", "desc").limit(1)
        .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var invoice = doc.data();
                    var invoiceId = invoice.invoice_id;
                    var tmpInvoice = invoiceId.split('_');
                    var tmpInvoiceId = tmpInvoice[1];
                    var invoiceNum = parseInt(tmpInvoiceId.substring(3, tmpInvoiceId.length));
                    invoiceNum = invoiceNum + 1;
                    var newInvoiceNum = appendNumber(invoiceNum, 3);
                    newInvoiceId = mSeller.merchant_id +  "_INV" + newInvoiceNum;
                    resolve();


                });
            })
            .then(function () {
                console.log("no invoice found");
                if (newInvoiceId == null) {
                    newInvoiceId = mSeller.merchant_id +  "_INV001";
                    resolve();
                }
            })
            .catch(function (error) {
                console.log(error);
                newInvoiceId = mSeller.merchant_id +  "_INV001";
                resolve();
            });


    })

}

function appendNumber(number, digits) {
    return String(number).padStart(digits, '0');
}

function createInvoice(order, user, address) {

    return new Promise((resolve, reject) => {



        // var sellerName = mSeller.company_name;
        // var sellerAddressLine1 = mSeller.
        // var sellerAddressLine2 = localStorage.getItem("sellerAddressLine2");
        // var sellerAddressLine3 = localStorage.getItem("sellerAddressLine3");
        // var sellerCity = localStorage.getItem("sellerCity");
        // var sellerState = localStorage.getItem("sellerState");
        // var sellerCountry = "INDIA";
        // var sellerPin = localStorage.getItem("sellerpin");
        // var sellerPAN = localStorage.getItem("sellerPAN");
        // var sellerGST = localStorage.getItem("sellerGST");

        firebase.firestore().collection('online_invoices').doc(newInvoiceId).set({
            invoice_id: newInvoiceId,
            order_id: order.order_id,
            order_date: order.order_date,
            COD: order.COD,
            seller_id: order.seller_id,
            Status: order.Status,
            seller_name: mSeller.company_name,
            sellerAddressLine1: mSeller.address_line1,
            sellerAddressLine2: mSeller.address_line2,
            sellerAddressLine3:mSeller.address_line3,
            sellerCity: mSeller.city,
            sellerState: mSeller.state,
            sellerCountry: "INDIA",
            sellerPin: mSeller.pincode,
            sellerPAN: mSeller.pan_no,
            sellerGST: mSeller.gstin,
            ship_to_name: address.Name,
            ship_to_address_line1: address.AddressLine1,
            ship_to_address_line2: address.AddressLine2,
            ship_to_address_line3: address.AddressLine3,
            ship_to_city: address.City,
            ship_to_phone: address.Phone,
            ship_to_state: address.State,
            ship_to_landmark: address.Landmark,
            ship_to_pin: address.Pincode,

            bill_to_name: user.Name,
            bill_to_address_line1: user.AddressLine1,
            bill_to_address_line2: user.AddressLine2,
            bill_to_address_line3: user.AddressLine3,
            bill_to_city: user.City,
            bill_to_phone: user.Phone,
            bill_to_state: user.State,
            bill_to_landmark: user.Landmark,
            bill_to_pin: user.Pincode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                //console.log("order = " + order);
                var productList = ordersProductMap.get(order.order_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];

                    firebase.firestore().collection('online_invoices').doc(newInvoiceId).collection("products").doc(product.Product_Id).set({
                        GST: product.GST,
                        ImageUrlCover: product.ImageUrlCover,
                        MRP: product.MRP,
                        Offer_Price: product.Offer_Price,
                        Product_Id: product.Product_Id,
                        Qty: product.Qty,
                        SoldBy: product.SoldBy,
                        Title: product.Title,
                        seller_id: order.seller_id,
                    })
                }
              
            })
            .then(()=>{
                resolve();
            })
            .catch(function (error) {
                console.error('Error writing new message to database', error);
                reject();
                return false;
            });

    });


}

function updateDeliveryTimestamp(orderid) {


    var docRef = firebase.firestore().collection("orders").doc(orderid);

    // Set the "capital" field of the city 'DC'
    return docRef.update({
        delivery_date: firebase.firestore.FieldValue.serverTimestamp() // "Order Confirmed. Preparing for Dispatch"
    })
        .catch(function (error) {
            //reject();
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}

function updateOrderInvoice(orderid, invoiceId) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("orders").doc(orderid);

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            invoice_id: invoiceId // "Order Confirmed. Preparing for Dispatch"
        }).then(function () {

            resolve();
        })
            .catch(function (error) {
                reject();
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });


    });

}


function updateOrderStatus(ordrid, status) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("orders").doc(ordrid);

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            Status: status // "Order Confirmed. Preparing for Dispatch"
        }).then(function () {
            console.log("order update successful");
            if (status == "Delivered") {
                updateDeliveryTimestamp(ordrid);

            }
            resolve();
        })
            .catch(function (error) {
                reject();
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });


    });

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateOrderStatusFromInvoice(invoice_id, order_id, product_id, value) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("invoices").doc(invoice_id)

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            Status: value
        }).then(function () {
            updateOrderStatus(order_id, value).then(() => {
                resolve();
            })

        })
            .catch(function (error) {
                reject();
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });


    });

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

function loadSellerDetails(sellerid) {
    return new Promise((resolve, reject) => {
 
       var docRef = firebase.firestore().collection("seller").doc(sellerid);
 
       docRef.get().then(function (doc) {
          if (doc.exists) {
             mSeller = doc.data();
             resolve();
          } else {
             mSeller = null;
             resolve();
          }
       }).catch(function (error) {
          console.log("Error getting document:", error);
          reject();
       });
 
    })
 
 }
function creditPoints(order){
    return new Promise((resolve, reject) => {
        var productList = ordersProductMap.get(order.order_id);
        var totalPoints = 0;
        var totalPrice = 0;
        var pointsEarned = 0;
        for(var i = 0; i < productList.length; i++){
            var product = productList[i];
            if(product.cancelled_by_seller){
                continue;
            }
            pointsEarned += product.points_added;
            totalPrice += product.Offer_Price * product.Qty;
        }
        //for a non code order points credited should be (points against price of product) - (points earned while purchase)
        totalPoints = (totalPrice * 8) - pointsEarned;
        if(order.COD){
            totalPoints = -pointsEarned;
        }

        var docRef = firebase.firestore().collection("users").doc(order.customer_id);

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            points: firebase.firestore.FieldValue.increment(totalPoints)
        }).then(function () {
            resolve();

        })
            .catch(function (error) {
                reject();
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

    });

}
