var rupeeSymbol = "₹ ";
var tradeCharges = 28;
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var pageHeader = document.getElementById("pageHeader");
var table = document.getElementById("tblOrders");
var tblTotal = document.getElementById("tblTotal");
var commision_map = new Map();

var dTotalSales = 0;
var dTotalCommission = 0;

var mOrder;
var productList = [];
var cancelledOrders = [];

divProgress.style.display = "none";
divContent.style.display = "block";
pageHeader.textContent = "Ordered Product List";

var orderId = getQueryVariable("order_id");
var admin = getQueryVariable("admin");


loadComissionMap().then(()=>{
    getOrderDetail(orderId).then(() => {
        getProductsAgainstOrder(orderId).then(() => {
            createTables();
        })
    })
})




function getOrderDetail(orderId) {
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
function getProductsAgainstOrder(orderId) {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("orders").doc(orderId).collection("products")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var product = doc.data();
                    productList.push(product);
                    if(product.cancelled_by_seller){
                        cancelledOrders.push(product);
                    }

                });
            })
            .then(function () {
                console.log("resolving");
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            });

    })

}


function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}


function createTableHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thProductImage = document.createElement("th");
    thProductImage.textContent = "Image";

    var thProductName = document.createElement("th");
    thProductName.textContent = "Product Name";

    var thPrice = document.createElement("th");
    thPrice.textContent = "Price";

    var thQty = document.createElement("th");
    thQty.textContent = "Quantity";

    var thTotal = document.createElement("th");
    thTotal.textContent = "Total";

    var thCommission = document.createElement("th");
    thCommission.textContent = "Commission (A)";

    var thTradeCharges = document.createElement("th");
    thTradeCharges.textContent = "Trade Charges (B)";

    var thTaxes = document.createElement("th");
    thTaxes.textContent = "Taxes (C)";

    var thAdminPart = document.createElement("th");
    thAdminPart.textContent = "Admin Part (A + B + C)";

    var thSellerPart = document.createElement("th");
    thSellerPart.textContent = "Seller Part";


    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thProductImage);
    tr.appendChild(thProductName);
    tr.appendChild(thPrice);
    tr.appendChild(thQty);
    tr.appendChild(thTotal);
    tr.appendChild(thCommission);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTables() {

    deleteTableRows();
    createTableHeaders();
    for (var i = 0; i < productList.length; i++) {
        var product = productList[i];

        var tr = document.createElement('tr');
        var tdProductImage = document.createElement("td");
        var tdProductName = document.createElement('td');
        var tdPrice = document.createElement('td');
        var tdQty = document.createElement('td');
        var tdTotal = document.createElement('td');
        var tdCommission = document.createElement('td');
        var tdAction = document.createElement('td');

        var divImage = document.createElement("div");
        divImage.style.marginBottom = "10px";
        var imgProduct = document.createElement("Img");
        imgProduct.style.width = "50px";
        imgProduct.style.height = "50px";
        imgProduct.setAttribute("src", product.ImageUrlCover);
        divImage.appendChild(imgProduct);

        var divProductName = document.createElement('div');
        var spanProductName = document.createElement('span');
        spanProductName.innerHTML = product.Title;
        divProductName.appendChild(spanProductName);

        var spanCancellation = document.createElement("span");
        if(mOrder.cancelled){
            product.Offer_Price = 0;
            spanCancellation.style.color = "#ff0000";
            spanCancellation.innerHTML = "<br/><b>Order Cancelled</b>"
        }
        else if (product.cancelled_by_seller != null) {
            if (product.cancelled_by_seller) {
                product.Offer_Price = 0;
                spanCancellation.style.color = "#ff0000";
                spanCancellation.innerHTML = "<br/><b>(Product Cancelled by Seller)</b>"
            }  
        }
        divProductName.appendChild(spanCancellation);

        var divPrice = document.createElement('div');
        var spanProductPrice = document.createElement('span');
        spanProductPrice.innerHTML = product.Offer_Price;
        divPrice.appendChild(spanProductPrice);

        var divQty = document.createElement('div');
        var spanQty = document.createElement('span');
        spanQty.innerHTML = product.Qty;
        divQty.appendChild(spanQty);

        var divTotalPrice = document.createElement('div');
        var spanTotalPrice = document.createElement('span');
        var dTotalPrice = product.Offer_Price * product.Qty;
        dTotalSales += dTotalPrice;
        
        spanTotalPrice.innerHTML = dTotalPrice.toString();
        divTotalPrice.appendChild(spanTotalPrice);

        var divCommissoin = document.createElement('div');
        var spanCommissoin = document.createElement('span');
        var commission = commision_map.get(product.Category);
        var dCommission = (dTotalPrice * commission) / 100;
        dTotalCommission += dCommission;
        var amtCommission = dCommission.toFixed(2);
        amtCommission = rupeeSymbol + numberWithCommas(amtCommission);
        spanCommissoin.innerHTML =  amtCommission + "<br/>(" + commission.toString() + "%)"
        divCommissoin.appendChild(spanCommissoin);


        


        var divAction = document.createElement('div');
        var btnCancelOrder = document.createElement("button");
        btnCancelOrder.textContent = "Cancel Product";
        btnCancelOrder.setAttribute("id", i.toString());
        btnCancelOrder.style.width = "150px";
        divAction.appendChild(btnCancelOrder);

        if (product.cancelled_by_seller) {
            btnCancelOrder.disabled = true;
        }

        if(admin == "true"){
            divAction.style.display = "none";
        }

        tdProductImage.appendChild(divImage);
        tdProductName.appendChild(divProductName);
        tdPrice.appendChild(divPrice);
        tdQty.appendChild(divQty);
        tdTotal.appendChild(divTotalPrice);
        tdCommission.appendChild(divCommissoin);
        tdAction.appendChild(divAction);

        tr.appendChild(tdProductImage);
        tr.appendChild(tdProductName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdQty);
        tr.appendChild(tdTotal);
        tr.appendChild(tdCommission);
        tr.append(tdAction);

        table.appendChild(tr);

       

        btnCancelOrder.addEventListener("click", function () {
           
            var reason = prompt("Please enter the cancellation reason");
            if (reason == null || reason == "") {
                return;
            }

            var index = parseInt(this.id);
            var product = productList[index];

            cancelProduct(orderId, product, reason);
        })
    }

    createTotalTable();
}

function createTotalTableHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thTotalAmount = document.createElement("th");
    thTotalAmount.textContent = "Total Amount";

    var thTotalCommission = document.createElement("th");
    thTotalCommission.textContent = "Total Commission (A)";

    var thTradeCharges = document.createElement("th");
    thTradeCharges.textContent = "Trade Charges (B)";

    var thTaxes = document.createElement("th");
    thTaxes.textContent = "Taxes (C)";

    var thAdminPart = document.createElement("th");
    thAdminPart.textContent = "Admin Part (A+B+C)";

    var thSellerPart = document.createElement("th");
    thSellerPart.textContent = "Seller Part";

    tr.appendChild(thTotalAmount);
    tr.appendChild(thTotalCommission);
    tr.appendChild(thTradeCharges);
    tr.appendChild(thTaxes);
    tr.appendChild(thAdminPart);
    tr.appendChild(thSellerPart);

    tHead.appendChild(tr);
    tblTotal.appendChild(tHead);

}

function createTotalTable(){

    createTotalTableHeaders();

    var tr = document.createElement("tr");
    var tdTotalAmount = document.createElement('td');
    var tdTotalCommission = document.createElement('td');
    var tdTradeCharges = document.createElement('td');
    var tdTaxes = document.createElement('td');
    var tdAdminPart = document.createElement('td');
    var tdSellerPart = document.createElement('td');

    var divTotalAmout = document.createElement('div');
    var spanTotalAmount = document.createElement('span');
    spanTotalAmount.innerHTML = rupeeSymbol + numberWithCommas(dTotalSales.toFixed(2));
    divTotalAmout.appendChild(spanTotalAmount);

    if(dTotalSales == 0){
        tradeCharges = 0;
    }

    var divTotalCommission = document.createElement('div');
    var spanTotalCommission = document.createElement('span');
    spanTotalCommission.innerHTML = rupeeSymbol + numberWithCommas(dTotalCommission.toFixed(2));
    divTotalCommission.appendChild(spanTotalCommission);

    var divTradeCharges = document.createElement('div');
    var spanTradeCharges = document.createElement('span');
    spanTradeCharges.innerHTML = rupeeSymbol + numberWithCommas(tradeCharges.toFixed(2));
    divTradeCharges.appendChild(spanTradeCharges);

    var divTaxes = document.createElement('div');
    var spanTaxes = document.createElement('span');
    var dTaxes = ((dTotalCommission + tradeCharges) * 18) / 100;
    var taxes = dTaxes.toFixed(2);
    spanTaxes.innerHTML = rupeeSymbol + numberWithCommas(taxes);
    divTaxes.appendChild(spanTaxes);

    var divAdminPart = document.createElement('div');
    var spanAdminPart = document.createElement('span');
    var dAdminPart = dTotalCommission + tradeCharges + dTaxes;
    spanAdminPart.innerHTML = rupeeSymbol + numberWithCommas(dAdminPart.toFixed(2));
    divAdminPart.appendChild(spanAdminPart);

    var divSellerPart = document.createElement('div');
    var spanSellerPart = document.createElement('span');
    var dSellerPart = dTotalSales - dAdminPart;
    spanSellerPart.innerHTML = rupeeSymbol + numberWithCommas(dSellerPart.toFixed(2));
    divSellerPart.appendChild(spanSellerPart);

    tdTotalAmount.appendChild(divTotalAmout);
    tdTotalCommission.appendChild(divTotalCommission);
    tdTradeCharges.appendChild(divTradeCharges);
    tdTaxes.appendChild(divTaxes);
    tdAdminPart.appendChild(divAdminPart);
    tdSellerPart.appendChild(divSellerPart);

    tr.appendChild(tdTotalAmount);
    tr.appendChild(tdTotalCommission);
    tr.appendChild(tdTradeCharges);
    tr.appendChild(tdTaxes);
    tr.appendChild(tdAdminPart);
    tr.appendChild(tdSellerPart);

    tblTotal.appendChild(tr);
    


}

