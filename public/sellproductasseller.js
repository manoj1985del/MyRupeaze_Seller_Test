
var productList = [];
var alreadySellingProductIds = [];
var alreadySellingProducts = [];
var nextQuery;
var lastVisibleDoc;
var paginationFinished = false;

var divLoadingGif = document.getElementById("divLoadingGif");
var table = document.getElementById("tblProductList");
var sellerId = localStorage.getItem("sellerid");
var loading = document.getElementById("loading");
var divContent = document.getElementById("divContent");
var btnNext = document.getElementById("next");
var btnPrevious = document.getElementById("previous");
var errMsg = document.getElementById("errorMsg");
var queryList = [];
var pageIndex = 0;


btnNext.addEventListener("click", function () {
    divLoadingGif.style.display = "block";
    imgLoading.style.display = "block";
    divLoadingGif.style.width = "500px";
    divLoadingGif.style.height = "500px";
    divContent.style.display = "none";
    btnNext.style.display = "none";
    btnPrevious.style.display = "none";
    productList = [];
    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex + 1];
    fetchProducts(query).then(() => {
        nextQuery = firebase.firestore()
            .collection('products')
            .where("seller_id", "==", sellerId)
            .startAfter(lastVisibleDoc)
            .limit(docLimit);

        if (paginationFinished == false) {
            btnNext.style.display = "block";
        }
        else {
            btnNext.style.display = "none";
        }
        btnPrevious.style.display = "block";


        pageIndex++;
        queryList.push(nextQuery);

        createTable();

    });

})
btnPrevious.addEventListener("click", function () {

    divLoadingGif.style.display = "block";
    errMsg.textContent = "";
    paginationFinished = false;
    imgLoading.style.display = "block";
    divLoadingGif.style.width = "500px";
    divLoadingGif.style.height = "500px";
    divContent.style.display = "none";
    btnNext.style.display = "none";
    btnPrevious.style.display = "none";
    productList = [];
    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex - 1];
    fetchProducts(query).then(() => {
        pageIndex--;
        if (pageIndex == 0) {
            console.log("btnPrevious display is going to be none");
            btnPrevious.style.display = "none";
        } else {
            btnPrevious.style.display = "block";
        }

        queryList.push(nextQuery);

        createTable();

    });

});

getAlreadySellingProducts().then(() => {
    loadAllProducts();
})


function loadAllProducts() {

    var query = firebase.firestore()
        .collection('products')
        .where("seller_id", "==", sellerId)
        .limit(docLimit);

    queryList.push(query);

    fetchProducts(query).then(() => {

        nextQuery = firebase.firestore()
            .collection('products')
            .where("seller_id", "==", sellerId)
            .startAfter(lastVisibleDoc)
            .limit(docLimit);

        queryList.push(nextQuery);

        createTable();
    })

}



function fetchProducts(query) {

    return new Promise((resolve, reject) => {

        query.get()
            .then(function (snapshot) {

                divLoadingGif.style.display = "none";
                divContent.style.display = "block";
                divLoadingGif.style.width = "0px";
                divLoadingGif.style.height = "0px";

                imgLoading.style.display = "none";


                if (snapshot.docs.length < docLimit) {
                    btnNext.style.display = "none";
                } else {
                    btnNext.style.display = "block";
                }

                if (queryList.length > 1 && snapshot.docs.length == 0) {
                    errMsg.textContent = "No further rows to display";
                    divContent.style.display = "none";
                    btnNext.style.display = "none";
                    paginationFinished = true;
                    // pageIndex++;
                    return;
                }

                if (snapshot.docs.length == 0 && productList.length == 0) {
                    errMsg.textContent = "No product found";
                    divContent.style.display = "none";
                    return;
                }

                if (snapshot.docs.length == 0) {
                    errMsg.textContent = "No product found";
                    divContent.style.display = "none";

                    return;
                }




                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

                snapshot.forEach(function (doc) {
                    var product = doc.data();
                    productList.push(product);
                })

            }).then(function () {
                console.log("resoving");
                resolve();
            })


    });
}

