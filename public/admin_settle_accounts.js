var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var seller;

divProgress.style.display = "none";
divContent.style.display = "block";
var sellerid = getQueryVariable("sellerid");

var sellerOrderMap = new Map();
var ordersProductMap = new Map();

loadSellerDetails().then(()=>{
    getUnSettledOrders(seller).then(()=>{
        loadUI();
    })
})

function loadSellerDetails() {
    return new Promise((resolve, reject)=>{
        var docRef = firebase.firestore().collection("seller").doc(sellerid);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                seller = doc.data();
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
                    console.log("product added");
                })
            }).then(function () {
                ordersProductMap.set(order.order_id, productList);
                resolve();
            });

    })
}
function loadUI(){ 
}
