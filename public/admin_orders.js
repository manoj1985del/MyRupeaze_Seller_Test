

var promiseList = [];
var queryList = [];
var pageIndex = 0;
var lastVisibleDoc;
var paginationFinished = false;


var rupeeSymbol = "₹ ";
var pendingOrders = [];
//var users = [];
//var addresses = [];
var invoices = [];




let ordersProductMap = new Map();
let invoiceProductMap = new Map();
let ordersUsersMap = new Map();
let ordersAddressMap = new Map();

let productList = [];
var commision_map = new Map();
var orderSellerMap = new Map();

var searchByDateRange = false;
var dtFirstDate;
var dtLastDate;



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
//var btnHome = document.getElementById("btnHome");
//var divContent = document.getElementById("content");
var btnSearch = document.getElementById("btnSearch");
var txtSearch = document.getElementById("txtSearch");

var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");

var cmbSearchBy = document.getElementById("cmbSearchBy");
var dtFrom = document.getElementById("dtFrom");
var dtEnd = document.getElementById("dtEnd");
var divDateFilter = document.getElementById("divDateFilter");
var divSearchBy = document.getElementById("divSearchBy");

var nextQuery;
var sellerid = localStorage.getItem('sellerid');


errMsg.textContent = "";

class RefundMailProps {
    constructor(destName, destEmail, orderId, productList, amtRefunded) {
        this.destName = destName;
        this.destEmail = destEmail;
        this.orderId = orderId;
        this.productList = productList;
        this.amtRefunded = amtRefunded;
    }
}


var statusValues = [
    "Ready For Dispatch",
    "Dispatched",
    "Consigment in Transit, Arriving Soon",
    "Delivered",
    "Arriving Monday",
    "Arriving Tuesday",
    "Arriving Wednesday",
    "Arriving Thursday",
    "Arriving Friday",
    "Arriving Saturday",
    "Arriving Sunday",
    "Arriving Today",
    "Delivery attempted. Will redeliver tomorrow",
    "Customer denied delivery",
    "Order Cancelled by admin due to non-conformance.",
    "Delivery Failed."];

var table = document.getElementById("tblPendingOrders");

var pageHeader = document.getElementById("pageHeader");

var orderType = getQueryVariable("type");
var querySellerId = null;


loadComissionMap().then(() => {
    loadOrders();
})

cmbSearchBy.addEventListener("change", function () {

    if (this.value == "None") {
        divSearchBy.style.display = "none";
    }
    else {
        divSearchBy.style.display = "block";

        if (this.value == "Order Id") {
            txtSearch.style.display = "block";
            divDateFilter.style.display = "none";
        }

        if (this.value == "Date Range") {
            txtSearch.style.display = "none";
            divDateFilter.style.display = "block";
        }
    }
    // <option value="None">No Filter</option>
    //                 <option value="Order Id">Order Id</option>
    //                 <option value="Date Range">Date Range</option>
})

