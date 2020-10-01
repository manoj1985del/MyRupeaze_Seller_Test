localStorage.clear();

var rupeeSymbol = "₹ ";

var cardCity = document.getElementById("cardCity");
var btnUpdate = document.getElementById("btnUpdate");
var arrLast7Days = [];
var mapUnits7Days = new Map();
var mapSales7Days = new Map();
var last7DaySales = [];
var last7DayUnits = [];



var unsettledOrders = [];
var unsettledOrdersProductMap = new Map();
var currentMonthOrdersProductMap = new Map();
var currentMonthOrders = [];

var cod_payout_seller = 0;
var elec_payout_seller = 0;
var cod_commission_admin = 0;
var elec_commission_admin = 0;
var commision_map = new Map();
var unsettledOrdersAndProductMap = new Map();


var pendingOrders = [];
var todayOrders = [];
var ordersLast7Days = [];
var todayUnits = 0;
var txtPendingOrder = document.getElementById("txtPendingOrders");
var txtTodayUnits = document.getElementById("txtUnits");
var txtTodaySales = document.getElementById("txtTodaySales");

var cardPendingOrder = document.getElementById("cardPendingOrder");
var cardUnitsToday = document.getElementById("cardUnitsToday");
var cardSalesToday = document.getElementById("cardSalesToday");

var h6CompanyName = document.getElementById("h6CompanyName");
var spanMerchantid = document.getElementById("spanMerchantid");
var spanPan = document.getElementById("spanPANCardNumber");
var spanGst = document.getElementById("spanGST");
var spanSellingCategory = document.getElementById("spanSellingCategory");
var spanBankAccountNumber = document.getElementById("spanBankAccountNumber");
var spanSubscribed = document.getElementById("subscribed");
var spanValidTill = document.getElementById("validTill");
var spanType = document.getElementById("spanType");

var imgProgress = document.getElementById("imgProgress");

var hPendingCODPayouts = document.getElementById("hPendingCODPayouts");
var hPendingElecPayouts = document.getElementById("hPendingElecPayouts");
var hSalesThisMonth = document.getElementById("hSalesThisMonth");

var hDisbursable = document.getElementById("hDisbursable");
var hFreezed = document.getElementById("hFreezed");

var linkSubscription = document.getElementById("linkSubscription");

var todayOrdersMap = new Map();
var last7DayOrderMap = new Map();


var sellerId = getQueryVariable("sellerid");
localStorage.setItem("sellerid", sellerId);



Last7Days();
loadSellerDetails();
loadPendingOrders();
loadTodayOrders();
generatePayouts();

loadLast7DaysOrder().then(() => {
    loadLast7DaysOrderMap().then(() => {
        // console.log("orders finally fetched");
        console.log(last7DayOrderMap);
    })

});

loadSalesChart();
loadUnitsChart();

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
// getThisMonthOrders().then(()=>{
//     getAmountForMonth();
// })
//loadFreeChart();
//loadUnitsChart();

cardPendingOrder.addEventListener("mouseenter", function () {
    cardPendingOrder.classList.add("cardHover");
});

cardPendingOrder.addEventListener("mouseleave", function () {
    cardPendingOrder.classList.remove("cardHover");
});

cardPendingOrder.addEventListener("click", function () {
    window.location.href = "orders.html?type=pending";
})

//today sales
cardSalesToday.addEventListener("mouseenter", function () {
    cardSalesToday.classList.add("cardHover");
});

cardSalesToday.addEventListener("mouseleave", function () {
    cardSalesToday.classList.remove("cardHover");
});

cardSalesToday.addEventListener("click", function () {
    window.location.href = "orders.html?type=today";
});


//today units
cardUnitsToday.addEventListener("mouseenter", function () {
    cardUnitsToday.classList.add("cardHover");
});

cardUnitsToday.addEventListener("mouseleave", function () {
    cardUnitsToday.classList.remove("cardHover");
});

cardUnitsToday.addEventListener("click", function () {
    window.location.href = "orders.html?type=today";
});

