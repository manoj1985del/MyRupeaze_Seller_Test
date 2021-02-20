

localStorage.clear();

var rupeeSymbol = "₹ ";


var btnUpdate = document.getElementById("btnUpdate");
var hSalesThisMonth = document.getElementById("hSalesThisMonth");
var arrLast7Days = [];
var mapUnits7Days = new Map();
var mapSales7Days = new Map();
var last7DaySales = [];
var last7DayUnits = [];
var commision_map = new Map();
var unsettledOrdersProductMap = new Map();

var currentMonthOrdersProductMap = new Map();
var currentMonthOrders = [];


var pendingOrders = [];
var todayOrders = [];
var ordersLast7Days = [];
var unsettledOrders = [];
var todayUnits = 0;
var txtPendingOrder = document.getElementById("txtPendingOrders");
var txtTodayUnits = document.getElementById("txtUnits");
var txtTodaySales = document.getElementById("txtTodaySales");

var cardPendingOrder = document.getElementById("cardPendingOrder");
var cardUnitsToday = document.getElementById("cardUnitsToday");
var cardSalesToday = document.getElementById("cardSalesToday");
var cardTotalSellers = document.getElementById("cardTotalSellers");
var hTotalSellers = document.getElementById("hTotalSellers");
var cardPendingSellerRequest = document.getElementById("cardPendingSellerRequest");
var hPendingSellerRequest = document.getElementById("hPendingSellerRequest");

var cardTotalUsers = document.getElementById("cardTotalUsers");
var hTotalUsers = document.getElementById("hTotalUsers");

var h6CompanyName = document.getElementById("h6CompanyName");
var spanMerchantid = document.getElementById("spanMerchantid");
var spanPan = document.getElementById("spanPANCardNumber");
var spanGst = document.getElementById("spanGST");
var spanSellingCategory = document.getElementById("spanSellingCategory");
var spanBankAccountNumber = document.getElementById("spanBankAccountNumber");

var imgProgress = document.getElementById("imgProgress");

var cardElecCommission = document.getElementById("cardElecCommission");
var hElecCommission = document.getElementById("hElecCommission");
var hCODCommission = document.getElementById("hCODCommission");
var cardCODCommission = document.getElementById("cardCODCommission");

var cardPendingCODPayouts = document.getElementById("cardPendingCODPayouts");
var hPendingCODPayouts = document.getElementById("hPendingCODPayouts");
var cardPendingElecPayouts = document.getElementById("cardPendingElecPayouts");
var hPendingElecPayouts = document.getElementById("hPendingElecPayouts");

var cardPendingApprovalsProduct = document.getElementById("cardPendingApprovalsProduct");
var hPendingApprovalProducts = document.getElementById("hPendingApprovalProducts");
var linkOrderEnquiries = document.getElementById("linkOrderEnquiries");

localStorage.setItem("adminLogin", "true");

var todayOrdersMap = new Map();
var last7DayOrderMap = new Map();


var sellerId = getQueryVariable("sellerid");
localStorage.setItem("sellerid", sellerId);

var cod_payout_seller = 0;
var elec_payout_seller = 0;
var cod_commission_admin = 0;
var elec_commission_admin = 0;



Last7Days();
getPendingProducts();
loadSellerDetails(sellerId);
loadTotalSellers();
loadTotalUsers();
loadPendingSellers();
loadPendingOrders();
loadTodayOrders();
getActiveEnquiries();
loadLast7DaysOrder().then(() => {
    loadLast7DaysOrderMap().then(() => {
        // console.log("orders finally fetched");
        console.log(last7DayOrderMap);
    })

});

getThisMonthOrders().then(()=>{
    console.log(currentMonthOrders);
    var promiseList = [];
    for(var i = 0; i < currentMonthOrders.length; i++){
        promiseList.push(mapCurrentMonthsProductAgainstOrder(currentMonthOrders[i]));
    }
    Promise.all(promiseList).then(()=>{
        console.log("going to get amount for month");
        getAmountForMonth();
    })
})