btnNext.addEventListener("click", function () {
    divProgress.style.display = "block";
    divContent.style.display = "none";
    pendingOrders = [];

    ordersUsersMap.clear();
    ordersAddressMap.clear();
    // users = [];
    // addresses = [];
    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex + 1];

    if (orderType == "pending") {
        fetchOrders(query).then(() => {
            if (searchByDateRange) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Order received. Seller Confirmation pending.")
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .limit(docLimit)
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);

            }
            else {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Order received. Seller Confirmation pending.")
                    .limit(docLimit)
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }



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
            if (searchByDateRange) {

                if (sellerid == null) {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                else {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .where("seller_id", "==", sellerid)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }

            }
            else {

                if(sellerid == null){
                    nextQuery = firebase.firestore()
                    .collection('orders')
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
                }
                else{
                    nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
                }
               
            }


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
            if (sellerid == null) {
                if (searchByDateRange) {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);

                }
                else {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
            }
            else {
                if (searchByDateRange) {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("seller_id", "==", sellerid)
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                else {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("seller_id", "==", sellerid)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }


            }


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
            if (searchByDateRange) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", true)
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);

            }
            else {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", true)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }

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

    // .where("Status", "==", "Ready For Dispatch")

    if (orderType == "waiting_for_pickup") {


        fetchOrders(query).then(() => {
            if (sellerid == null) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Ready For Dispatch")
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }
            else {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Ready For Dispatch")
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);

            }


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

    pendingOrders = [];
    ordersUsersMap.clear();
    ordersAddressMap.clear();
    //users = [];
    // addresses = [];
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


    var query;


    if (cmbSearchBy.value == "Order Id") {

        searchByDateRange = false;
        if (txtSearch.value == "") {
            alert("Please enter order id");
            return;
        }

        query = firebase.firestore()
            .collection('orders')
            .where("order_id", "==", txtSearch.value);


        txtSearch.value = "";
    }

    else if (cmbSearchBy.value == "Date Range") {
        if (dtFrom.value == "") {
            alert("Please select start date");
            return;
        }

        if (dtEnd.value == "") {
            alert("Please select end date");
            return;
        }

        dtFirstDate = new Date(dtFrom.value);
        dtFirstDate.setHours(0);
        dtFirstDate.setMinutes(0);
        dtFirstDate.setMilliseconds(0);
        dtFirstDate.setSeconds(0);


        dtLastDate = new Date(dtEnd.value);
        dtLastDate.setHours(23);
        dtLastDate.setMinutes(59);
        dtLastDate.setMilliseconds(999);
        dtLastDate.setSeconds(59);

        searchByDateRange = true;
        loadOrders();
        return;


    }

    else {
        console.log("inside else");
        searchByDateRange = false;
        query = firebase.firestore()
            .collection('orders')
            .orderBy("order_date", "desc");
    }

    pendingOrders = [];
    ordersAddressMap.clear();
    ordersUsersMap.clear();
    deleteTableRows();
    divProgress.style.display = "block";
    divContent.style.display = "none";


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


    pendingOrders = [];
    ordersAddressMap.clear();
    ordersUsersMap.clear();
    deleteTableRows();
    divProgress.style.display = "block";
    divContent.style.display = "none";


    if (orderType == "pending") {
        pageHeader.textContent = "Pending Orders";
        var query;
        if (searchByDateRange) {

            query = firebase.firestore()
                .collection('orders')
                .where("Status", "==", "Order received. Seller Confirmation pending.")
                .where("order_date", ">=", dtFirstDate)
                .where("order_date", "<=", dtLastDate)
                .limit(docLimit);
        }
        else {
            query = firebase.firestore()
                .collection('orders')
                .where("Status", "==", "Order received. Seller Confirmation pending.")
                .limit(docLimit);

        }



        queryList.push(query);

        fetchOrders(query).then(() => {

            if (searchByDateRange) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Order received. Seller Confirmation pending.")
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .limit(docLimit)
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);

            }
            else {

                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Order received. Seller Confirmation pending.")
                    .limit(docLimit)
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);

            }



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
        var query;


        if (searchByDateRange) {

            if (sellerid == null) {
                query = firebase.firestore()
                    .collection('orders')
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
            else {
                query = firebase.firestore()
                    .collection('orders')
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
        }
        else {
            if (sellerid == null) {
                query = firebase.firestore()
                    .collection('orders')
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
            else {
                query = firebase.firestore()
                    .collection('orders')
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }

        }

        queryList.push(query);

        fetchOrders(query).then(() => {
            if (searchByDateRange) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }
            else {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }

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
            .where("order_date", ">=", today)
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
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
        var query;
        if (sellerid == null) {
            if (searchByDateRange) {
                query = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", false)
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
            else {
                query = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", false)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
        }
        else {
            if (searchByDateRange) {
                query = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", false)
                    .where("seller_id", "==", sellerid)
                    .where("order_date", ">=", dtFirstDate)
                    .where("order_date", "<=", dtLastDate)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }
            else {
                query = firebase.firestore()
                    .collection('orders')
                    .where("settlement_done", "==", false)
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .limit(docLimit);
            }

        }

        queryList.push(query);

        fetchOrders(query).then(() => {
            if (sellerid == null) {
                if (searchByDateRange) {

                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                else {
                    nextQuery = firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);

                }
            }
            else {

                if (searchByDateRange) {
                    firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("seller_id", "==", sellerid)
                        .where("order_date", ">=", dtFirstDate)
                        .where("order_date", "<=", dtLastDate)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                else {

                    firebase.firestore()
                        .collection('orders')
                        .where("settlement_done", "==", false)
                        .where("seller_id", "==", sellerid)
                        .orderBy("order_date", "desc")
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }


            }

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
            .where("settlement_done", "==", true)
            .orderBy("order_date", "desc")
            .limit(docLimit);

        queryList.push(query);

        fetchOrders(query).then(() => {
            nextQuery = firebase.firestore()
                .collection('orders')
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

    if (orderType == "waiting_for_pickup") {
        pageHeader.textContent = "Orders: Waiting for Pickup";
        var query;
        if (sellerid == null) {
            query = firebase.firestore()
                .collection('orders')
                .where("Status", "==", "Ready For Dispatch")
                .orderBy("order_date", "desc")
                .limit(docLimit);
        }
        else {
            query = firebase.firestore()
                .collection('orders')
                .where("Status", "==", "Ready For Dispatch")
                .where("seller_id", "==", sellerid)
                .orderBy("order_date", "desc")
                .limit(docLimit);
        }

        queryList.push(query);

        fetchOrders(query).then(() => {
            if (sellerid == null) {
                nextQuery = firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Ready For Dispatch")
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }
            else {
                firebase.firestore()
                    .collection('orders')
                    .where("Status", "==", "Ready For Dispatch")
                    .where("seller_id", "==", sellerid)
                    .orderBy("order_date", "desc")
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }

            queryList.push(nextQuery);

            fetchUsers().then(() => {
                fetchAddresses().then(() => {
                    addPendingOrdersToTable();
                });
            });
        });
    }
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

                snapshot.forEach(function (doc) {
                    var order = doc.data();

                    fetchProductsForOrder(order).then(() => {

                        pendingOrders.push(order);
                    }).then(() => {


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

function getSellerDetails(order) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("seller").doc(order.seller_id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                seller = doc.data();
                orderSellerMap.set(order.order_id, seller);
                resolve();
            } else {
                seller = null;
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

function addPendingOrdersToTable() {


    createTableHeaders();
    for (var i = 0; i < pendingOrders.length; i++) {
        promiseList.push(getSellerDetails(pendingOrders[i]));
    }

    Promise.all(promiseList)
        .then(() => {

            for (var i = 0; i < pendingOrders.length; i++) {

                var returnRequestedAndNotProcessed = false;

                var index = i.toString();

                var order = pendingOrders[i];
                var user = ordersUsersMap.get(order.order_id); // users[i];
                var address = ordersAddressMap.get(order.order_id); // addresses[i];
                var seller = orderSellerMap.get(order.order_id);

                var tr = document.createElement("tr");
                var id = "tr" + i.toString();
                tr.setAttribute("id", id);

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
                var tdAction = document.createElement("td");


                var divCustomerName = document.createElement("div");
                var divSellerDetails = document.createElement("div");
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

                var divDeleteOrder = document.createElement("div");
                divDeleteOrder.setAttribute("id", "idConfrimDiv" + index);


                divDeleteOrder.style.marginBottom = "10px";
                var btnDeleteOrder = document.createElement("button");
                btnDeleteOrder.setAttribute("id", index);
                btnDeleteOrder.textContent = "Delete Order";
                btnDeleteOrder.style.width = "150px";
                divDeleteOrder.appendChild(btnDeleteOrder);
                divAction.appendChild(divDeleteOrder);

                var divPendingOrders = document.createElement("div");
                var btnSendReminder = document.createElement("button");
                btnSendReminder.setAttribute("id", index);
                btnSendReminder.textContent = "Send Reminder To Seller";
                btnSendReminder.style.width = "150px";
                btnSendReminder.style.marginBottom = "10px";
                divPendingOrders.appendChild(btnSendReminder);

                var btnCancelOrder = document.createElement("button");
                btnCancelOrder.setAttribute("id", index);
                btnCancelOrder.textContent = "Cancel Order";
                btnCancelOrder.style.width = "150px";
                divPendingOrders.appendChild(btnCancelOrder);
                divPendingOrders.style.display = "none";
                divAction.appendChild(divPendingOrders);

                var divViewProducts = document.createElement("div");
                divViewProducts.style.marginBottom = "10px";
                var btnViewOrders = document.createElement("button");
                btnViewOrders.textContent = "View Products";
                btnViewOrders.style.width = "150px";
                btnViewOrders.setAttribute("id", order.order_id);
                divViewProducts.appendChild(btnViewOrders);
                divAction.appendChild(divViewProducts);





                var divConfirmedOrders = document.createElement("div");
                divConfirmedOrders.setAttribute("id", "idAfterConfimrDiv" + index);
                // var divCapturePayment = document.createElement("div");
                // divCapturePayment.style.marginBottom = "10px";
                // var btnCapturePayment = document.createElement("button");
                // btnCapturePayment.textContent = "Capture Payment";
                // btnCapturePayment.setAttribute("id", index);
                // btnCapturePayment.style.width = "150px";
                // divCapturePayment.appendChild(btnCapturePayment);
                // divConfirmedOrders.appendChild(divCapturePayment);

                var divIssueRefund = document.createElement("div");
                divIssueRefund.style.marginBottom = "10px";
                var btnIssueRefund = document.createElement("button");
                btnIssueRefund.textContent = "Issue Refund";
                btnIssueRefund.setAttribute("id", index);
                btnIssueRefund.style.width = "150px";
                divIssueRefund.appendChild(btnIssueRefund);
                divConfirmedOrders.appendChild(divIssueRefund);

                if (order.COD == false && order.payment_id == null) {
                    divConfirmedOrders.style.display = "none";

                }
                else {


                    divDeleteOrder.style.display = "none";
                }


                divAction.appendChild(divConfirmedOrders);

                var divStatus = document.createElement("div");


                var divStatusText = document.createElement("div");
                divStatusText.style.marginBottom = "10px";
                var spanStatusText = document.createElement("span");
                spanStatusText.setAttribute("id", "StatusText|" + order.order_id);
                spanStatusText.innerHTML = order.Status + "<br/><hr/>";
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

                if (status == "Delivered") {
                    divChangeStatus.style.display = "none";
                } else {
                    divChangeStatus.style.display = "block";
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


                    var statusElement = document.getElementById("StatusText|" + lOrder.order_id);
                    statusElement.textContent = status;

                    updateOrderStatusFromInvoice(lOrder, status);
                    this.style.display = "none";

                })


                var divImgProduct = document.createElement("div");
                var divProductName = document.createElement("div");
                var divProductQty = document.createElement("div");
                var divAmountPayable = document.createElement("div");



                var productList = ordersProductMap.get(order.order_id);
                var totalAmtPayable = 0;
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

                    var spanIsReplaceOrder = document.createElement("span");
                    if (order.replacement_order != null) {
                        if (order.replacement_order) {
                            spanIsReplaceOrder.style.color = "#ff0000";
                            spanIsReplaceOrder.innerHTML = "<br/><b>Replacement Order (Original Order Id : " + order.original_order_id + ")</b>"
                        }

                    }


                    productTitle.innerHTML = title;
                    divProductTitleLocal.appendChild(productTitle);
                    divProductTitleLocal.appendChild(spanReturn);
                    divProductTitleLocal.appendChild(spanReplacement);
                    divProductTitleLocal.appendChild(spanIsReplaceOrder);
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
                    if (order.cancelled) {
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
                    var text = "<hr /><b>Commission: </b> " + commission + "%<br/>"
                        + "<b>Seller: </b>" + seller_part + "<br/>"
                        + "<b>Admin: </b>" + admin_part;
                    //  var text = " (C: " + commission + "%, S: " + seller_part + ", A: " + admin_part + ")";

                    text = "";
                    formattedAmtPayable += "<br/>" + text;
                    amountPayable.innerHTML = formattedAmtPayable;
                    divAmtPayableLocal.appendChild(amountPayable);
                    divAmountPayable.appendChild(divAmtPayableLocal);

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

                if (returnRequestedAndNotProcessed || (order.cancelled && order.COD == false && order.prepaid_cancellation_processed == false)) {
                    btnIssueRefund.style.display = "block";
                } else {
                    btnIssueRefund.style.display = "none";
                }

                if (order.COD == false && order.payment_id == null) {
                    var spanNoPaymentDone = document.createElement("span");
                    spanNoPaymentDone.innerHTML = "<br/><b>Payment not captured yet.</b>";
                    spanNoPaymentDone.style.color = "#ff0000";
                    divPaymentId.appendChild(spanNoPaymentDone);
                    btnDeleteOrder.style.display = "block";

                }

                if (order.Status == "Order received. Seller Confirmation pending.") {
                    divPendingOrders.style.display = "block";
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
                tdAction.appendChild(divAction);

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
                tr.appendChild(tdAction);
                table.appendChild(tr);

                btnIssueRefund.addEventListener("click", function () {
                    var index = parseInt(this.id);
                    var order = pendingOrders[index];
                    window.location.href = "admin_issueRefund.html?orderid=" + order.order_id;

                })

                btnViewOrders.addEventListener("click", function () {
                    var orderId = this.id.toString();
                    window.location.href = "view_products_against_order.html?order_id=" + orderId + "&admin=true";
                })

                btnDeleteOrder.addEventListener("click", function () {
                    var index = parseInt(this.id);
                    var order = pendingOrders[index];
                    deleteOrder(order);
                })

                btnSendReminder.addEventListener("click", function () {

                    var index = parseInt(this.id);
                    var order = pendingOrders[index];
                    var seller = orderSellerMap.get(order.order_id);

                    var ord = order.order_date.toDate();
                    var dd = ord.getDate();
                    var mm = ord.getMonth() + 1;
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    var yyyy = ord.getFullYear();
                    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

                    var msg = "<h3>Hello " + seller.Name + "</h3>"
                        + "<p>Greetings from My Rupeaze!!</p>"
                        + "<p>This is to inform you that you had received an order"
                        + " with order id - <b>" + order.order_id + "</b> on date <b> " + formattedDay + "</b> <br /> <br/>"
                        + "<p>Hereby, you are requested to confirm and dispatch this order as soon as possible.</p>"
                        + "<p>Any further delay, could cause the order cacnellation.</p>"
                        + "<p>Keep selling with us!!</p>"

                        + "<p>With Kind Regards,<br/>"
                        + "My Rupeaze Team </p>";

                    sendEmail(seller.email, "My Rupeaze Pending Order Confirmation Reminder", msg);
                    alert("Email Sent to Seller");
                })

                btnCancelOrder.addEventListener("click", function () {
                    var index = parseInt(this.id);
                    var order = pendingOrders[index];
                    //  var seller = orderSellerMap.get(order.order_id);
                    cancelOrder(order);
                })
            }

        })
}

function deleteOrder(order) {
    firebase.firestore().collection("orders").doc(order.order_id).delete().then(function () {
        window.location.href = "admin_orders.html?type=" + orderType;
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}



function cancelOrder(order) {

    var seller = orderSellerMap.get(order.order_id);
    var washingtonRef = firebase.firestore().collection("orders").doc(order.order_id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        Status: "Order Cancelled by admin due to non-conformance.",
        cancelled: true
    })
        .then(function () {
            window.location.href = "admin_orders.html?type=" + orderType;

            var ord = order.order_date.toDate();
            var dd = ord.getDate();
            var mm = ord.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            var yyyy = ord.getFullYear();
            var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

            var msg = "<h3>Hello " + seller.seller_name + "</h3>"
                + "<p>Greetings from My Rupeaze!!</p>"
                + "<p>This is to inform you that you had received an order"
                + " with order id - <b>" + order.order_id + "</b> on date <b> " + formattedDay + "</b> <br /> <br/>"
                + "<p>This order has been cancelled since it was not confirmed by you till now.</p>"
                + "<p>Such actions can lead to account termination.</p>"
                + "<p>Keep selling with us!!</p>"

                + "<p>With Kind Regards,<br/>"
                + "My Rupeaze Team </p>";

            sendEmail(seller.email, "My Rupeaze: Order Cancelled by Admin", msg);
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
    var sellerDetailsHeader = document.createElement('th');
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
    sellerDetailsHeader.innerHTML = "Seller Details";
    productNameHeader.innerHTML = "Product Name";
    productNameHeader.style.width = "300px";
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
    tr.appendChild(sellerDetailsHeader);
    tr.appendChild(productNameHeader);
    tr.appendChild(qtyHeader);
    tr.appendChild(amtPayableHeader);
    tr.appendChild(paymentIdHeader);
    tr.appendChild(codHeader);
    tr.append(statusHeader);
    tr.appendChild(actionHeader);

    table.appendChild(tr);

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


function updateOrderStatus(order, status) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("orders").doc(order.order_id);

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            Status: status // "Order Confirmed. Preparing for Dispatch"
        }).then(function () {
            if (status == "Delivered") {
                updateDeliveryTimestamp(order.order_id);
            }
            if (status == "Cancelled") {
                cancelOrder(order);
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

function updateOrderStatusFromInvoice(order, value) {


    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("online_invoices").doc(order.invoice_id)

        // Set the "capital" field of the city 'DC'
        return docRef.update({
            Status: value
        }).then(function () {
            updateOrderStatus(order, value).then(() => {
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