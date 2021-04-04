
var errMsg = "";
var divContent = document.getElementById("divContent");
var divProgress = document.getElementById("divProgress");
var percentOfAmountCreditedIntoPoints = 1.25;
var mPointsInONeRupee = 8;

var txtMobile = document.getElementById("txtMobile");
var btnMobile = document.getElementById("btnMobile");
var spCustomerName = document.getElementById("spanCustomerName");
var spCustomerMobile = document.getElementById("spMobile");
var spEmail = document.getElementById("spEmail");
var txtProductName = document.getElementById("txtProductName");
var txtPrice = document.getElementById("txtPrice");
var txtGST = document.getElementById("txtGST");
var txtQty = document.getElementById("txtQty");
var btnAddProduct = document.getElementById("btnAddProduct");
var btnSubmit = document.getElementById("btnSubmit");
var divCustomerDetails = document.getElementById("divCustomerDetails");
var table = document.getElementById("tblProducts");
var imgSaving = document.getElementById("divSaving");
var divOtherDetails = document.getElementById("divOtherDetails");
var chkRedeemPoints = document.getElementById("chkRedeemPoints");
var lblRedeemPoints = document.getElementById("lblRedeemPoints");
var spPoints = document.getElementById("spPoints");
var lblNetPayable = document.getElementById("lblNetPayable");
var customerExist = false;
var sellerId = localStorage.getItem("sellerid");
var newInvoiceId;
var points = 0;
var earnedPoints = 0;
console.log("sellerid -" + sellerId);
var customerId;
var mSeller;
var mAmountAgainstPoints = 0;
var mNetPayable = 0;
var mRedeemPoints = false;
var mPointsUsedForPurchase = 0;
var mTotalValueOfProducts = 0;





var productNames = [];
var priceList = [];
var gstlist = [];
var qtyList = [];
var statusList = [];


table.style.display = "none";
divCustomerDetails.style.display = "none";
var customer = null;

var productList = [];

class Products {
    constructor(productName, gst, price, qty, points) {
        this.productName = productName;
        this.gst = gst;
        this.price = price;
        this.qty = qty;
        this.points = points;
    }
}

getSellerDetails();


chkRedeemPoints.addEventListener("change", function(){
    if(chkRedeemPoints.checked){
        mRedeemPoints = true;
    }
    else{
        mRedeemPoints = false;
    }

    createTable();
});

btnMobile.addEventListener("click", function () {
    console.log("goint to set display as block");
    imgSaving.style.display = "block";
    customer = null;
    spCustomerName.textContent = "";
    spCustomerMobile.timestamp = "";
    spEmail.textContent = "";
    spPoints.textContent = "";
    customerExist = false;
    customer = null;
    spCustomerName.textContent = "";
    spCustomerMobile.timestamp = "";
    spEmail.textContent = "";
    spPoints.textContent = "";
    customerExist = false;
    
    getCustomerDetails(txtMobile.value).then(() => {
        if (customer != null) {
            customerExist = true;
            divCustomerDetails.style.display = "block";
            customerId = customer.customer_id;
            spCustomerName.textContent = customer.Name;
            spCustomerMobile.textContent = "Contact No. " + customer.Phone;
            spEmail.textContent = "Email - " + customer.Email;
            spPoints.textContent = "Points Balance - " + customer.points;
            imgSaving.style.display = "none";
            divOtherDetails.style.display = "block";
            spCustomerMobile.style.display = "block";
            spEmail.style.display = "block";
            spCustomerMobile.style.color = "black";
            spPoints.style.display = "block";
            earnedPoints = customer.points;
            mAmountAgainstPoints = Math.floor(earnedPoints / mPointsInONeRupee);
            lblRedeemPoints.textContent += " ( " + rupeeSymbol + mAmountAgainstPoints.toString() + ")";
        }
        else {
            customerExist = false;
            divCustomerDetails.style.display = "block";
            spCustomerName.textContent = "No Customer Found";
            spCustomerName.style.color = "red";

            spCustomerMobile.style.display = "none";
            spEmail.style.display = "none";
            imgSaving.style.display = "none";
            spPoints.style.display = "none";
        }
    })
});