loadSalesChart();
loadUnitsChart();
generatePayouts();
//getUnSettledOrders();
//loadFreeChart();
//loadUnitsChart();

cardPendingOrder.addEventListener("mouseenter", function () {
    cardPendingOrder.classList.add("cardHover");
});

cardPendingOrder.addEventListener("mouseleave", function () {
    cardPendingOrder.classList.remove("cardHover");
});

cardPendingOrder.addEventListener("click", function () {
    window.location.href = "admin_orders.html?type=pending";
})

//today sales
cardSalesToday.addEventListener("mouseenter", function () {
    cardSalesToday.classList.add("cardHover");
});

cardSalesToday.addEventListener("mouseleave", function () {
    cardSalesToday.classList.remove("cardHover");
});

cardSalesToday.addEventListener("click", function () {
    window.location.href = "admin_orders.html?type=today";
});


//today units
cardUnitsToday.addEventListener("mouseenter", function () {
    cardUnitsToday.classList.add("cardHover");
});

cardUnitsToday.addEventListener("mouseleave", function () {
    cardUnitsToday.classList.remove("cardHover");
});

cardUnitsToday.addEventListener("click", function () {
    window.location.href = "admin_orders.html?type=today";
});


//total sellers
cardTotalSellers.addEventListener("mouseenter", function () {
    cardTotalSellers.classList.add("cardHover");
});

cardTotalSellers.addEventListener("mouseleave", function () {
    cardTotalSellers.classList.remove("cardHover");
});

cardTotalSellers.addEventListener("click", function () {
    window.location.href = "admin_seller_listing.html?type=approved";
});

//pending sellers
cardPendingSellerRequest.addEventListener("mouseenter", function () {
    cardPendingSellerRequest.classList.add("cardHover");
});

cardPendingSellerRequest.addEventListener("mouseleave", function () {
    cardPendingSellerRequest.classList.remove("cardHover");
});

cardPendingSellerRequest.addEventListener("click", function () {
    window.location.href = "admin_seller_listing.html?type=pending";
});

//total users
cardTotalUsers.addEventListener("mouseenter", function () {
    cardTotalUsers.classList.add("cardHover");
});

cardTotalUsers.addEventListener("mouseleave", function () {
    cardTotalUsers.classList.remove("cardHover");
});

cardTotalUsers.addEventListener("click", function () {
    //window.location.href = "orders.html?type=today";
});

btnUpdate.addEventListener("click", function(){
    window.location.href = "RegisterUser.html?sellerid=" + sellerId;
})

//pending for approval products
cardPendingApprovalsProduct.addEventListener("mouseenter", function(){
    cardPendingApprovalsProduct.classList.add("cardHover");
})

cardPendingApprovalsProduct.addEventListener("mouseleave", function(){
    cardPendingApprovalsProduct.classList.remove("cardHover");
})

cardPendingApprovalsProduct.addEventListener("click", function(){
    window.location.href = "admin_show_listing.html?type=pending";
})


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

function Last7Days() {
    for (var i = 6; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);

        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yyyy = d.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        var day = dd + "-" + getMonthNmae(mm);
        mapUnits7Days.set(day, 0);
        mapSales7Days.set(day, 0);
        arrLast7Days.push(day);
        if (mm < 10) {
            mm = '0' + mm;
        }
        var formattedDate = mm + '-' + dd + '-' + yyyy;
        // console.log("formatted date- " + formattedDate);
    }

    //  return (result.join(','));
}

function loadChart() {
    console.log("load charts function called");

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Weekly Sales"
        },
        data: [
            {
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "column",
                dataPoints: [
                    { label: "01-July-2020", y: 10 },
                    { label: "02-July-2020", y: 15 },
                    { label: "03-July-2020", y: 25 },
                    { label: "04-July-2020", y: 22 },
                    { label: "05-July-2020", y: 50 },
                    { label: "06-July-2020", y: 10 },
                    { label: "07-July-2020", y: 12 }
                ]
            }
        ]
    });
    chart.render();
}

function loadSalesChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrLast7Days,
            datasets: [{
                label: 'Weekly Sales',
                data: last7DaySales,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(125, 212, 20, 1)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(125, 212, 20, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            legend: {
                onClick: (e) => e.stopPropagation()
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    });
}

function loadUnitsChart() {
    var ctx = document.getElementById('myChart1').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrLast7Days,
            datasets: [{
                label: 'Weekly Units',
                data: last7DayUnits,
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(125, 212, 20, 1)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(125, 212, 20, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            legend: {
                onClick: (e) => e.stopPropagation()
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    });
}

async function loadLast7DaysOrderMap() {
    return new Promise((resolve, reject) => {
        var index = 0;
        var qty = 0;
        var sales = 0;

        for (var i = 0; i < ordersLast7Days.length; i++) {
            var order = ordersLast7Days[i];


            mapProductsForLast7DaysOrder(order, last7DayOrderMap).then(() => {
                index++;

                if (index == ordersLast7Days.length) {
                    for (var ele of last7DayOrderMap.entries()) {
                        qty = 0;
                        sales = 0;
                        var or = ele[0];
                        var orderDate = or.order_date.toDate();
                        var dd = orderDate.getDate();
                        var mm = orderDate.getMonth() + 1;
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        var formattedDay = dd + "-" + getMonthNmae(mm);

                        var productList = ele[1];

                        for (var i = 0; i < productList.length; i++) {
                            var product = productList[i];
                            qty += product.Qty;
                            sales += product.Offer_Price * product.Qty;
                        }
                        var mapQty = mapUnits7Days.get(formattedDay);
                        mapQty += qty;

                        var mapSales = mapSales7Days.get(formattedDay);
                        mapSales += sales;
                        mapUnits7Days.set(formattedDay, mapQty);
                        mapSales7Days.set(formattedDay, mapSales);
                    }

                    for (var unit of mapUnits7Days.values()) {
                        last7DayUnits.push(unit);

                    }

                    for (var sale of mapSales7Days.values()) {
                        last7DaySales.push(sale);

                    }

                    loadSalesChart();
                    loadUnitsChart();
                    resolve();
                }
            })

        }


    })


}


function loadLast7DaysOrder() {

    return new Promise((resolve, reject) => {

        var tomorrow = new Date();
        var initialDate = new Date();
        var today = new Date();
        tomorrow.setDate(today.getDate() + 1);
        initialDate.setDate(today.getDate() - 6);

        initialDate.setHours(0);
        initialDate.setMinutes(0);
        initialDate.setMilliseconds(0);
        initialDate.setSeconds(0);


        var query = firebase.firestore()
            .collection('orders')
            .where("order_date", ">=", initialDate)
            .where("order_date", "<", tomorrow)
            .where("cancelled", '==', false);

        query.get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {

                    var order = doc.data();
                    ordersLast7Days.push(order);

                })
            }).then(function () {
                resolve();

            })

    })



}


function loadTodayOrders() {

    var totalOrders = 0;
    var totalSales = 0;

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);


    var query = firebase.firestore()
        .collection('orders')
        .where("order_date", ">=", today)
        .where("cancelled", "==", false);

    query.get()
        .then(function (snapshot) {
            if (snapshot.docs.length == 0 || snapshot.docs.length == undefined) {
                txtTodayUnits.textContent = totalOrders.toString();
                txtTodaySales.textContent = rupeeSymbol + numberWithCommas(totalSales);

            }


            snapshot.forEach(function (doc) {
                var order = doc.data();
                fetchProductsForOrder(order, todayOrdersMap).then(() => {
                    var productList = todayOrdersMap.get(order.order_id);

                    for (var i = 0; i < productList.length; i++) {
                        var product = productList[i];
                        totalSales += product.Offer_Price * product.Qty;
                        totalOrders += product.Qty;
                    }


                }).then(() => {
                    txtTodayUnits.textContent = totalOrders.toString();
                    txtTodaySales.textContent = rupeeSymbol + numberWithCommas(totalSales);
                })



            })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}


function mapProductsForLast7DaysOrder(order, orderMap) {
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
                orderMap.set(order, productList);
                resolve();
            });

    })
}

