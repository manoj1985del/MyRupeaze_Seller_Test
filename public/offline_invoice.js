


var invoice;
var productList = [];
var sellerId = localStorage.getItem("sellerid");
var gstMap = new Map();

window.onload = function () {

  setGSTMap();

  var invId = getQueryVariable("invoiceid");
  console.log("invoice id = " + invId);
  fetchInvoice(invId).then(() => {
   // console.log(invoice);
    loadInvoice();
  })

}

function setGSTMap(){
  gstMap.set("Andhra Pradesh", "37");
  gstMap.set("Andaman and Nicobar Island", "35");
  gstMap.set("Arunachal Pradesh", "12");
  gstMap.set("Assam", "18");
  gstMap.set("Bihar", "10");
  gstMap.set("Chandigarh", "04");
  gstMap.set("Chhattisgarh", "22");
  gstMap.set("Dadar and Nagar Haveli", "26");
  gstMap.set("Daman and Diu", "26");
  gstMap.set("Delhi", "07");
  gstMap.set("Lakshadweep", "31");
  gstMap.set("Puducherry", "34");
  gstMap.set("Goa", "30");
  gstMap.set("Gujarat", "24");
  gstMap.set("Haryana", "06");
  gstMap.set("Himachal Pradesh", "02");
  gstMap.set("Jammu and Kashmir", "01");
  gstMap.set("Jharkhand", "20");
  gstMap.set("Karnataka", "29");
  gstMap.set("Kerala", "32");
  gstMap.set("Madhya Pradesh", "23");
  gstMap.set("Maharashtra", "27");
  gstMap.set("Manipur", "14");
  gstMap.set("Meghalaya", "17");
  gstMap.set("Mizoram", "15");
  gstMap.set("Nagaland", "13");
  gstMap.set("Odisha", "21");
  gstMap.set("Punjab", "03");
  gstMap.set("Rajasthan", "08");
  gstMap.set("Sikkim", "11");
  gstMap.set("Tamil Nadu", "33");
  gstMap.set("Telangana", "36");
  gstMap.set("Tripura", "16");
  gstMap.set("Uttar Pradesh", "09");
  gstMap.set("Uttarakhand", "05");
  gstMap.set("West Bengal", "19");
}


