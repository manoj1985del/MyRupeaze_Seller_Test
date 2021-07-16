

var rupeeSymbol = "₹ ";

//rupeeSymbol + numberWithCommas(netPayable);

var divErrorMsg = document.getElementById("divErrorMsg");
var divLoadingGif = document.getElementById("divLoadingGif");
var divContent = document.getElementById("divContent");
var sellerid = localStorage.getItem("sellerid");
var btnNext = document.getElementById('next');
var btnPrevious = document.getElementById("previous");
var errorMsg = document.getElementById("errMsg");
var table = document.getElementById("tblshowlisting");
var imgLoading = document.getElementById("imgLoading");
var pageIndex = 0;
var lastVisibleDoc;
var productAndSellerMap = new Map();
var btnSearchProduct = document.getElementById("btnSearchProduct");
var cmbSearchBy = document.getElementById('cmbSearchBy');
var divSearchBy = document.getElementById('divSearchBy');
var cmbProductCategory = document.getElementById('cmbProductCategory');

var queryList = [];
var productList = [];




var nextQuery;
var type = getQueryVariable("type");
if (type == null || type == undefined) {
    type = "all";
}

cmbSearchBy.addEventListener("change", function () {
    divSearchBy.style.display = "block";


    if (this.value == "Product Id") {
        txtProductId.style.display = "block";
        cmbProductCategory.style.display = "none";

    }
    if (this.value == "Product Category") {
        txtProductId.style.display = "none";
        cmbProductCategory.style.display = "block";
    }
})

btnSearchProduct.addEventListener("click", function () {
    queryList = [];
    pageIndex = 0;
    productList = [];
    deleteTableRows();
    productAndSellerMap = new Map();
    var query;
    if (cmbSearchBy.value == "Product Id") {
        query = firebase.firestore()
            .collection('products')
            .where("Product_Id", '==', txtProductId.value);
    }

    else {

        if (cmbSearchBy.value == "Product Category") {
            if (type == "pending") {
                query = firebase.firestore()
                    .collection('products')
                    .where("Category", '==', cmbProductCategory.value)
                    .where("status", "==", "pending")
                    .orderBy('timestamp', 'desc')
                    .limit(docLimit);
            }
            else {
                query = firebase.firestore()
                    .collection('products')
                    .where("Category", '==', cmbProductCategory.value)
                    .orderBy('timestamp', 'desc')
                    .limit(docLimit);
            }
        }
    }


        queryList.push(query);

        showListing(query).then(function () {

            var promiseList = [];
            for (var i = 0; i < productList.length; i++) {
                var product = productList[i];
                promiseList.push(mapProductWithSeller(product));
            }

            Promise.all(promiseList).then(() => {

                if (type == "pending") {
                    nextQuery = firebase.firestore()
                        .collection('products')
                        .where("Category", '==', cmbProductCategory.value)
                        .where("status", "==", "pending")
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                else {

                    nextQuery = firebase.firestore()
                        .collection('products')
                        .where("Category", '==', cmbProductCategory.value)
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
                queryList.push(nextQuery);
                console.log("going to add records");
                addRecordToTable();

            })

        })
    
})

btnNext.addEventListener("click", function () {

    productList = [];
    productAndSellerMap = new Map();
    deleteTableRows();
    btnPrevious.style.display = "block";
    imgLoading.style.display = "block";
    divContent.style.display = "none";
    divLoadingGif.style.display = "block";
    divLoadingGif.style.width = "500px";
    divLoadingGif.style.height = "500px";

    //console.log("pageindex -" + pageIndex);
    var query = queryList[pageIndex + 1];
    showListing(query).then(() => {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }
        Promise.all(promiseList).then(() => {

            if (cmbSearchBy.value == "Product Category") {

                if (type == "pending") {
                    nextQuery = firebase.firestore()
                        .collection('products')
                        .where("status", "==", "pending")
                        .where("Category", "==", cmbProductCategory.value)
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                } else {
                    //console.log("in all");
                    nextQuery = firebase.firestore()
                        .collection('products')
                        .where("Category", "==", cmbProductCategory.value)
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
            }
            else {
                if (type == "pending") {
                    //  console.log("in pending");
                    nextQuery = firebase.firestore()
                        .collection('products')
                        .where("status", "==", "pending")
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                } else {
                    // console.log("in all");
                    nextQuery = firebase.firestore()
                        .collection('products')
                        .orderBy('timestamp', 'desc')
                        .startAfter(lastVisibleDoc)
                        .limit(docLimit);
                }
            }



            pageIndex++;
            queryList.push(nextQuery);

            addRecordToTable();

        });


    })

});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


btnPrevious.addEventListener("click", function () {

    productList = [];
    deleteTableRows();
    divErrorMsg.style.display = "none";
    divLoadingGif.style.display = "block";
    divLoadingGif.style.width = "500px";
    divLoadingGif.style.height = "500px";
    imgLoading.style.display = "block";
    divContent.style.display = "none";

    // console.log("pageindex :" + pageIndex);
    var query = queryList[pageIndex - 1];
    showListing(query).then(() => {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }

        Promise.all(promiseList).then(() => {

            if (type == "pending") {
                nextQuery = firebase.firestore()
                    .collection('products')
                    .where("status", "==", "pending")
                    .orderBy('timestamp', 'desc')
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            } else {
                nextQuery = firebase.firestore()
                    .collection('products')
                    .orderBy('timestamp', 'desc')
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }




            pageIndex--;
            if (pageIndex == 0) {
                btnPrevious.style.display = "none";

            }

            addRecordToTable();

        })

    })


});


//doTest();
//alert("updating the tags");

showData();

function showData() {
    var query;

    if (type == "pending") {

        query = firebase.firestore()
            .collection('products')
            .where("status", "==", "pending")
            .orderBy('timestamp', 'desc')
            .limit(docLimit);

    }
    else {
        query = firebase.firestore()
            .collection('products')
            .orderBy('timestamp', 'desc')
            .limit(docLimit);
    }


    queryList.push(query);

    showListing(query).then(function () {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }

        Promise.all(promiseList).then(() => {

            if (type == "pending") {
                nextQuery = firebase.firestore()
                    .collection('products')
                    .where("status", "==", "pending")
                    .orderBy('timestamp', 'desc')
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }
            else {

                nextQuery = firebase.firestore()
                    .collection('products')
                    .orderBy('timestamp', 'desc')
                    .startAfter(lastVisibleDoc)
                    .limit(docLimit);
            }
            queryList.push(nextQuery);
          
            addRecordToTable();

        })

    })
}