function fetchProductsForOrder(order, orderMap) {
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
                orderMap.set(order.order_id, productList);
                resolve();
            });

    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadPendingOrders() {
    var query = firebase.firestore()
        .collection('orders')
        .where("Status", "==", "Order received. Seller Confirmation pending.");

    query.get()
        .then(function (snapshot) {
            snapshot.forEach(function (doc) {

                var data = toQueryString(doc.data());
                pendingOrders.push(data);
            })
        }).then(function () {
            txtPendingOrder.textContent = pendingOrders.length.toString();

        }).catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function loadMyAccountsInfo(seller) {
    spanPan.textContent = "PAN Card No. " + seller.pan_no;
    spanGst.textContent = "GST No. " + seller.gstin;
    spanMerchantid.textContent = "Merchant Id: " + seller.merchant_id;
    spanSellingCategory.textContent = "Selling Category: " + seller.seller_category;
    spanBankAccountNumber.textContent = "Bank Account Number : " + seller.account_no;
    h6CompanyName.textContent = seller.company_name;

}

// function loadShopDetails() {


//     return new Promise((resolve, reject) => {

//         var docRef = firebase.firestore().collection("shops").doc(sellerId);

//         docRef.get().then(function (doc) {

//             if (doc.exists) {
//                 var shop = doc.data();
//                 localStorage.setItem("shop_opening_time", shop.Shop_Opening_Time);
//                 localStorage.setItem("shop_closing_time", shop.Shop_Closing_Time);
//                 localStorage.setItem("offers", shop.Offers);
//                 resolve();

//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//                 resolve();
//             }
//         }).catch(function (error) {
//             console.log("Error getting document:", error);
//             resolve();
//         });

//     })


// }

function loadSellerDetails(sellerid) {
    var query = firebase.firestore()
        .collection('seller').doc(sellerid);


    query.get().then(function (doc) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.
        var seller = doc.data();
        imgProgress.style.display = "none";

        localStorage.setItem("sellerName", seller.company_name);
        localStorage.setItem("sellerAddressLine1", seller.address_line1);
        localStorage.setItem("sellerAddressLine2", seller.address_line2);
        localStorage.setItem("sellerAddressLine3", seller.address_line3);
        localStorage.setItem("sellerCity", seller.city);
        localStorage.setItem("sellerState", seller.state);
        localStorage.setItem("sellerPAN", seller.pan_no);
        localStorage.setItem("sellerGST", seller.gstin);
        localStorage.setItem("sellerpin", seller.pincode);
        localStorage.setItem("sellerPhone", seller.mobile);
        localStorage.setItem("merchant_id", seller.merchant_id);
        localStorage.setItem("seller_account_no", seller.account_no);
        localStorage.setItem("seller_category", seller.seller_category);
        localStorage.setItem("seller_ifsc", seller.ifsc);
        localStorage.setItem("seller_bank", seller.bank_name);
        localStorage.setItem("seller_person_name", seller.seller_name);
        localStorage.setItem("account_holder_name", seller.account_holder_name);
        localStorage.setItem("city_seller", seller.city_seller);
        localStorage.setItem("account_type", seller.accountType);
        localStorage.setItem("seller_email", seller.email);
        localStorage.setItem("shop_opening_time", seller.shop_opening_time);
        localStorage.setItem("shop_closing_time", seller.shop_closing_time);
        localStorage.setItem("offers", seller.shop_offers);

        loadMyAccountsInfo(seller);
        

        // if (seller.city_seller) {

        //     loadShopDetails().then(() => {
        //         loadMyAccountsInfo(seller);

        //     })
        // }
        // else {
        //     loadMyAccountsInfo(seller);
        // }

        // window.location.reload(true);




    }).catch(function (error) {
        console.log("Error getting cached document:", error);
    });


}

