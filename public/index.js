var slideIndex = 0;
var divVideos = document.getElementById("divVideos");
var videoList = [];

var productList = [];
var offline_invoices = [];
var sellerList = [];
let qtyDiscountMap = new Map();
let qtyDiscountObjectMap = new Map();
var newInvoiceId;


// console.log("going to fetch products");
// loadSportsCategoryProducts().then(()=>{
//   for(var i = 0; i < productList.length; i++){
    
//     var product = productList[i];
//     //console.log(product.Product_Id);
//     updateCategory(product.Product_Id);
//   }
// })
//loadAllProducts();
//loadTags();
//makeTagsLower();

//loadProducts();

//createInvoicesAgainstOrder();

//uncomment this block to update merchant id of products

// loadProducts().then(()=>{
//   var promiseList = [];
//   for(var i = 0; i < productList.length; i++){
//     var product = productList[i];
//     promiseList.push(loadSellerDetails(product));
//   }

//   Promise.all(promiseList).then(()=>{
//     for(var i = 0; i < productList.length; i++){
//       var product = productList[i];
//       updateMerchantId(product);
//     }

//     console.log("sellers retrieved");
//     console.log(sellerProductMap);
//   })
// })


/*****************BEGIN: UNCOMMENT THIS SECTION FOR UPDATING MERCHANT ID AND COMPANY NAME IN OFFLINE INVOICE****** */
// loadSellers().then(()=>{
//   loadOfflineInvoices().then(()=>{
//     for(var i = 0; i < offline_invoices.length; i++){
//       var invoice = offline_invoices[i];
//       var seller = null;
//       for(var j = 0; j < sellerList.length; j++){
//         var temp = sellerList[j];
//         if(invoice.seller_id == temp.seller_id ){
//           seller = temp;
//           break;
//         }
//       }
//       if(seller != null){
//         updateSellerDetailsInOfflineInvoice(seller, invoice.invoice_id);
//       }
//     }
//   })
// })


/****************END: UNCOMMENT THIS SECTION FOR UPDATING MERCHANT ID AND COMPANY NAME IN OFFLINE INVOICE* */



function addQtyDiscount(productid, discountInPercentMap) {
  qtyDiscountMap.set(productid, discountInPercentMap);
}




showSlides();
loadVideos();


var btnStartSelling = document.getElementById("btnStartSelling");

btnStartSelling.addEventListener("click", function () {
  window.location.href = "seller_login.html";
})


function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 4000); // Change image every 2 seconds
}


function loadVideos() {
  getVideoList().then(() => {
    showVideos();
  })
}
function getVideoList() {

  return new Promise((resolve, reject) => {

    firebase.firestore().collection("videos").where("available_for", "==", "All")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          videoList.push(doc.data());

        });
      }).then(function () {
        console.log("now resolving");
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });

  })



}

function showVideos() {
  if (videoList.length == 0) {
    return;
  }

  var videoIndex = 0;
  var h3 = document.createElement("h3");
  h3.textContent = "Videos";
  divVideos.appendChild(h3);

  //one row will have two videos
  var numRows = Math.ceil(videoList.length / 2);
  if (numRows < 1) {
    numRows = 0;
  }

  console.log(numRows);

  for (var iRow = 0; iRow < numRows; iRow++) {
    // <div class="row mt-2">
    var divRow = document.createElement("div");
    divRow.classList.add("row-mt-2");

    //each row will have just two columns
    for (var iCol = 0; iCol < 2; iCol++) {

      if (videoIndex >= videoList.length) {
        break;
      }

      var video = videoList[videoIndex];

      var divCol = document.createElement("div");
      divCol.classList.add("col-md-6");

      // var iFrame = document.createElement("iframe");
      // iFrame.setAttribute("width", '560');
      // iFrame.setAttribute("width", '315');
      // iFrame.setAttribute("src",  video.video_url);
      // iFrame.setAttribute("frameborder", '0');
      // iFrame.setAttribute("allow", 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      // iFrame.allowFullscreen = true;


      var span = document.createElement("span");
      span.innerHTML = video.embed_code;

      // console.log(span.innerHTML);
      divCol.appendChild(span);
      divRow.appendChild(divCol);

      videoIndex++;

    }
    console.log("showing videos");
    divVideos.appendChild(divRow);
  }

}