function validateDetails(){
    errMsg = "";
    if(txtProductName.value == ""){
        errMsg += "Please enter product name\n";
    }

    if(txtPrice.value == ""){
        errMsg += "Please enter Price\n";
    }

    if(txtQty.value == ""){
        errMsg += "Please enter quantity\n";
    }

    if(txtGST.value == ""){
        errMsg += "Please enter GST\n";
    }
}

btnAddProduct.addEventListener("click", function () {

    validateDetails();
    if(errMsg != ""){
        alert(errMsg);
        return;
    }
    table.style.display = "block";
    var price = parseInt(txtPrice.value) * parseInt(txtQty.value);
    var priceTwoAndHalfPercent = (price * percentOfAmountCreditedIntoPoints) / 100;
    //8 points make one rupee
    var points = Math.floor(priceTwoAndHalfPercent * 8);
    // var factor = price / 100;
    // //for every 100 rs spent 20 points will be earned
    // var points = factor * 20;
    // points = Math.floor( points );

    var product = new Products(txtProductName.value, txtGST.value, txtPrice.value, txtQty.value, points);
    productList.push(product);

    createTable();
    


})

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function createTable(){

    deleteTableRows();
    createTableHeaders();
    mNetPayable = 0;

    for(var i = 0; i < productList.length; i++){
        var product = productList[i];

        if(!mRedeemPoints){
            var price = parseInt(product.price) * parseInt(product.qty);
            var priceTwoAndHalfPercent = (price * percentOfAmountCreditedIntoPoints) / 100;
            //8 points make one rupee
            var points = Math.floor(priceTwoAndHalfPercent * 8);
            product.points = points;
        }
        else{
            product.points = 0;
        }

        var tr = document.createElement("tr");
        var trId = "tr" + (productList.length - 1).toString();
        tr.setAttribute("id", trId);
        var tdProductName = document.createElement("td");
        var tdPrice = document.createElement("td");
        var tdGST = document.createElement("td");
        var tdQty = document.createElement("td");
        var tdTotalPrice = document.createElement("td");
        var tdPoints = document.createElement("td");
        var tdAction = document.createElement("td");
    
        var divProductName = document.createElement("div");
        var productNameSpan = document.createElement("span");
        productNameSpan.textContent = product.productName;
        divProductName.appendChild(productNameSpan);
    
        var divGST = document.createElement("div");
        var gstSapn = document.createElement("span");
        gstSapn.textContent = product.gst;
        divGST.appendChild(gstSapn);
    
        var divPrice = document.createElement("div");
        var productPriceSpan = document.createElement("span");
        productPriceSpan.textContent = product.price;
        divPrice.appendChild(productPriceSpan);
    
        var divQty = document.createElement("div");
        var qtySpan = document.createElement("span");
        qtySpan.textContent = product.qty.toString();
        divQty.appendChild(qtySpan);
    
    
        var divFinalPrice = document.createElement("div");
        var finalPriceSpan = document.createElement("span");
        var finalPrice = product.qty * product.price;
        mNetPayable += finalPrice;
        calculateNetPayable();
        finalPriceSpan.textContent = finalPrice;
        divFinalPrice.appendChild(finalPriceSpan);
    
        var divPoints = document.createElement("div");
        var pontsSpan = document.createElement("span");
        pontsSpan.textContent = product.points;
        divPoints.appendChild(pontsSpan);
    
    
    
        var divAction = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.textContent = "Delete Product";
        var id = (productList.length - 1).toString();
        btnDelete.setAttribute("id", id);
        divAction.appendChild(btnDelete);
    
        tdProductName.appendChild(divProductName);
        tdPrice.appendChild(divPrice);
        tdGST.appendChild(divGST);
        tdQty.appendChild(divQty);
        tdTotalPrice.appendChild(divFinalPrice);
        tdPoints.appendChild(divPoints);
        tdAction.appendChild(divAction);
    
        tr.appendChild(tdProductName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdGST);
    
        tr.appendChild(tdQty);
        tr.appendChild(tdTotalPrice);
        tr.appendChild(tdPoints);
        tr.appendChild(tdAction);
    
    
        table.appendChild(tr);
    
    
        console.log(productList);
    
        txtProductName.value = "";
        txtPrice.value = "";
        txtGST.value = "";
        txtQty.value = "";
        txtProductName.focus();
    
        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            var rowid = "tr" + this.id.toString();
            var tr = document.getElementById(rowid);
            table.removeChild(tr);
    
            productList.splice(index, 1);
            console.log(productList);
    
            if (productList.length == 0) {
                table.style.display = "none";
            }

            calculateNetPayable();
        })
    }
}