function loadInvoice() {

  var rupeeSymbol = "₹ ";


  var txtSellerName = document.getElementById("sellerName");
  var txtSelleraddressLine1 = document.getElementById("sellerAddressLine1");
  var txtSelleraddressLine2 = document.getElementById("sellerAddressLine2");
  var txtSelleraddressLine3 = document.getElementById("sellerAddressLine3");
  var txtSellerCity = document.getElementById("sellerCity");
  var txtSellerState = document.getElementById("sellerState");
  var txtSellerPAN = document.getElementById("sellerPAN");
  var txtSellerPin = document.getElementById("sellerpin");
  var txtSellerGST = document.getElementById("sellerGST");
  var stateCode = document.getElementById("txtStateCode");



  //ship to details
  var txtshiptoName = document.getElementById("shiptoName");
//   var txtshiptoAddressLine1 = document.getElementById("shiptoAddressLine1");
//   var txtshiptoAddressLine2 = document.getElementById("shiptoAddressLine2");
//   var txtshiptoAddressLine3 = document.getElementById("shiptoAddressLine3");
//   var txtshiptoLandmark = document.getElementById("shiptoLandmark");
//   var txtshiptoCity = document.getElementById("shiptoCity");
//   var txtshiptoState = document.getElementById("shiptoState");
//   var txtshiptoPincode = document.getElementById("shiptoPincode");
  var txtshiptoPhone = document.getElementById("shiptoPhone");
  var txtshiptoEmail = document.getElementById("shiptoEmail");



  //bill to details
  var txtbilltoName = document.getElementById("billtoName");
  var txtbilltoAddressLine1 = document.getElementById("billtoAddressLine1");
  var txtbilltoAddressLine2 = document.getElementById("billtoAddressLine2");
  var txtbilltoAddressLine3 = document.getElementById("billtoAddressLine3");
  var txtbilltoCity = document.getElementById("billtoCity");
  var txtbilltoState = document.getElementById("billtoState");
  var txtbilltoPincode = document.getElementById("billtoPincode");
  var txtbilltoPhone = document.getElementById("billtoPhone");
  var txtbilltoLandmark = document.getElementById("billtoLandmark");
  var txtDate = document.getElementById("txtDate");






  var txtSubTotal = document.getElementById("txtSubtotal");
  var txtIGST = document.getElementById("txtIGST");
  var lblIGST = document.getElementById("lblIGST");
  var txtCGST = document.getElementById("txtCGST");
  var txtSGST = document.getElementById("txtSGST");
  var txtTotalAmount = document.getElementById("txtTotalAmount");

  var txtAmountInWords = document.getElementById("txtAmountInWords");



  txtSellerName.textContent = invoice.seller_name;
  txtSelleraddressLine1.textContent = invoice.sellerAddressLine1;
  txtSelleraddressLine2.textContent = invoice.sellerAddressLine2;
  txtSelleraddressLine3.textContent = invoice.sellerAddressLine3;
  txtSellerCity.innerHTML = invoice.sellerCity;
  txtSellerState.textContent = invoice.sellerState + " INDIA";
  txtSellerPin.textContent = "Pincode: " + invoice.sellerPin;
  txtSellerPAN.innerHTML = "<b>PAN: </b>" + invoice.sellerPAN;
  txtSellerGST.innerHTML = "<b>GSTIN: </b>" + invoice.sellerGST;
  stateCode.textContent = "GST State Code: " +  gstMap.get(invoice.sellerState);

  //setting ship to details
  txtshiptoName.textContent = invoice.bill_to_name;
 
  txtshiptoPhone.innerHTML = "<b>Contact No. </b>" + invoice.bill_to_phone;
  txtshiptoEmail.innerHTML = "<b>Email: </b>" + invoice.bill_to_email;

  var d = new Date();
  d.setDate(d.getDate());

 // console.log(d.getDate());
  var dd = d.getDate();
  var mm = d.getMonth() + 1;
  var yyyy = d.getFullYear();
  if (dd < 10) {
      dd = '0' + dd;
  }

  console.log(dd.toString());

  var day = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
  txtDate.textContent = day;
 


  var txtInvoice = document.getElementById("invNum");
  var invId = getQueryVariable("invoiceid");
  txtInvoice.textContent = invId;

  var table = document.getElementById("tblItems");
  var tbody = document.createElement("tbody");


  var thead = document.createElement("thead");
  var trhead = document.createElement("tr");

  var thProductDescription = document.createElement("th");
  thProductDescription.textContent = "Description";
  trhead.appendChild(thProductDescription);

  var thRate = document.createElement("th");
  thRate.textContent = "Rate";
  trhead.appendChild(thRate);


  var IGST = false;


  var txtSubTotal, txtIGST, txtCGST, txtSGST, txtTotalAmount;
  
  var summaryBody = document.getElementById("summaryBody");
  var trSubTotal = document.createElement("tr");
  var thSubTotal = document.createElement("th");
  thSubTotal.classList.add("text-left");
  thSubTotal.textContent = "Subtotal:";

  var tdSubTotal = document.createElement("td");
  tdSubTotal.classList.add("text-right");
  txtSubTotal = document.createElement("span");
  txtSubTotal.textContent = "111111";
  tdSubTotal.appendChild(txtSubTotal);

  trSubTotal.appendChild(thSubTotal);
  trSubTotal.appendChild(tdSubTotal);
  summaryBody.appendChild(trSubTotal);


  if(IGST){
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.classList.add("text-left");
    th.textContent = "IGST: ";

    var td = document.createElement("td");
    td.classList.add("text-right");
    txtIGST = document.createElement("span");
    txtIGST.textContent = "1234";
    td.appendChild(txtIGST);

    tr.appendChild(th);
    tr.appendChild(td);
    summaryBody.appendChild(tr);
  }
  else{

    //cgst
    var trcgst = document.createElement("tr");
    var thcgst = document.createElement("th");
    thcgst.classList.add("text-left");
    thcgst.textContent = "CGST: ";

    var tdcgst = document.createElement("td");
    tdcgst.classList.add("text-right");
    txtCGST = document.createElement("span");
    txtCGST.textContent = "CCCC";
    tdcgst.appendChild(txtCGST);

    trcgst.appendChild(thcgst);
    trcgst.appendChild(tdcgst);
    summaryBody.appendChild(trcgst);


      //sgst
      var trsgst = document.createElement("tr");
      var thsgst = document.createElement("th");
      thsgst.classList.add("text-left");
      thsgst.textContent = "SGST: ";
  
      var tdsgst = document.createElement("td");
      tdsgst.classList.add("text-right");
      txtSGST = document.createElement("span");
      txtSGST.textContent = "SSSS";
      tdsgst.appendChild(txtSGST);
  
      trsgst.appendChild(thsgst);
      trsgst.appendChild(tdsgst);
      summaryBody.appendChild(trsgst);
  
  }

  var trTotalAmount = document.createElement("tr");
  var thTotalAmount = document.createElement("th");
  thTotalAmount.classList.add("text-left");
  thTotalAmount.textContent = "Total:"
  trTotalAmount.appendChild(thTotalAmount);

  var tdTotalAmount = document.createElement("td");
  tdTotalAmount.classList.add("text-right");
  tdTotalAmount.classList.add("text-primary");
  txtTotalAmount = document.createElement("h5");
  txtTotalAmount.textContent = "5555";
  txtTotalAmount.classList.add("font-weight-semibold");
  tdTotalAmount.appendChild(txtTotalAmount);
  trTotalAmount.appendChild(tdTotalAmount);
  summaryBody.appendChild(trTotalAmount);


  if (IGST) {

    var thIGST = document.createElement("th");
    thIGST.textContent = "IGST";
    trhead.appendChild(thIGST);

  }
  else {
    var thCGST = document.createElement("th");
    thCGST.textContent = "CGST";
    trhead.appendChild(thCGST);

    var thSGST = document.createElement("th");
    thSGST.textContent = "SGST";
    trhead.appendChild(thSGST);

  }

  var thQty = document.createElement("th");
  thQty.textContent = "Qty";
  trhead.appendChild(thQty);

  var thTotal = document.createElement("th");
  thTotal.textContent = "Total";
  trhead.appendChild(thTotal);

  thead.appendChild(trhead);
  table.appendChild(thead);




  var totalBasePrice = 0;
  var totalIGST = 0;
  var totalSGST = 0;
  var totalCGST = 0;
  var netPayable = 0;
  var productList = invoice.product_names;
  var qtyList = invoice.product_qty;
  var priceList = invoice.price_list;
  var gstlist = invoice.gst_list;

  for (var i = 0; i < productList.length; i++) {
    var productName = productList[i];
    var price = priceList[i];
    var gst = gstlist[i];
    var qty = qtyList[i];


    var unitPrice = price;

    var priceWithoutGST = unitPrice - (unitPrice * (gst / 100));
    priceWithoutGST = priceWithoutGST.toFixed(2);
    priceWithoutGST = parseFloat(priceWithoutGST);
    totalBasePrice += (priceWithoutGST * qty);

    var gstAmount = unitPrice - priceWithoutGST;
    gstAmount = gstAmount * qty;
    netPayable += price * qty;

    var tr = document.createElement("tr");

    //set up title
    var tdTitle = document.createElement("td");
    var headingTitle = document.createElement("h6");
    headingTitle.classList.add("mb-0");
    headingTitle.textContent = productName;
    tdTitle.appendChild(headingTitle);

    tr.appendChild(tdTitle);

    //set up rate
    var tdRate = document.createElement("td");
    var rate = document.createElement("span");
    rate.textContent = priceWithoutGST.toString();
    tdRate.appendChild(rate)
    tr.appendChild(tdRate);

    //SETUP GST
    if (IGST) {
      //console.log("removing headers");

      var tdIGST = document.createElement("td");
      var gstSapn = document.createElement("span");
      gstAmount = gstAmount.toFixed(2);
      gstAmount = parseFloat(gstAmount);
      gstSapn.textContent = gstAmount.toString() + " (" + gst.toString() + "%)";
      tdIGST.appendChild(gstSapn);
      tr.appendChild(tdIGST);
      totalIGST += product.GST;
    }
    else {

      var tdCGST = document.createElement("td");
      var csgtSpan = document.createElement("span");
      var cgstAmount = gstAmount / 2;
      cgstAmount = cgstAmount.toFixed(2);
      cgstAmount = parseFloat(cgstAmount);
      var gstPercent = gst / 2;
      csgtSpan.textContent = cgstAmount.toString() + " (" + gstPercent.toString() + "%)";
      tdCGST.appendChild(csgtSpan);
      tr.appendChild(tdCGST);
      totalCGST += cgstAmount;

      var tdSGST = document.createElement("td");
      var sgstSpan = document.createElement("span");
      var sgstAmount = gstAmount / 2;
      sgstAmount = sgstAmount.toFixed(2);
      sgstAmount = parseFloat(sgstAmount);
      var gstPercent = gst / 2;
      sgstSpan.textContent = sgstAmount.toString() + " (" + gstPercent.toString() + "%)";
      tdSGST.appendChild(sgstSpan);
      tr.appendChild(tdSGST);
      totalSGST += sgstAmount;

    }

    //quantity
    var tdQty = document.createElement("td");
    var qtySpan = document.createElement("span");
    qtySpan.textContent = qty.toString();
    tdQty.appendChild(qtySpan);
    tr.appendChild(tdQty);

    //total price
    var tdTotalPrice = document.createElement("td");
    var priceSpan = document.createElement("span");
    priceSpan.textContent = (price * qty).toString();
    tdTotalPrice.appendChild(priceSpan);
    tr.appendChild(tdTotalPrice);

    tbody.appendChild(tr);
    table.appendChild(tbody);

  }

  txtTotalAmount.textContent = rupeeSymbol + numberWithCommas(netPayable);
  txtSubTotal.textContent = rupeeSymbol + numberWithCommas(totalBasePrice);
  if(IGST){
    txtIGST.textContent = rupeeSymbol + numberWithCommas(totalIGST);
  }
  else
  {
    txtCGST.textContent = rupeeSymbol + numberWithCommas(totalCGST);
    txtSGST.textContent = rupeeSymbol + numberWithCommas(totalSGST);
  }

  var priceInWords = price_in_words(netPayable);
  txtAmountInWords.innerHTML = "<em>" + priceInWords + " rupees" + "</em>";
 


  // var txtProductTitle = document.getElementById("productTitle");
  // txtProductTitle.textContent = localStorage.getItem("productTitle");

  // var unitPrice = localStorage.getItem("unitprice");
  // var qty = localStorage.getItem("Qty");
  // var gst = localStorage.getItem("GST");

  // var priceWithoutGST = unitPrice - (unitPrice * (gst / 100));
  // console.log("pricewithoutgst = " + numberWithCommas(priceWithoutGST));

  // var totalPriceWithoutGST = priceWithoutGST * qty;
  // var totalPriceWithGST = unitPrice * qty;

  // var gstAmount = totalPriceWithGST - totalPriceWithoutGST;

  // var txtPrice = document.getElementById('price');
  // var txtQty = document.getElementById('qty');
  // var txtTotal = document.getElementById("total");

  // txtPrice.textContent = rupeeSymbol + numberWithCommas(priceWithoutGST);
  // txtQty.textContent = qty.toString();
  // txtTotal.textContent = rupeeSymbol + numberWithCommas(totalPriceWithoutGST);

  // txtSubTotal.textContent = rupeeSymbol + numberWithCommas(totalPriceWithoutGST);
  // lblIGST.textContent = lblIGST.textContent + " (" + gst.toString() + "%)";
  // txtIGST.textContent = rupeeSymbol + numberWithCommas(gstAmount);
  // // txtCGST.style.display = "none";
  // // txtSGST.style.display = "none";
  // txtTotalAmount.textContent = rupeeSymbol + numberWithCommas(totalPriceWithGST);

  // var priceInWords = price_in_words(totalPriceWithGST);
  // txtAmountInWords.innerHTML = "<em>" + priceInWords + " rupees only" + "</em>";


  document.getElementById("download")
    .addEventListener("click", () => {
      var invId = getQueryVariable("invoiceid");
      const invoice = this.document.getElementById("invoice");
      console.log(invoice);
      console.log(window);
      var opt = {
        margin: 1,
        filename: invId + ".pdf",
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
      .collection('seller').doc(sellerId).collection("invoices").doc(invoiceId);

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
          .collection('invoices').doc(invoiceId).collection("products");

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


function getMonthNmae(index) {
  var monthName;
  switch (index) {
      case 1:
          monthName = "Jan";
          break;

      case 2:
          monthName = "Feb";
          break;

      case 3:
          monthName = "Mar";
          break;

      case 4:
          monthName = "Apr";
          break;

      case 5:
          monthName = "May";
          break;

      case 6:
          monthName = "Jun";
          break;

      case 7:
          monthName = "July";
          break;

      case 8:
          monthName = "Aug";
          break;

      case 9:
          monthName = "Sep";
          break;

      case 10:
          monthName = "Oct";
          break;

      case 11:
          monthName = "Nov";
          break;

      case 12:
          monthName = "Dec";
          break;
  }

  return monthName;
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