function loadProducts() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("products")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var product = doc.data();
          console.log(product.Product_Id);
          productList.push(product);

        });
      })
      .then(function () {
        console.log("products retrieved. Total Products  = " + productList.length);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

function loadSportsCategoryProducts() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("products")
    .where("Category", "==", "Sports, Fitness, Bags & Luggage")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var product = doc.data();
          console.log(product.Product_Id);
          productList.push(product);

        });
      })
      .then(function () {
        console.log("products retrieved. Total Products  = " + productList.length);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

var sellerProductMap = new Map();
function loadSellerDetails(product) {
  return new Promise((resolve, reject) => {
    var docRef = firebase.firestore().collection("seller").doc(product.seller_id);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        var seller = doc.data();
        sellerProductMap.set(product.Product_Id, seller);
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

function updateMerchantId(product) {

  var washingtonRef = firebase.firestore().collection("products").doc(product.Product_Id);
  var seller = sellerProductMap.get(product.Product_Id);
  washingtonRef.update({
    merchant_id: seller.merchant_id
  })
    .then(function () {
      console.log("updated merchant id for product - " + product.Product_Id);
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.log("doc does not exist");

    });

}

function setQtyDiscounts() {

  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];
    var qd = product.qty_discounts;
    var discountInPercentMap = new Map();
    if (qd != null) {
      // console.log("qd = " + qd);
      for (const property in qd) {
        var propertyName = `${property}`;
        var propertyValue = `${qd[property]}`;
        // console.log("offer price - " + product.Offer_Price);
        // console.log("discount qty = " + propertyName);
        // console.log("discounted value = " + propertyValue);
        var discountedValue = parseInt(propertyValue);

        var discountPercent = ((product.Offer_Price - discountedValue) / product.Offer_Price) * 100;
        discountPercent = discountPercent.toFixed(2);
        // console.log("discount in percent = " + discountPercent);

        discountInPercentMap.set(propertyName, discountPercent);
      }

      var qtyDiscounts = null;

      if (discountInPercentMap.size > 0) {
        qtyDiscounts = new Object();

        for (let [key, value] of discountInPercentMap) {
          qtyDiscounts[key] = parseFloat(value);
        }
      }


      addQtyDiscount(product.Product_Id, qtyDiscounts);

      // console.log("qty discount vlaue = " + qtyDiscounts);

      updateDiscountPercent(product.Product_Id, qtyDiscounts);
    }
  }
}

// qtyDiscounts = null;


function updateDiscountPercent(productid, qtyDiscounts) {
  var washingtonRef = firebase.firestore().collection("products").doc(productid);
  //console.log("qty discount = " + qtyDiscounts);
  washingtonRef.update({
    qty_discount_in_percent: qtyDiscounts
  })
    .then(function () {

      //  console.log(index);
      //console.log(discount_percent_map);

      console.log("updated  for product - " + productid);
    })
    .catch(function (error) {
      // The document probably doesn't exist.

    });

}

function loadAllProducts() {
  loadProducts().then(() => {
    console.log("Total Products = " + productList.length);
    setQtyDiscounts();

    for (var i = 0; i < productList.length; i++) {
      var product = productList[i];
      //console.log("product id = " + product.Product_Id);
      var mapdata = qtyDiscountMap.get(product.Product_Id);
      console.log(mapdata);


      var qtyDiscounts = null;
      if (mapdata != undefined) {
        if (mapdata.size > 0) {
          qtyDiscounts = new Object();

          for (let [key, value] of mapdata) {
            qtyDiscounts[key] = parseFloat(value);
          }
        }
      }

      // console.log("qty discount = " + qtyDiscounts);
      //updateDiscountPercent(product.Product_Id, qtyDiscounts, i);

    }

  })
}


var tagList = [];
var gloablTagList = [];
function loadTags() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("products")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var product = doc.data();
          for (var i = 0; i < product.Tags.length; i++) {
            var tag = product.Tags[i];
            if (!gloablTagList.includes(tag)) {
              tagList.push(tag);
              gloablTagList.push(tag);
              if (tagList.length >= 2000) {
                addTags(tagList.length, 2000);
                tagList = [];
              }
            }
          }

        });
      })
      .then(function () {
        addTags(tagList.length, 2000);
        console.log("Total tags = " + gloablTagList.length);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}


function makeTagsLower() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("products")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var product = doc.data();
         
          for (var i = 0; i < product.Tags.length; i++) {
            var tag = product.Tags[i];
            tag = tag.toLowerCase();
            product.Tags[i] = tag;
            console.log(product.Tags[i]);
          }

          productList.push(product);

        });
      })
      .then(function () {
      
        var promiseList = [];
        for(var i = 0; i < productList.length; i++){
           promiseList.push(updateTagsLowercase(productList[i]));
        }

        Promise.all(promiseList).then(()=>{

          resolve();
          console.log("updated all tags in lower case");

        })
       
      
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

function updateTagsLowercase(product) {

  return new Promise((resolve, reject) =>{

    var washingtonRef = firebase.firestore().collection("products").doc(product.Product_Id);
    //console.log("qty discount = " + qtyDiscounts);
    washingtonRef.update({
      Tags: product.Tags
    })
      .then(function () {
        console.log("updated for product - " + product.Product_Id);
         resolve();
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        reject();
  
      });

  })


}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function addTags(size, limit) {

  var tagId = generateUUID();
  var active = true;
  if (size >= limit) {
    active = false;
  }
  // Add a new document in collection "cities"
  firebase.firestore().collection("product_tags").doc(tagId).set({
    tag_id: tagId,
    active: active,
    tags: tagList
  })
    .then(function () {
      console.log("tags added successfully!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

var orderList = [];
function loadOrders() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("orders")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var order = doc.data();
          orderList.push(order);

        });
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

var ordersProductMap = new Map();
function getProductListAgainstOrders(order) {
  return new Promise((resolve, reject) => {
    var productList = [];
    firebase.firestore().collection("orders").doc(order.order_id).collection("products")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var product = doc.data();
          productList.push(product);
        });
      })
      .then(function () {
        ordersProductMap.set(order.order_id, productList);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

var orderCustomerMap = new Map();
function getUserDetails(order) {

  return new Promise((resolve, reject) => {
    var docRef = firebase.firestore().collection("users").doc(order.customer_id);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        var user = doc.data();
        orderCustomerMap.set(order.order_id, user);
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

var orderAddressMap = new Map();
function getUserAddressDetails(order) {

  var user = orderCustomerMap.get(order.order_id);
  return new Promise((resolve, reject) => {
    var docRef = firebase.firestore().collection("users").doc(order.customer_id).collection("Addresses").doc(user.AddressId);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        var address = doc.data();
        orderAddressMap.set(order.order_id, address);
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

function createInvoicesAgainstOrder()
{

    loadProducts().then(() => {
  var promiseList = [];
  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];
    promiseList.push(loadSellerDetails(product));
  }

  Promise.all(promiseList).then(() => {
    loadOrders().then(() => {
      var promiseList = [];
      for (var i = 0; i < orderList.length; i++) {
        var order = orderList[i];
        promiseList.push(getProductListAgainstOrders(order));
      }

      Promise.all(promiseList).then(() => {
        var promiseList = [];
        for (var i = 0; i < orderList.length; i++) {
          var order = orderList[i];
          promiseList.push(getUserDetails(order));
        }

        Promise.all(promiseList).then(() => {
          var promiseList = [];
          for (var i = 0; i < orderList.length; i++) {
            var order = orderList[i];
            promiseList.push(getUserAddressDetails(order));
          }

          Promise.all(promiseList).then(() => {
            console.log("everything retreived");
            var newPromiseList = [];
            for (var i = 0; i < orderList.length; i++) {
              var order = orderList[i];
              var productList = ordersProductMap.get(order.order_id);
              var seller = sellerProductMap.get(productList[0].Product_Id);
              console.log("getting seller for product id - " + productList[0].Product_Id + " and merchant id - " + seller.merchant_id);

              getNewInvoiceId(seller, order);

            }

          })
        })
      })
    })
  })
})

}
function createInvoice(order, seller, invoiceId) {

  return new Promise((resolve, reject) => {

    console.log("creating invoice for order id - " + order.order_id);
    var address = orderAddressMap.get(order.order_id);
    var user = orderCustomerMap.get(order.order_id);
    var productList = ordersProductMap.get(order.order_id);
    // console.log("productList - " + productList);

    //console.log('seller - ' + seller);

    // Add a new document in collection "cities"
    console.log("seller id = " + seller.merchant_id);
    console.log("new invoice id = " + invoiceId);
    firebase.firestore().collection("online_invoices").doc(invoiceId).set({
      COD: order.COD,
      bill_to_name: user.Name,
      bill_to_address_line1: user.AddressLine1,
      bill_to_address_line2: user.AddressLine2,
      bill_to_address_line3: user.AddressLine3,
      bill_to_city: user.City,
      bill_to_phone: user.Phone,
      bill_to_state: user.State,
      bill_to_landmark: user.Landmark,
      bill_to_pin: user.Pincode,

      ship_to_name: address.Name,
      ship_to_address_line1: address.AddressLine1,
      ship_to_address_line2: address.AddressLine2,
      ship_to_address_line3: address.AddressLine3,
      ship_to_city: address.City,
      ship_to_phone: address.Phone,
      ship_to_state: address.State,
      ship_to_landmark: address.Landmark,
      ship_to_pin: address.Pincode,

      invoice_id: invoiceId,
      order_id: order.order_id,
      order_date: order.order_date,
      COD: order.COD,
      seller_id: order.seller_id,
      seller_name: seller.company_name,
      sellerAddressLine1: seller.address_line1,
      sellerAddressLine2: seller.address_line2,
      sellerAddressLine3: seller.address_line3,
      sellerCity: seller.city,
      sellerState: seller.state,
      sellerCountry: "INDIA",
      sellerPin: seller.pincode,
      sellerPAN: seller.pan_no,
      sellerGST: seller.gstin,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(function () {

        var productList = ordersProductMap.get(order.order_id);
        console.log(productList);
        for (var i = 0; i < productList.length; i++) {
          var product = productList[i];

          firebase.firestore().collection('online_invoices').doc(invoiceId).collection("products").doc(product.Product_Id).set({
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
      .then(function () {
        console.log("tags added successfully!");
        resolve();
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        reject();
      });

  })

}




var sellerInvoiceMap = new Map();
function getNewInvoiceId(seller, order) {
  var invoiceId = sellerInvoiceMap.get(seller.seller_id);
  if (invoiceId == null) {
    invoiceId = seller.merchant_id + "_INV001";
    
  }
  else {
    var tmpInvoice = invoiceId.split('_');
    var tmpInvoiceId = tmpInvoice[1];
    var invoiceNum = parseInt(tmpInvoiceId.substring(3, tmpInvoiceId.length));
    invoiceNum = invoiceNum + 1;
    var newInvoiceNum = appendNumber(invoiceNum, 3);
    invoiceId = seller.merchant_id + "_INV" + newInvoiceNum;
  }

  sellerInvoiceMap.set(seller.seller_id, invoiceId);
  updateOrderInvoiceId(order, invoiceId).then(()=>{
    createInvoice(order, seller, invoiceId);
  })


}

function updateOrderInvoiceId(order, invoiceId) {

  return new Promise((resolve, reject)=>{

    var washingtonRef = firebase.firestore().collection("orders").doc(order.order_id);
    washingtonRef.update({
      invoice_id: invoiceId
    })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.log("doc does not exist");
        reject();
      });
  

  })


}

function appendNumber(number, digits) {
  return String(number).padStart(digits, '0');
}


function loadSellers() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("seller")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var seller = doc.data();
          sellerList.push(seller);

        });
      })
      .then(function () {
        console.log("sellers retrieved. Total sellers  = " + sellerList.length);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

function loadOfflineInvoices() {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection("offline_invoices")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          var invoice = doc.data();
          offline_invoices.push(invoice);

        });
      })
      .then(function () {
        console.log("sellers retrieved. Total sellers  = " + sellerList.length);
        resolve();
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        reject();
      });


  })
}

function updateSellerDetailsInOfflineInvoice(seller, invoiceId){

  console.log("invoice id - " + invoiceId);
  var washingtonRef = firebase.firestore().collection("offline_invoices").doc(invoiceId);
  washingtonRef.update({
    merchant_id: seller.merchant_id,
    company_name: seller.company_name,
    seller_mobile: seller.mobile,
    seller_email: seller.email
  })
    .then(function () {
      console.log("updated merchant id for product - " + product.Product_Id);
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.log("doc does not exist");

    });


}


function updateCategory(productId){

  
  var washingtonRef = firebase.firestore().collection("products").doc(productId);
  washingtonRef.update({
    Category: "Sports, Fitness, Bags And Luggage"
  })
    .then(function () {
      console.log("updated product id for product - " + productId);
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.log("doc does not exist");

    });


}