function showListing(query) {
    return new Promise((resolve, reject) => {

        query.get()
            .then(function (snapshot) {
                imgLoading.style.display = "none";
                divContent.style.display = "block";


                if (snapshot.docs.length < docLimit) {
                    btnNext.style.display = "none";
                } else {
                    btnNext.style.display = "block";
                }

                if (queryList.length > 1 && snapshot.docs.length == 0) {
                    divErrorMsg.style.display = "block";
                    errMsg.textContent = "No further rows to display";

                    //pageIndex++;
                    //  console.log("increased page index to:" + pageIndex);
                    btnNext.style.display = "none";
                    return;
                }

                if (snapshot.docs.length == 0) {
                    divErrorMsg.style.display = "block";
                    errMsg.textContent = "No Records Found";
                    return;
                }


                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];


                divLoadingGif.style.display = "none";
                divLoadingGif.style.width = "0px";
                divLoadingGif.style.height = "0px";
                imgLoading.style.display = "none";
                divContent.style.display = "block";

                //  createTableHeaders();
                snapshot.forEach(function (doc) {
                    var product = doc.data();
                    //console.log("pushing product");
                    productList.push(product);

                    // console.log("going to add record to table");
                    // addRecordToTable(product.Title, product.stock_qty, product.Offer_Price, product.MRP, product.Product_Id, product.ImageUrlCover);
                })


            }).then(function () {
                console.log("resolving");
                resolve();
            });
    })


    // Start listening to the query.
    // query.onSnapshot(function(snapshot) {

    //   imgLoading.style.display = "none";


    //   if(snapshot.docs.length < docLimit){
    //       btnNext.style.display = "none";
    //   }else{
    //       btnNext.style.display = "block";
    //   }

    //   if (queryList.length > 1 && snapshot.docs.length == 0) {
    //       errMsg.textContent = "No further rows to display";
    //       pageIndex++;
    //       btnNext.style.display = "none";
    //       return;
    //   }

    //   if (snapshot.docs.length == 0) {
    //     divErrorMsg.style.display = "block";
    //       return;
    //   }


    //   lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

    //   divLoadingGif.style.display = "none";
    //   divLoadingGif.style.width = "0px";
    //   divLoadingGif.style.height = "0px";

    //   snapshot.docChanges().forEach(function(change) {
    //       var product = change.doc.data();
    //       addRecordToTable(product.Title, product.stock_qty, product.Offer_Price, product.MRP, product.Product_Id, product.ImageUrlCover);
    //     //   displayMessage(change.doc.id, message.timestamp, message.name,
    //     //                  message.text, message.profilePicUrl, message.imageUrl);

    //   });
    //   document.body.appendChild(table);
    // });
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
    var productIdHeader = document.createElement('th');
    var productTitleHeader = document.createElement('th');
    var sellerHeader = document.createElement('th');
    var stockQtyHeader = document.createElement('th');
    var offerPriceHeader = document.createElement('th');
    var mrpHeader = document.createElement('th');
    var actionHeader = document.createElement('th');



    imageHeader.innerHTML = "Image";
    productTitleHeader.innerHTML = "Product Title";
    sellerHeader.innerHTML = "Seller Details"
    stockQtyHeader.innerHTML = "Stock Qty";
    offerPriceHeader.innerHTML = "Offer Price";
    mrpHeader.innerHTML = "MRP";
    actionHeader.innerHTML = "Action";


    tr.appendChild(imageHeader);
    tr.appendChild(productTitleHeader);
    tr.appendChild(sellerHeader);
    tr.appendChild(stockQtyHeader);
    tr.appendChild(offerPriceHeader);
    tr.appendChild(mrpHeader);
    tr.appendChild(actionHeader);


    table.appendChild(tr);

}