function loadTotalSellers() {
    firebase.firestore().collection("seller")
        .where("status", "==", "approved")
        .get()
        .then(function (querySnapshot) {
            hTotalSellers.textContent = querySnapshot.docs.length;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function loadPendingSellers() {
    firebase.firestore().collection("seller")
        .where("status", "==", "pending")
        .get()
        .then(function (querySnapshot) {
            hPendingSellerRequest.textContent = querySnapshot.docs.length;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

function loadTotalUsers() {
    firebase.firestore().collection("users")
        .where("status", "==", "approved")
        .get()
        .then(function (querySnapshot) {
            hTotalUsers.textContent = querySnapshot.docs.length;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
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


var promiseList = [];
function generatePayouts() {

    loadComissionMap().then(() => {
        getUnSettledOrders().then(() => {
            for (var i = 0; i < unsettledOrders.length; i++) {
                promiseList.push(mapProductsAgainstOrder(unsettledOrders[i]));
            }
            Promise.all(promiseList).then(() => {
                calculatePayout();
            })


        });
    })
}

function calculatePayout() {

    var productList = [];

    var totalCODValue = 0;
    var totalPrepaidValue= 0;
    var totalCODCommission = 0;
    var totalPrepaidCommission = 0;

    for (var i = 0; i < unsettledOrders.length; i++) {
        var order = unsettledOrders[i];
        if(order.cancelled){
            continue;
        }
        productList = unsettledOrdersProductMap.get(order.order_id);
        for (var j = 0; j < productList.length; j++) {
            var product = productList[j];

            var amtToReduce = 0;
            if(product.return_requested && product.return_processed){
                amtToReduce = product.return_amount;
            }

            if(product.cancelled_by_seller){
                product.Offer_Price = 0;
            }

            var commission = commision_map.get(product.Category);
            var offer_price = product.Offer_Price * product.Qty;
            offer_price = offer_price - amtToReduce;
            var commission_value = (offer_price * commission) / 100;
          
            if (order.COD == true) {
                totalCODValue += offer_price;
                totalCODCommission += commission_value;
            }
            else {
                //if order is prepaid and successful payment has been made
                if (order.payment_id != null) {
                   totalPrepaidValue += offer_price;
                   totalPrepaidCommission += commission_value;

                }
            }
        }
    }

    var tradingChargesCOD = 28;
    var tradingChargesPrepaid = 28;

    if(totalCODValue == 0){
        tradingChargesCOD = 0;
    }

    if(totalPrepaidValue == 0){
        tradingChargesPrepaid = 0;
    }

    var deductionsCODTaxable = totalCODCommission + tradingChargesCOD;
    var taxes = deductionsCODTaxable *18 / 100;
    var deductionsCOD = deductionsCODTaxable + taxes;
    var cod_payout_seller = totalCODValue - deductionsCOD;

    var deductionsPrepaidTaxable = totalPrepaidCommission + tradingChargesPrepaid;
    var taxes = deductionsPrepaidTaxable *18 / 100;
    var deductionsPrepaid = deductionsPrepaidTaxable + taxes;
    var elec_payout_seller = totalPrepaidValue - deductionsPrepaid;

    // hCODCommission.textContent = cod_commission_admin.toFixed(2);
    // hElecCommission.textContent = elec_commission_admin.toFixed(2);
    hPendingCODPayouts.textContent = rupeeSymbol + cod_payout_seller.toFixed(2);
    hPendingElecPayouts.textContent = rupeeSymbol + elec_payout_seller.toFixed(2);
    

    hCODCommission.textContent = deductionsCOD.toFixed(2);
    hElecCommission.textContent = deductionsPrepaid.toFixed(2);
    hPendingCODPayouts.textContent = cod_payout_seller.toFixed(2);
    hPendingElecPayouts.textContent = elec_payout_seller.toFixed(2);




}

function getPayouts() {

    for (var i = 0; i < unsettledOrders.length; i++) {
        if (order.cancelled == false) {
            calculatePayout(unsettledOrders[i]);
        }

    }

    console.log("cod order pyaout = " + cod_payout_seller);
    console.log("elec payout = " + elec_payout_seller);
}


function getUnSettledOrders() {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("orders")
            .where("settlement_done", "==", false)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var order = doc.data();
                    unsettledOrders.push(order);
                });
            }).then(() => {
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    })
}

function mapProductsAgainstOrder(order) {
    return new Promise((resolve, reject) => {
        var productList = [];
        firebase.firestore().collection("orders").doc(order.order_id).collection("products")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var product = doc.data();
                    productList.push(product);
                })
            }).then(() => {
               
                unsettledOrdersProductMap.set(order.order_id, productList);
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })
}


function getDaysInMonth(month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    month = month + 1;
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

function getThisMonthOrders() {

    var promiseList = [];
    return new Promise((resolve, reject) => {

        var date = new Date();

        var firstDay = new Date(date.getFullYear(),
            date.getMonth(), 1);

        var lastDay = new Date(date.getFullYear(),
            date.getMonth(), getDaysInMonth(date.getMonth(),
                date.getFullYear()));

        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setMilliseconds(0);
        firstDay.setSeconds(0);

        lastDay.setHours(23);
        lastDay.setMinutes(59);
        lastDay.setMilliseconds(0);
        lastDay.setSeconds(50);




        var query = firebase.firestore()
            .collection('orders')
            .where("order_date", ">=", firstDay)
            .where("order_date", "<=", lastDay)
            .where("cancelled", "==", false);

        query.get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {

                    var order = doc.data();
                    currentMonthOrders.push(order);

                })
            }).then(function () {


                resolve();
            })

    })

}

function getAmountForMonth() {
    var finalAmount = 0;
    
    for (var i = 0; i < currentMonthOrders.length; i++) {
        var order = currentMonthOrders[i];
        console.log("order = " + order);
        var productList = currentMonthOrdersProductMap.get(order.order_id);
        console.log("product List = " + productList);
        for (var productIndex = 0; productIndex < productList.length; productIndex++) {
            var product = productList[productIndex];
            console.log(product);
            var amount = product.Offer_Price * product.Qty;

            var amtToReduce = 0;
            if (product.return_requested && product.return_processed) {
                amtToReduce = product.return_amount;
            }

            amount = amount - amtToReduce;
            finalAmount += amount;
        }
    }
    hSalesThisMonth.textContent = rupeeSymbol + finalAmount.toFixed(2);
}


function mapCurrentMonthsProductAgainstOrder(order) {

    return new Promise((resolve, reject) => {
        var productList = [];
        firebase.firestore().collection("orders").doc(order.order_id).collection("products")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var product = doc.data();
                    productList.push(product);
                })
            }).then(() => {

                currentMonthOrdersProductMap.set(order.order_id, productList);
                console.log("resolving prdouct list");
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })
}

function getPendingProducts(){
    firebase.firestore().collection("products")
        .where("status", "==", "pending")
        .get()
        .then(function (querySnapshot) {
            hPendingApprovalProducts.textContent = querySnapshot.docs.length;
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

var enquiryCount = 0;
function getActiveEnquiries(){

        var enquires = [];
        firebase.firestore().collection("offline_requests")
        .where("status_code", "==", 0)
            .get()
            .then(function (querySnapshot) {
                var enquiryCount = querySnapshot.length;
            }).then(() => {
                linkOrderEnquiries.innerHTML = "Order Enquiries <b>(" + enquiryCount.toString() + ")</b>";
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

}