function createTable() {


    createTableHeaders();
    for (var i = 0; i < productList.length; i++) {

        var index = i.toString();

        var product = productList[i];

        //create a table row
        var tr = document.createElement("tr");
        var tdImage = document.createElement("td");
        var tdProductName = document.createElement("td");
        var tdProductId = document.createElement("td");
        var tdOnlinePrice = document.createElement("td");
        var tdAction = document.createElement("td");


        var divProductImage = document.createElement("div");
        var divProductName = document.createElement("div");
        var divProductId = document.createElement("div");
        var divOnlinePrice = document.createElement("div");
        var divAction = document.createElement("div");


        var imgProduct = document.createElement("img");
        imgProduct.style.width = "50px";
        imgProduct.style.height = "50px";
        imgProduct.setAttribute("src", product.ImageUrlCover);
        divProductImage.appendChild(imgProduct);

        var productName = document.createElement("span");
        productName.textContent = product.Title;
        divProductName.appendChild(productName);

        var productId = document.createElement("span");
        productId.textContent = product.Product_Id;
        divProductId.appendChild(productId);

        var onlinePrice = document.createElement("span");
        onlinePrice.textContent = product.Offer_Price;
        divOnlinePrice.appendChild(onlinePrice);


        // console.log(alreadySellingProducts);
        // for(var i = 0 ; i < alreadySellingProducts.length; i++){
        //     var pr = alreadySellingProducts[i];
        //     if(pr.productId == pr)
        // }
        // var prIndex = alreadySellingProductIds.indexOf(product.Product_Id);
        // if (prIndex >= 0) {
        //     var pr = alreadySellingProducts[prIndex];
        //     yourPrice.textContent = pr.Offer_Price;
        // }


        var divConfirm = document.createElement("div");
        divConfirm.setAttribute("id", "idConfrimDiv" + index);

        var divStartSelling = document.createElement("div");
        divStartSelling.style.marginBottom = "10px";
        var btnStartSelling = document.createElement("button");
        btnStartSelling.setAttribute("id", index);
        btnStartSelling.textContent = "Start Selling";
        btnStartSelling.style.width = "150px";
        divStartSelling.appendChild(btnStartSelling);

     

        divConfirm.appendChild(divStartSelling);

        if (product.selling_offline) {
            btnStartSelling.textContent = "Stop Selling Offline";
        } else {
           // divEdit.style.display = "none";
        }


        //append confirm button and cancel button to divActoin
        divAction.appendChild(divConfirm);

        tdImage.appendChild(divProductImage);
        tdProductName.appendChild(divProductName);
        tdProductId.appendChild(divProductId);
        tdOnlinePrice.appendChild(divOnlinePrice);
        tdAction.appendChild(divAction);

        tr.appendChild(tdImage);
        tr.appendChild(tdProductName);
        tr.appendChild(tdProductId)
        tr.appendChild(tdOnlinePrice);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnStartSelling.addEventListener("click", function () {

            var index = parseInt(this.id);
            var product = productList[index];
            if (this.textContent == "Stop Selling Offline") {
                updateOfflineFlag(product.Product_Id, false);
               
            }
            else {
                updateOfflineFlag(product.Product_Id, true);
            }
        })


    }





}

function updateShopPrice(productId) {

    var washingtonRef = firebase.firestore().collection("products").doc(productId);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        selling_offline: false,
        shop_price: 0,
    })
        .then(function () {
          //  console.log("Document successfully updated!");
          //  alert("Details saved successfully");
            window.location.href = "SellProductAsSeller.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

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
    var tr = document.createElement('tr');

    var imageHeader = document.createElement("th");
    var productNameHeader = document.createElement('th');
    var productIdHeader = document.createElement('th');
    var onlinePriceHeder = document.createElement('th');
    var actionHeader = document.createElement('th');


    imageHeader.innerHTML = "Image";
    productNameHeader.innerHTML = "Product Name";
    productIdHeader.innerHTML = "Product Id";
    onlinePriceHeder.innerHTML = "Online Price";
    actionHeader.innerHTML = "Action";

    tr.appendChild(imageHeader);
    tr.appendChild(productNameHeader);
    tr.appendChild(productIdHeader);
    tr.appendChild(onlinePriceHeder);
    tr.appendChild(actionHeader);


    table.appendChild(tr);

}

function getAlreadySellingProducts() {

    return new Promise((resolve, reject) => {
        var query = firebase.firestore()
            .collection('shops').doc(sellerId).collection("products");


        query.get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    var product = doc.data();
                    console.log("pushing already sold  product")
                    alreadySellingProductIds.push(product.Product_Id);
                    alreadySellingProducts.push(product);
                })
            }).then(() => {
                console.log("resolving already sold products");
                resolve();
            })

    })
}

function updateOfflineFlag(productId, flag) {

    var washingtonRef = firebase.firestore().collection("products").doc(productId);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        selling_offline: flag,
    })
        .then(function () {
          //  console.log("Document successfully updated!");
            alert("Details saved successfully");
            window.location.href = "SellProductAsSeller.html";
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}