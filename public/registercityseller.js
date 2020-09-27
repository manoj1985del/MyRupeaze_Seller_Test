var shopName = document.getElementById("txtName");
var txtMobile = document.getElementById("txtMobile");
var txtAddressLine1 = document.getElementById("txtAddressLine1");
var txtAddressLine2 = document.getElementById("txtAddressLine2");
var txtAddressLine3 = document.getElementById("txtAddressLine3");
var txtCity = document.getElementById("txtCity");
var txtState = document.getElementById("txtState");
var txtPincode = document.getElementById("txtPincode");
var btnSubmit = document.getElementById("btnSubmit");

var sellerId = localStorage.getItem("sellerid");
btnSubmit.addEventListener("click", registerCitySeller);

var sellerAlreadyRegistered = false;

loadUI();


function loadUI() {

  checkIfSellerExist().then(()=>{
    if(sellerAlreadyRegistered){
      alert("You are already registered as city seller");
      window.location.href = "home.html?sellerid=" + sellerId;
      return;
    }

    shopName.value = localStorage.getItem("sellerName");
  txtMobile.value = localStorage.getItem("sellerPhone");
  txtAddressLine1.value = localStorage.getItem("sellerAddressLine1");
  txtAddressLine2.value = localStorage.getItem("sellerAddressLine2");
  txtAddressLine3.value = localStorage.getItem("sellerAddressLine3");
  txtCity.value = localStorage.getItem("sellerCity");
  txtState.value = localStorage.getItem("sellerState");
  txtPincode.value = localStorage.getItem("sellerpin");

  })

  
}

function checkIfSellerExist() {

  return new Promise((resolve, reject) =>{

    console.log("checking if seller already exist");

    var docRef = firebase.firestore().collection("shops").doc(sellerId);

    docRef.get().then(function (doc) {
      if (doc.exists) {
         sellerAlreadyRegistered = true;
         resolve();
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        sellerAlreadyRegistered = false;
        resolve();
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
      sellerAlreadyRegistered = false;
      resolve();
    });

  })


}

function register(){

  firebase.firestore().collection('shops').doc(sellerId).set({
    seller_id: sellerId,
    Name: shopName.value,
    Phone: txtMobile.value,
    AddressLine1: txtAddressLine1.value,
    AddressLine2: txtAddressLine2.value,
    AddressLine3: txtAddressLine3.value,
    Avg_Rating: 3,
    Pincode: txtPincode.value,
    City: txtCity.value,
    Products: null,
    product_price_map: null,

  }).then(function () {
    alert("Details saved successfully");
    //doc succesfully written. now land him to main page
    window.location.href = "home.html?sellerid=" + sellerId;
  }).catch(function (error) {
    console.error('Error writing new message to database', error);
    return false;
  });

}


function registerCitySeller() {

  register();

}




