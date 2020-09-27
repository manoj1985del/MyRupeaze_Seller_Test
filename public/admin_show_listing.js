

var docLimit = 10;

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
var divContent = document.getElementById("")
var pageIndex = 0;
var lastVisibleDoc;
var productAndSellerMap = new Map();

var queryList = [];
var productList = [];


var nextQuery;

btnNext.addEventListener("click", function () {

    productList = [];
    deleteTableRows();
    btnPrevious.style.display = "block";
    imgLoading.style.display = "block";
    divLoadingGif.style.display = "block";
    divLoadingGif.style.width = "500px";
    divLoadingGif.style.height = "500px";

    console.log("pageindex -" + pageIndex);
    var query = queryList[pageIndex + 1];
    showListing(query).then(() => {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }
        Promise.all(promiseList).then(()=>{

            nextQuery = firebase.firestore()
            .collection('products')
            .orderBy('timestamp', 'desc')
            .startAfter(lastVisibleDoc)
            .limit(docLimit);


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

    console.log("pageindex :" + pageIndex);
    var query = queryList[pageIndex - 1];
    showListing(query).then(() => {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }

        Promise.all(promiseList).then(() => {

            nextQuery = firebase.firestore()
                .collection('products')
                .orderBy('timestamp', 'desc')
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

            pageIndex--;
            if (pageIndex == 0) {
                btnPrevious.style.display = "none";

            }

            addRecordToTable();

        })

    })


});



showData();

function showData() {
    var query = firebase.firestore()
        .collection('products')
        .orderBy('timestamp', 'desc')
        .limit(docLimit);

    queryList.push(query);

    showListing(query).then(function () {

        var promiseList = [];
        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            promiseList.push(mapProductWithSeller(product));
        }

        Promise.all(promiseList).then(() => {


            nextQuery = firebase.firestore()
                .collection('products')
                .orderBy('timestamp', 'desc')
                .startAfter(lastVisibleDoc)
                .limit(docLimit);

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
                    errMsg.textContent = "You don't have an active listing";
                    return;
                }


                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];


                divLoadingGif.style.display = "none";
                divLoadingGif.style.width = "0px";
                divLoadingGif.style.height = "0px";
                imgLoading.style.display = "none";

                //  createTableHeaders();
                snapshot.forEach(function (doc) {
                    var product = doc.data();
                    console.log("pushing product");
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
        console.log(seller);

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
        anchorProductTitle.textContent = productTitle;
        divProductTitle.appendChild(anchorProductTitle);
        if (!product.Active) {
            var divSpan = document.createElement("span");
            var span = document.createElement("span");
            span.innerHTML = "<br />This product is not available for buyers. You need to activate this listing.";
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
        var btnDeleteListing = document.createElement("button");

        btnDeleteListing.setAttribute("id", i.toString());
        btnDeleteListing.textContent = "Delete Listing";
        divAction.appendChild(btnDeleteListing);
        tdAction.appendChild(divAction);
       



        tr.appendChild(tdImage);
        tr.appendChild(tdTitle);
        tr.appendChild(tdSeller);
        tr.appendChild(tdStock);
        tr.appendChild(tdOfferPrice);
        tr.appendChild(tdMRP);
        tr.appendChild(tdAction);
        table.appendChild(tr);

        btnDeleteListing.addEventListener("click", function(){
            var index = parseInt(this.id);
            var product = productList[index];

            var reason = prompt("Please enter the reason to delete", "");
            if (reason == null || reason == "") {
                return;
            }

            deleteListing(product.Product_Id).then(()=>{

                sendProductDeletionMail(product, reason);
                window.location.href = "admin_show_listing.html";

            })


        

        })

    }
}


function deleteListing(productId) {

    return new Promise((resolve, reject)=>{

        firebase.firestore().collection("products").doc(productId).delete().then(function() {
            resolve();
        }).catch(function(error) {
           reject();
        });

    })
   

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

function mapProductWithSeller(product) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("seller").doc(product.seller_id);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                var seller = doc.data();
                productAndSellerMap.set(product.Product_Id, seller);
                console.log("mapped seller");
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