function cancelProduct(orderId, product, cancellation_reason) {

    var washingtonRef = firebase.firestore().collection("orders").doc(orderId).collection("products").doc(product.Product_Id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        cancelled_by_seller: true,
        cancellation_reason: cancellation_reason,
        Status: "Order Cancelled by Seller"
    })
        .then(function () {
            cancelledOrders.push(product);
            console.log("cancelled orders length = " + cancelledOrders.length);
            console.log("product list length = " + productList.length);
            if (cancelledOrders.length == productList.length) {
                alert("going to cancel order itself");
                cancelCompleteOrder(mOrder, product);
            }
            else {
                var totalPrice = product.Offer_Price * product.Qty;
                var points = totalPrice * 8;
                creditPoints(product, points);
                console.log("Document successfully updated!");
            }
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}

function cancelCompleteOrder(order, product) {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("orders").doc(order.order_id);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            Status: "Order Cancelled by Seller",
            cancelled: true
        })
            .then(function () {
                var totalPrice = product.Offer_Price * product.Qty;
                var points = totalPrice * 8;
                creditPoints(product, points);
                resolve();

            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                reject();
            });

    })


}

function creditPoints(product, points) {
    
    if (mOrder.COD) {
        //for COD order the points credited have to be reversed..
        points = -product.points_added;
    }
    else {
        //for prepaid orders refund the equivalent amount in terms of points - points earned while purhcase.
        points = points - product.points_added;
    }

    alert("goint to adjust points: " + points);

    var washingtonRef = firebase.firestore().collection("users").doc(mOrder.customer_id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        points: firebase.firestore.FieldValue.increment(points)
    })
        .then(function () {
            window.location.href = "view_products_against_order.html?order_id=" + orderId;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