btnUpdate.addEventListener("click", function () {
    window.location.href = "RegisterUser.html?sellerid=" + sellerId;
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

linkSubscription.addEventListener("click", function(){
    if(spanSubscribed.textContent == "Subscription Status: Active"){
        alert("Your have already subscribed.");
        return;
    }

    window.location.href = "subscription.html";
})

function loadChart() {
   // console.log("load charts function called");

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
                      //  console.log("formattedDay - " + formattedDay);

                        var productList = ele[1];

                        for (var i = 0; i < productList.length; i++) {
                            var product = productList[i];
                            qty += product.Qty;
                          //  console.log("qty - " + qty);
                            sales += product.Offer_Price * product.Qty;
                           // console.log(sales);
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


// function loadLast7DaysOrder() {

//     console.log("now here");

//     return new Promise((resolve, reject) => {

//         var tomorrow = new Date();
//         var initialDate = new Date();
//         var today = new Date();
//         tomorrow.setDate(today.getDate() + 1);
//         initialDate.setDate(today.getDate() - 6);

//         initialDate.setHours(0);
//         initialDate.setMinutes(0);
//         initialDate.setMilliseconds(0);
//         initialDate.setSeconds(0);


//         console.log("going to fetch last 7 days order");
//         var query = firebase.firestore()
//             .collection('orders')
//             .where("seller_id", "==", sellerId)
//             .where("order_date", ">=", initialDate)
//             .where("order_date", "<", tomorrow)
//             .where("cancelled", "==", false);

//         query.get()
//             .then(function (snapshot) {
//                 console.log("docs count -" + snapshot.docs.length);
//                 snapshot.forEach(function (doc) {

//                     var order = doc.data();
//                     ordersLast7Days.push(order);

//                 })
//             }).then(function () {
//                 resolve();

//             })

//     })


// }

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
            .where("seller_id", "==", sellerId)
            .where("order_date", ">=", initialDate)
            .where("order_date", "<", tomorrow)
            .where("cancelled", "==", false);

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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        .where("seller_id", "==", sellerId)
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


function loadPendingOrders() {
    var query = firebase.firestore()
        .collection('orders')
        .where("seller_id", "==", sellerId)
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

    if (seller.subscription_end_date == null) {
        spanSubscribed.textContent = "Subscription Status: Not Availed";

    }
    else {

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
            spanSubscribed.textContent = "Subscription Status: Expired";
            spanValidTill.textContent = "Subscription Expired On: " + formattedDay;
            spanType.textContent = "Subscription Type: " + seller.subscription_type;
        }

        else {
            spanSubscribed.textContent = "Subscription Status: Active";
            spanValidTill.textContent = "Subscription Valid Till: " + formattedDay;
            spanType.textContent = "Subscription Type: " +  seller.subscription_type;
        }

    }

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

function loadSellerDetails() {
    // console.log("loading seller details");
    // console.log("loading seller details1");
    var query = firebase.firestore()
        .collection('seller').doc(sellerId);


    query.get().then(function (doc) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.
        var seller = doc.data();
        console.log(seller);
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


        if (seller.city_seller) {
            cardCity.style.display = "block";
        }
        else{
            cardCity.style.display = "none";
        }

        loadMyAccountsInfo(seller);

        //     loadShopDetails().then(() => {
        //         //console.log("going to show nav city");
        //         cardCity.style.display = "block";
        //         loadMyAccountsInfo(seller);

        //     })
        // }
        // else {
        //     //console.log("going to hid nav city");
        //     cardCity.style.display = "none";
        //     loadMyAccountsInfo(seller);
        // }

        // window.location.reload(true);




    }).catch(function (error) {
        console.log("Error getting cached document:", error);
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



function generatePayouts() {

    var promiseList = [];

    loadComissionMap().then(() => {
        getUnSettledOrders().then(() => {
            for (var i = 0; i < unsettledOrders.length; i++) {
                promiseList.push(mapProductsAgainstOrder(unsettledOrders[i]));
            }
            Promise.all(promiseList).then(() => {
                calculatePayout();
                calculateDisbursableAmount();
            })


        });
    })
}

function calculatePayout() {

    var productList = [];

    for (var i = 0; i < unsettledOrders.length; i++) {
        var order = unsettledOrders[i];
        if (order.cancelled) {
            continue;
        }
        productList = unsettledOrdersProductMap.get(order.order_id);
        for (var j = 0; j < productList.length; j++) {
            var product = productList[j];

            var amtToReduce = 0;
            if (product.return_requested && product.return_processed) {
                amtToReduce = product.return_amount;

            }

            var commission = commision_map.get(product.Category);
            var offer_price = product.Offer_Price * product.Qty;
            offer_price = offer_price - amtToReduce;
            var seller_part = offer_price - (offer_price * commission / 100);
            var admin_part = offer_price - seller_part;

            if (order.COD == true) {
             //   console.log("offer price  = " + product.Offer_Price);
              //  console.log("commision %  = " + commission);


                cod_payout_seller += seller_part;
                cod_commission_admin += admin_part;
                // console.log("cod seller payout =" +  cod_payout_seller);
                // console.log("cod commision = " + cod_commission_admin);
                // console.log("admin_part = " + admin_part);
                // console.log("seller_part = " + seller_part);
                // console.log("-----------------------------------------");
            }
            else {
                //if order is prepaid and successful payment has been made
                if (order.payment_id != null) {
                    elec_payout_seller += seller_part;
                    elec_commission_admin += admin_part;

                }
            }
        }
    }

    // hCODCommission.textContent = cod_commission_admin.toFixed(2);
    // hElecCommission.textContent = elec_commission_admin.toFixed(2);
    hPendingCODPayouts.textContent = rupeeSymbol + cod_payout_seller.toFixed(2);
    hPendingElecPayouts.textContent = rupeeSymbol + elec_payout_seller.toFixed(2);




}

function calculateDisbursableAmount() {
    var freezedAmount = 0;
    var disbursableAmount = 0;
    var freezedCommission = 0;
    var availableCommission = 0;
    var arrOrders = [];


    for (var orderNumber = 0; orderNumber < unsettledOrders.length; orderNumber++) {
        var order = unsettledOrders[orderNumber];
        //if order was a cancelled one.. no need to process it
        if (order.cancelled == true) {
            // ordersTobeSettled.set(seller.seller_id, order);
            continue;
        }
        var deliveryDate = order.delivery_date;
        var productList = unsettledOrdersProductMap.get(order.order_id);

        for (var productNumber = 0; productNumber < productList.length; productNumber++) {
            var product = productList[productNumber];
            var amtToReduce = 0;
            if (product.return_requested && product.return_processed) {
                amtToReduce = product.return_amount;

            }
            var commission = commision_map.get(product.Category);
            var offer_price = product.Offer_Price * product.Qty;
            offer_price = offer_price - amtToReduce;
            var seller_part = offer_price - (offer_price * commission / 100);
            var admin_part = offer_price - seller_part;

            //If product is not delivered yet.. it will fall in freezed category
            if (deliveryDate == null) {
                freezedAmount += seller_part;
                freezedCommission += admin_part;
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
                    console.log(month, year);
                    var numberofDays = getDaysInMonth(month, year);
                    console.log(numberofDays);
                    //if this is last day of the month move the orders from 1 to 15 in available range
                    if (day == numberofDays) {
                        dtFreezeWindowStart = new Date(year, month, 16);
                    }
                }

                //All the orders that were delivered before freezing window started will be available for disbursement
               // console.log("Delivery date - " + dtDelivery);
               // console.log("Freezing window start date - " + dtFreezeWindowStart);
                if (dtDelivery < dtFreezeWindowStart) {
                    disbursableAmount += seller_part;
                    availableCommission += admin_part;
                    arrOrders.push(order);

                }
                else {
                    freezedAmount += seller_part;
                    freezedCommission += admin_part;
                }


            }

        }

    }



    hFreezed.textContent = rupeeSymbol + freezedAmount.toFixed(2);
    hDisbursable.textContent = rupeeSymbol + disbursableAmount.toFixed(2);
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
            .where("seller_id", "==", sellerId)
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

function mapCurrentMonthsProductAgainstOrder(order) {

    console.log("mapping product against order");
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
            .where("seller_id", "==", sellerId)
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