function calculateNetPayable(){
    mNetPayable = 0;
    mTotalValueOfProducts = 0;
    for(var i = 0; i < productList.length; i++){
        var product = productList[i];
        mNetPayable += product.price * product.qty;
        mTotalValueOfProducts = mNetPayable;
    }

    if(mRedeemPoints){
        if(mNetPayable <= mAmountAgainstPoints){
            mNetPayable = 0;
        }
        else{
            mNetPayable = mNetPayable - mAmountAgainstPoints;
        }
      
    }

    lblNetPayable.innerHTML = "<b>Net Payable: </b>" + rupeeSymbol +  mNetPayable; 
}




function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thProductName = document.createElement("th");
    thProductName.textContent = "Product Name";

    var thPrice = document.createElement("th");
    thPrice.textContent = "Price";

    var thGST = document.createElement("th");
    thGST.textContent = "GST";

    var thQty = document.createElement("th");
    thQty.textContent = "Quantity";

    var thTotalPrice = document.createElement("th");
    thTotalPrice.textContent = "Total Price";

    var thPointsEarned = document.createElement("th");
    thPointsEarned.textContent = "Points Earned";


    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thProductName);
    tr.appendChild(thPrice);
    tr.appendChild(thGST);
    tr.appendChild(thQty);
    tr.appendChild(thTotalPrice);
    tr.appendChild(thPointsEarned);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}


btnSubmit.addEventListener("click", function () {

   

    if (!customerExist) {
        alert("Customer not selected");
        txtMobile.focus();
        return;
    }

    if (productList.length == 0) {
        alert("Please add at least one product to proceed");
        txtProductName.focus();
        return;
    }

    divProgress.style.display = "block";
    divContent.style.display = "none";

    

    if(!mRedeemPoints)
    {
        mAmountAgainstPoints = 0;
        creditPoints().then(()=>{
            addProductsToDb();
        })
    }
    else{

       
        var pointsBalance = 0;
        if(mAmountAgainstPoints <= mTotalValueOfProducts){
            pointsBalance = 0;
            mPointsUsedForPurchase = customer.points;
        }
        else{
            mAmountAgainstPoints = mTotalValueOfProducts;
            var pointsUsedForPuchase = mTotalValueOfProducts * mPointsInONeRupee;
            mPointsUsedForPurchase = pointsUsedForPuchase;
            pointsBalance = customer.points - pointsUsedForPuchase;
        }

        adjustPoints(pointsBalance).then(()=>{
           addProductsToDb(); 
        })
       
    }
})

function addProductsToDb() {
    getNewInvoiceId().then(() => {
        createInvoice(newInvoiceId).then(() => {
            window.location.href = "offline_invoice.html?invoiceid=" + newInvoiceId;
        })
    })
}

