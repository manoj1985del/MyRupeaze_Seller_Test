var slideIndex = 0;
var divVideos = document.getElementById("divVideos");
var videoList = [];

var productList = [];
let qtyDiscountMap = new Map();
let qtyDiscountObjectMap = new Map();


//loadAllProducts();
loadTags();
//makeTagsLower();


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
          productList.push(product);

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
              if(tagList.length >= 2000){
                addTags(tagList.length, 2000);
                tagList = [];
              }
            }
          }

        });
      })
      .then(function () {
        addTags(tagList.length, 2000);
        console.log("Total tags = " +  gloablTagList.length);
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
  if(size >= limit){
    active = false;
  }
  // Add a new document in collection "cities"
  firebase.firestore().collection("product_tags").doc(tagId).set({
    tag_id: tagId,
    active : active,
    tags: tagList
  })
    .then(function () {
      console.log("tags added successfully!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}