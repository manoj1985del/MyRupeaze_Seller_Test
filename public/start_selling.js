
var imgProduct = document.getElementById("imgProduct");
var txtProductName = document.getElementById("txtProductName");
var txtOnlinePrice = document.getElementById("txtOnlinePrice");
var txtGST = document.getElementById("txtGST");
var txtStockQty = document.getElementById("txtStockQty");
var txtYourPrice = document.getElementById("txtYourPrice");
var btnSubmit = document.getElementById("btnSubmit");

var sellerId = localStorage.getItem("sellerid");
var sellerName = localStorage.getItem("sellerName");

var sellerPhone = localStorage.getItem("sellerPhone");
var sellerAddressLine1 = localStorage.getItem("sellerAddressLine1");
var sellerAddressLine2 = localStorage.getItem("sellerAddressLine2");
var sellerAddressLine3 = localStorage.getItem("sellerAddressLine3");
var sellerCity = localStorage.getItem("sellerCity");
var sellerState = localStorage.getItem("sellerState");
var sellerpin = localStorage.getItem("sellerpin");
var productId = getQueryVariable("productId");


var MRP = getQueryVariable("MRP");
var type = getQueryVariable("type");
var mProduct;

//http://localhost:5000/StartSelling.html?productName=ASIAN%20Shoes%20Wonder-13%20Grey%20Firozi%20Mesh%20Shoes&productId=25771781-6147-476b-8666-9b15df344805&GST=18&ImageUrlCover=https://firebasestorage.googleapis.com/v0/b/my-rupeaze.appspot.com/o/products%2F25771781-6147-476b-8666-9b15df344805%2Fcover.jpg?alt=media&token=156176d9-5294-48a2-9bec-0dd0e4500b1e&Offer_Price=474&MRP=550
var imgUrl;

imgProduct.style.width = "100px";
imgProduct.style.width = "100px";


var alreadySellingProducts = [];

getProduct().then(() => {

    console.log(mProduct);
    // var productName = getQueryVariable("productName");
    txtProductName.value = mProduct.Title;

    // var onlinePrice = getQueryVariable("Offer_Price");
    txtOnlinePrice.value = mProduct.Offer_Price;
    imgUrl = mProduct.ImageUrlCover;
    imgProduct.setAttribute("src", imgUrl);

    txtGST.value = mProduct.GST;
    

    txtStockQty.value = mProduct.stock_qty;
    txtStockQty.disabled = true;

    if(mProduct.selling_offline == true){
        txtYourPrice.value = mProduct.shop_price;
    }
})

// var queryString = "?productName=" + product.Title +
// "&productId=" + product.Product_Id +
// "&GST=" + product.GST+
// "&Offer_Price=" + product.Offer_Price + 
// "&MRP=" + product.MRP;



function validate() {
    var errorFound = false;

}

btnSubmit.addEventListener("click", function () {

    if (txtStockQty.value == "") {
        alert("Please specify stock quantity");
        return;
    }

    if (txtYourPrice.value == "") {
        alert("Please specify your price");
        return;
    }

    updateShopPrice();

    // addProduct();

    // if (type == "add") {
    //     addProduct();

    // }
    // else {
    //     updateProduct();
    // }


})

function updateShopPrice() {

    var washingtonRef = firebase.firestore().collection("products").doc(productId);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        selling_offline: true,
        shop_price: parseFloat(txtYourPrice.value)
    })
        .then(function () {
          //  console.log("Document successfully updated!");
            alert("Details saved successfully");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

}





function getProduct() {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("products").doc(productId);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mProduct = doc.data();
                resolve();
                // console.log("Document data:", doc.data());
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