function addRecordToTable() {
    if (productList.length > 0) {
        createTableHeaders();
        divErrorMsg.style.display = "none";
    }
    for (var i = 0; i < productList.length; i++) {
        var product = productList[i];


        //addRecordToTable(product.Title, product.stock_qty, product.Offer_Price, product.MRP, product.Product_Id, product.ImageUrlCover);
        var productTitle = product.Title;
        var stockQty = product.stock_qty;
        var offerPrice = rupeeSymbol + numberWithCommas(product.Offer_Price);
        var mrp = rupeeSymbol + numberWithCommas(product.MRP); // product.MRP;
        var productId = product.Product_Id;
        var coverImageUrl = product.ImageUrlCover;
        var seller = productAndSellerMap.get(product.Product_Id);
        //console.log(seller);

        var tr = document.createElement('tr');

        var tdImage = document.createElement("td");
        var tdTitle = document.createElement('td');
        var tdSeller = document.createElement("td");
        var tdStock = document.createElement('td');
        var tdOfferPrice = document.createElement('td');
        var tdMRP = document.createElement('td');
        var tdAction = document.createElement('td');

        var divImage = document.createElement("div");
        var imgProduct = document.createElement("img");
        imgProduct.setAttribute("src", coverImageUrl);
        imgProduct.style.width = "50px";
        imgProduct.style.height = "50px";
        divImage.appendChild(imgProduct);
        tdImage.appendChild(divImage);


        var divProductTitle = document.createElement("div");
        //"<a href='AddListing.html?productid=" + productId + ">" + title + "</a>
        var anchorProductTitle = document.createElement("a");
        var href = "AddListing.html?productid=" + productId + "&admin=true";
        anchorProductTitle.setAttribute("href", href);
        anchorProductTitle.setAttribute("target", "_blank");

        anchorProductTitle.textContent = productTitle;

        var spanProductId = document.createElement("span");
        spanProductId.innerHTML = "<br />Product Id: " + product.Product_Id + "</br>";

        var spanReturnWindow = document.createElement("span");
        spanReturnWindow.innerHTML = "<br />Returning Window: " + product.returning_window + "</br>";

        var spanGST = document.createElement("span");
        spanGST.innerHTML = "GST: " + product.GST + "%</br>";
        divProductTitle.appendChild(anchorProductTitle);
        divProductTitle.appendChild(spanProductId);
        divProductTitle.appendChild(spanReturnWindow);
        divProductTitle.appendChild(spanGST);


        if (!product.Active) {
            var divSpan = document.createElement("span");
            var span = document.createElement("span");
            if (product.status == "pending") {
                span.innerHTML = "<br />This product is not available for buyers. You need to approve this listing.";
            }
            else {
                span.innerHTML = "<br />This product is not available for buyers. You need to activate this listing.";
            }

            span.style.color = "#ff0000";
            divSpan.appendChild(span);
            divProductTitle.appendChild(divSpan);
        }
        tdTitle.appendChild(divProductTitle);

        var divSellerDetails = document.createElement("div");
        var spanSeller = document.createElement("span");
        spanSeller.innerHTML = "Seller Name : " + seller.company_name
            + "<br />Merchant Id: " + seller.merchant_id
            + "<br />Phone: " + seller.mobile
            + "<br />Email: " + seller.email;

        divSellerDetails.appendChild(spanSeller);
        tdSeller.appendChild(divSellerDetails);

        var divStockQty = document.createElement("div");
        var spanStockQty = document.createElement("span");
        spanStockQty.textContent = stockQty;
        divStockQty.appendChild(spanStockQty);
        tdStock.appendChild(divStockQty);

        var divOfferPrice = document.createElement("div");
        var spanOfferPrice = document.createElement("span");
        spanOfferPrice.textContent = offerPrice;
        divOfferPrice.appendChild(spanOfferPrice);
        tdOfferPrice.appendChild(divOfferPrice);

        var divMRP = document.createElement("div");
        var spanMRP = document.createElement("span");
        spanMRP.textContent = mrp;
        divMRP.appendChild(spanMRP);
        tdMRP.appendChild(divMRP);

        var divAction = document.createElement("div");
        var divDelete = document.createElement("div");
        var btnDeleteListing = document.createElement("button");
        btnDeleteListing.setAttribute("id", i.toString());
        btnDeleteListing.textContent = "Delete Listing";
        btnDeleteListing.style.width = "150px";
        divDelete.appendChild(btnDeleteListing);
        divAction.appendChild(divDelete);

        var divApprove = document.createElement("div");
        divApprove.style.marginTop = "10px";
        var btnApprove = document.createElement("button");
        btnApprove.setAttribute("id", i.toString());
        btnApprove.textContent = "Approve Listing";
        btnApprove.style.width = "150px";
        divApprove.appendChild(btnApprove);
        divAction.appendChild(divApprove);
        tdAction.appendChild(divAction);

        if (product.status == "pending") {
            divApprove.style.display = "block";
        } else {
            divApprove.style.display = "none";
        }

        tr.appendChild(tdImage);
        tr.appendChild(tdTitle);
        tr.appendChild(tdSeller);
        tr.appendChild(tdStock);
        tr.appendChild(tdOfferPrice);
        tr.appendChild(tdMRP);
        tr.appendChild(tdAction);
        table.appendChild(tr);

        btnDeleteListing.addEventListener("click", function () {
            var index = parseInt(this.id);
            var product = productList[index];

            var reason = prompt("Please enter the reason to delete", "");
            if (reason == null || reason == "") {
                return;
            }

            deleteListing(product.Product_Id).then(() => {

                sendProductDeletionMail(product, reason);
                window.location.href = "admin_show_listing.html";

            })

        })

        btnApprove.addEventListener("click", function () {
            var index = parseInt(this.id);
            var product = productList[index];

            approveListing(product).then(() => {
                sendProductApprovalMail(product);
                window.location.href = "admin_show_listing.html";
            })
        })
    }
}


