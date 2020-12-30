
var invoice;
var productList = [];


window.onload = function () {


  var invId = getQueryVariable("invoiceid");
  console.log("invoice id = " + invId);
  fetchInvoice(invId).then(() => {
    // console.log("invoice = " + invoice);
    loadInvoice();
  })

}

function loadInvoice() {

  var rupeeSymbol = "₹ ";

  var COD = invoice.COD;
 //var COD = true;
  
  var imgCOD = document.getElementById("imgCOD");
  var imgPrepaid = document.getElementById("imgPrepaid");
  if(COD){
      imgCOD.style.display = "block";
      imgPrepaid.style.display = "none";
      txtAmountInWords.style.display = "block";
  }
  else{
      imgCOD.style.display = "none";
      imgPrepaid.style.display = "block";
      txtAmountInWords.style.display = "none";
      

  }


  var txtOrderId = document.getElementById("txtOrderId");
  var txtSellerName = document.getElementById("sellerName");
  var txtSelleraddressLine1 = document.getElementById("sellerAddressLine1");
  var txtSelleraddressLine2 = document.getElementById("sellerAddressLine2");
  var txtSelleraddressLine3 = document.getElementById("sellerAddressLine3");
  var txtSellerCity = document.getElementById("sellerCity");
  var txtSellerState = document.getElementById("sellerState");
  var txtSellerPin = document.getElementById("sellerpin");



  //ship to details
  var txtshiptoName = document.getElementById("shiptoName");
  var txtshiptoAddressLine1 = document.getElementById("shiptoAddressLine1");
  var txtshiptoAddressLine2 = document.getElementById("shiptoAddressLine2");
  var txtshiptoAddressLine3 = document.getElementById("shiptoAddressLine3");
  var txtshiptoLandmark = document.getElementById("shiptoLandmark");
  var txtshiptoCity = document.getElementById("shiptoCity");
  var txtshiptoState = document.getElementById("shiptoState");
  var txtshiptoPincode = document.getElementById("shiptoPincode");
  var txtshiptoPhone = document.getElementById("shiptoPhone");
  var qrcode = document.getElementById("qrcode");

  var qrcode1 = new QRCode(qrcode, {
    text: invoice.order_id,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});


 //var txtAmountInWords = document.getElementById("txtAmountInWords");


  txtOrderId.textContent = invoice.order_id;
  txtSellerName.textContent = invoice.seller_name;
  txtSelleraddressLine1.textContent = invoice.txtSelleraddressLine1;
  txtSelleraddressLine2.textContent = invoice.sellerAddressLine2;
  txtSelleraddressLine3.textContent = invoice.sellerAddressLine3;
  txtSellerCity.innerHTML = invoice.sellerCity;
  txtSellerState.textContent = invoice.sellerState + " INDIA";
  txtSellerPin.textContent = "Pincode: " + invoice.sellerPin;
  
  txtSellerCity.innerHTML = invoice.sellerCity;
  txtSellerState.textContent = invoice.sellerState + " INDIA";
 

  //setting ship to details
  txtshiptoName.textContent = invoice.ship_to_name;
  txtshiptoAddressLine1.textContent = invoice.ship_to_address_line1;
  txtshiptoAddressLine2.textContent = invoice.ship_to_address_line2;
  txtshiptoAddressLine3.textContent = invoice.ship_to_address_line3;
  txtshiptoCity.textContent = invoice.ship_to_city;
  txtshiptoPhone.innerHTML = "<b>Contact No. </b>" + invoice.ship_to_phone;
  txtshiptoState.textContent = invoice.ship_to_state + " INDIA";
  txtshiptoLandmark.textContent = "Landmark: " + invoice.ship_to_landmark;
  txtshiptoPincode.textContent = "Pincode: " + invoice.ship_to_pin;


  var txtInvoice = document.getElementById("invNum");
  var invId = getQueryVariable("invoiceid");
  txtInvoice.textContent = invId;


  var netPayable = 0;
  for (var i = 0; i < productList.length; i++) {
    var product = productList[i];
    netPayable += product.Offer_Price * product.Qty;
  }

 
  var priceInWords = price_in_words(netPayable);
  txtAmountInWords.innerHTML = "COD Amount Collectable: " + rupeeSymbol + numberWithCommas(netPayable) + "<hr />" + "Amount In Words: " + priceInWords + " rupees";
 

  document.getElementById("download")
    .addEventListener("click", () => {
      var invId = getQueryVariable("invoiceid");
      const invoice = this.document.getElementById("invoice");
      console.log(invoice);
      console.log(window);
      var opt = {
        margin: 1,
        filename: invId + "_shippinglabel.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(invoice).set(opt).save();
    })

}


function fetchInvoice(invoiceId) {

  return new Promise((resolve, reject) => {
    var query = firebase.firestore()
      .collection('online_invoices').doc(invoiceId)

    query.get()
      .then(function (doc) {
        if (doc.exists) {
          invoice = doc.data();
          // resolve();
        }
        else {
          invoice = null;
          reject();
        }
      }).then(function () {

        var query = firebase.firestore()
          .collection('online_invoices').doc(invoiceId).collection("products");

        query.get()
          .then(function (snapshot) {
            snapshot.forEach(function (doc) {
              var product = doc.data();
              console.log("got product - " + product.Title);
              productList.push(product);
            })

            console.log("products retreived. Finally resolving");
            resolve();
          })

      })
  })
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function price_in_words(price) {
  var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
    dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
    tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
    handle_tens = function (dgt, prevDgt) {
      return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
    },
    handle_utlc = function (dgt, nxtDgt, denom) {
      return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
    };

  var str = "",
    digitIdx = 0,
    digit = 0,
    nxtDigit = 0,
    words = [];
  if (price += "", isNaN(parseInt(price))) str = "";
  else if (parseInt(price) > 0 && price.length <= 10) {
    for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
      case 0:
        words.push(handle_utlc(digit, nxtDigit, ""));
        break;
      case 1:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 2:
        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
        break;
      case 3:
        words.push(handle_utlc(digit, nxtDigit, "Thousand"));
        break;
      case 4:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 5:
        words.push(handle_utlc(digit, nxtDigit, "Lakh"));
        break;
      case 6:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 7:
        words.push(handle_utlc(digit, nxtDigit, "Crore"));
        break;
      case 8:
        words.push(handle_tens(digit, price[digitIdx + 1]));
        break;
      case 9:
        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
    }
    str = words.reverse().join("")
  } else str = "";
  return str

}
//window.localStorage.setItem("orderid", order.order_id);
// var orderid = localStorage.getItem("orderid");
// txtOrderId.textContent = "Order Id: " +  orderid;



