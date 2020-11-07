
var docLimit = 25;

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
var txtProductId = document.getElementById("txtProductId");
var btnSearchProduct = document.getElementById("btnSearchProduct");

var pageIndex = 0;
var lastVisibleDoc;

var queryList = [];
var productList = [];


var nextQuery;

btnSearchProduct.addEventListener("click", function(){
  productList = [];
  deleteTableRows();
  var query = firebase.firestore()
    .collection('products')
    .where("Product_Id", '==', txtProductId.value);
    showListing(query).then(function(){
      addRecordToTable();
    })

})

btnNext.addEventListener("click", function () {

  productList = [];
  deleteTableRows();
  btnPrevious.style.display = "block";
  imgLoading.style.display = "block";
  divContent.style.display = "none";
  divLoadingGif.style.display = "block";
  divLoadingGif.style.width = "500px";
  divLoadingGif.style.height = "500px";

  console.log("pageindex -" + pageIndex);
  var query = queryList[pageIndex + 1];
  showListing(query).then(() => {
    nextQuery = firebase.firestore()
      .collection('products')
      .where("seller_id", '==', sellerid)
      .orderBy('timestamp', 'desc')
      .startAfter(lastVisibleDoc)
      .limit(docLimit);


    pageIndex++;
    queryList.push(nextQuery);

    addRecordToTable();

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

  console.log("pageindex :" + pageIndex);
  var query = queryList[pageIndex - 1];
  showListing(query).then(() => {
    nextQuery = firebase.firestore()
      .collection('products')
      .where("seller_id", '==', sellerid)
      .orderBy('timestamp', 'desc')
      .startAfter(lastVisibleDoc)
      .limit(docLimit);

    pageIndex--;
    if (pageIndex == 0) {
      btnPrevious.style.display = "none";

    }

    addRecordToTable();

  })

});



showData();

function showData() {
  var query = firebase.firestore()
    .collection('products')
    .where("seller_id", '==', sellerid)
    .orderBy('timestamp', 'desc')
    .limit(docLimit);

  queryList.push(query);

  showListing(query).then(function () {

    nextQuery = firebase.firestore()
      .collection('products')
      .where("seller_id", '==', sellerid)
      .orderBy('timestamp', 'desc')
      .startAfter(lastVisibleDoc)
      .limit(docLimit);

    queryList.push(nextQuery);

    addRecordToTable();
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
        divContent.style.display = "block";

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
  var stockQtyHeader = document.createElement('th');
  var offerPriceHeader = document.createElement('th');
  var mrpHeader = document.createElement('th');
  var actionHeader = document.createElement('th');



  imageHeader.innerHTML = "Image";
  productTitleHeader.innerHTML = "Product Title";
  stockQtyHeader.innerHTML = "Stock Qty";
  offerPriceHeader.innerHTML = "Offer Price";
  mrpHeader.innerHTML = "MRP";
  actionHeader.innerHTML = "Action";


  tr.appendChild(imageHeader);
  tr.appendChild(productTitleHeader);
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

    var tr = document.createElement('tr');

    var tdImage = document.createElement("td");
    var tdTitle = document.createElement('td');
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
    var href = "AddListing.html?productid=" + productId;
    anchorProductTitle.setAttribute("href", href);
    anchorProductTitle.setAttribute("target", "_blank");
    anchorProductTitle.innerHTML = productTitle;

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

    if(!product.Active){
      var divSpan = document.createElement("span");
      var span = document.createElement("span");
      span.innerHTML = "<br />This product is not available for buyers. You need to activate this listing.";
      span.style.color = "#ff0000";
      divSpan.appendChild(span);
      divProductTitle.appendChild(divSpan);
    }
    tdTitle.appendChild(divProductTitle);

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
    var btnDeactivate = document.createElement("button");

    btnDeactivate.setAttribute("id", i.toString());
    if(product.Active)
    {
      btnDeactivate.textContent = "Deactivate Listing";
    }
    else
    {
      btnDeactivate.textContent = "Activate Listing";
    }
    divAction.appendChild(btnDeactivate);
    tdAction.appendChild(divAction);



    tr.appendChild(tdImage);
    tr.appendChild(tdTitle);
    tr.appendChild(tdStock);
    tr.appendChild(tdOfferPrice);
    tr.appendChild(tdMRP);
    tr.appendChild(tdAction);

    btnDeactivate.addEventListener("click", function () {
      var index = parseInt(this.id);
      var product = productList[index];

      var activate = false;
      if(this.textContent == "Activate Listing"){
        activate = true;
      }

      
      ActivateListing(product.Product_Id, activate);
    });


    table.appendChild(tr);
  }
}


function ActivateListing(productId, activate) {

  console.log("going to deactivate listing for product id: " + productId);

  var docRef = firebase.firestore().collection("products").doc(productId);

  // Set the "capital" field of the city 'DC'
  return docRef.update({
    Active: activate
  })
    .then(function () {
      console.log("Document successfully updated!");
      window.location.href = "showListing.html";
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });

}