function deleteListing(productId) {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("products").doc(productId).delete().then(function () {
            resolve();
        }).catch(function (error) {
            reject();
        });

    })


}

function approveListing(product) {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("products").doc(product.Product_Id);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            status: "approved",
            Active: true
        }).then(function () {
            console.log("Update tags for proudct" + product.Title);
            resolve();
        }).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            reject();
        });

    });
}



function sendProductDeletionMail(product, reason) {

    var seller = productAndSellerMap.get(product.Product_Id);

    var body = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that we have deleted one of your listing with below details: <br />Product Id:  " + product.Product_Id
        + "<br/>Product Name: " + product.Title
        + "<p><b>Reason of de-Listing </b>" + reason + "</p>"
        + "In case of any questions please feel free to revert us back. </p>"
        + "<p>Keep Selling!!</p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    sendEmail(seller.email, "My Rupeaze Product Deletion Notice", body);
}

function sendProductApprovalMail(product) {

    var seller = productAndSellerMap.get(product.Product_Id);
    console.log(seller);

    var body = "<h3>Hello " + seller.company_name + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> Congratulations!! Your listing with product id " + product.Product_Id + " has been approved."
        + "<br/>Product Name: " + product.Title
        + "</p><p>In case of any questions please feel free to revert us back. </p>"
        + "<p>Keep Selling!!</p>"
        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

    sendEmail(seller.email, "My Rupeaze: Product Approval Notice for Product Id - " + product.Product_Id, body);
}

function mapProductWithSeller(product) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("seller").doc(product.seller_id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                var seller = doc.data();
                productAndSellerMap.set(product.Product_Id, seller);
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

    })



}

var allProducts = [];
function doTest() {
    firebase.firestore().collection("products").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var product = doc.data();
            updateTags(product);

        });
    });
}

function updateTags(product) {

    var tmpTags = [];
    var tags = [];

    for (var i = 0; i < product.Tags.length; i++) {
        var tag = product.Tags[i].trim();
        tags.push(tag);
    }

    var washingtonRef = firebase.firestore().collection("products").doc(product.Product_Id);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        status: "approved"
    }).then(function () {
        console.log("Update tags for proudct" + product.Title);
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

}