function createInvoice(invoiceId) {

    return new Promise((resolve, reject) => {

        for (var i = 0; i < productList.length; i++) {
            var product = productList[i];
            productNames.push(product.productName);
            gstlist.push(parseInt(product.gst));
            priceList.push(parseInt(product.price));
            qtyList.push(parseInt(product.qty));
            statusList.push("success");
        }

        firebase.firestore().collection('offline_invoices').doc(newInvoiceId).set({
            invoice_id: newInvoiceId,
            customer_id:customerId,
            seller_id: sellerId,
            points_redeemed: mRedeemPoints,
            seller_name: mSeller.seller_name,
            sellerAddressLine1: mSeller.address_line1,
            sellerAddressLine2: mSeller.address_line2,
            sellerAddressLine3: mSeller.address_line3,
            sellerCity: mSeller.city,
            sellerState: mSeller.state,
            sellerCountry: "INDIA",
            sellerPin: mSeller.pincode,
            sellerPAN: mSeller.pan_no,
            sellerGST: mSeller.gstin,
            seller_mobile: mSeller.mobile,
            seller_email: mSeller.email,
            merchant_id: mSeller.merchant_id,
            company_name: mSeller.company_name,
            bill_to_name: customer.Name,
            bill_to_phone: customer.Phone,
            bill_to_email: customer.Email,
            product_names: productNames,
            product_qty: qtyList,
            gst_list: gstlist,
            price_list: priceList,
            status_list: statusList,
            amount_against_points: mAmountAgainstPoints,
            points_used_for_purchase: mPointsUsedForPurchase,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                console.error('Error writing new message to database', error);
                reject();
                return false;
            });
    });
}

function getNewInvoiceId() {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection('offline_invoices')
        .where("seller_id", '==', mSeller.seller_id)
        .orderBy("timestamp", "desc").limit(1)
        .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("invoice found");
                    var invoice = doc.data();
                    var invoiceId = invoice.invoice_id;
                    var tmpInvoice = invoiceId.split('_');
                    var tmpInvoiceId = tmpInvoice[1];
                    var invoiceNum = parseInt(tmpInvoiceId.substring(3, tmpInvoiceId.length));
                    invoiceNum = invoiceNum + 1;
                    var newInvoiceNum = appendNumber(invoiceNum, 3);
                    newInvoiceId = mSeller.merchant_id +  "_INS" + newInvoiceNum;
                    resolve();


                });
            })
            .then(function () {
                console.log("no invoice found");
                if (newInvoiceId == null) {
                    newInvoiceId = mSeller.merchant_id +  "_INS001";
                    resolve();
                }
            })
            .catch(function (error) {
                console.log(error);
                newInvoiceId = mSeller.merchant_id +  "_INS001";
                resolve();
            });


    })

}

function creditPoints() {

    return new Promise((resolve, reject)=>{

        var pointsToAdd = 0;
        for (var i = 0; i < productList.length; i++) {
            pointsToAdd += productList[i].points;
        }
      //  points += earnedPoints;
    
        var docRef = firebase.firestore().collection("users").doc(customerId);
    
        // Set the "capital" field of the city 'DC'
        return docRef.update({
            points: firebase.firestore.FieldValue.increment(pointsToAdd)
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                resolve();
            });

    })
}


function adjustPoints(newPoints) {

    return new Promise((resolve, reject)=>{
        var docRef = firebase.firestore().collection("users").doc(customerId);
    
        // Set the "capital" field of the city 'DC'
        return docRef.update({
            points: newPoints
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                resolve();
            });

    })
}



function appendNumber(number, digits) {
    return String(number).padStart(digits, '0');
}



function getCustomerDetails(mobile) {

    return new Promise((resolve, reject) => {

        var query = firebase.firestore()
            .collection('users')
            .where("Phone", "==", mobile);


        query.get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) {
                    customer = doc.data();
                })
            }).then(() => {
                resolve();

            })

    })
}

function getSellerDetails() {


    return new Promise((resolve, reject)=>{

        var docRef = firebase.firestore().collection("seller").doc(sellerId);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mSeller = doc.data();
                resolve();
            } else {
                mSeller = null;
                // doc.data() will be undefined in this case
                console.log("No such document!");
                resolve();
    
            }
        }).catch(function (error) {
            mSeller = null;
            console.log("Error getting document:", error);
            reject();
        });
    

    })




}