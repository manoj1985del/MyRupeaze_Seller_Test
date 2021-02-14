
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var table = document.getElementById("tbl");


var sellerId = localStorage.getItem("sellerid");
var mSeller;
var enquiryList = [];

alert(sellerId);

getEnquiries().then(()=>{
    divProgress.style.display = "none";
    divContent.style.display = "block";
    console.log(enquiryList);

    createTable();
})


function getEnquiries(){

    return new Promise((resolve, reject)=>{

        firebase.firestore().collection("offline_requests")
        .where("seller_id", "==", sellerId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                var enquery = doc.data();
                enquiryList.push(enquery);
            });
        })
        .then(()=>{
    
            resolve();
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
            reject();
        });

    })
   

}


function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thDate = document.createElement("th");
    thDate.textContent = "Date";

    var thCustomer = document.createElement("th");
    thCustomer.textContent = "Customer Details";

    var thSeller = document.createElement("th");
    thSeller.textContent = "Seller Details";

    var thProdcutDetails = document.createElement("th");
    thProdcutDetails.textContent = "Products";


    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thDate);
    tr.appendChild(thCustomer);
    tr.appendChild(thSeller);
    tr.appendChild(thProdcutDetails);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}
function createTable() {

    createTableHeaders();

    table.style.display = "block";

    // var product = new Products(txtProductName.value, txtGST.value, txtPrice.value, txtQty.value);


    for (var i = 0; i < enquiryList.length; i++) {

        var enquiry = enquiryList[i];


        var tr = document.createElement("tr");
        var tdOrderDate = document.createElement('td');
        var tdCustomerDetails = document.createElement('td');
        var tdSellerDetails = document.createElement('td');
        var tdProductDetails = document.createElement('td');
        var tdAction = document.createElement('td');


        //Order Date
        var divOrderDate = document.createElement('div');
        var orderDate = document.createElement("span");
        var ord = enquiry.timestamp.toDate();
        var dd = ord.getDate();
        var mm = ord.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        var yyyy = ord.getFullYear();
        var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
        orderDate.textContent = formattedDay;
        divOrderDate.appendChild(orderDate);
        tdOrderDate.appendChild(divOrderDate);

        //Customer Details
        var divCustomerDetails = document.createElement('div');
        var spanCustomerDetails = document.createElement('span');
        spanCustomerDetails.innerHTML = enquiry.customer_name + "<br />Phone No. " + enquiry.customer_phone
                                        + "<br />" + enquiry.customer_address_line1 + "<br />" + enquiry.customer_address_line2 + "<br/>" + enquiry.customer_address_line3
                                        + "<br />" + enquiry.customer_city + " - (" + enquiry.customer_state + ")" + "<br />"
                                        + "Pincode: " + enquiry.customer_pin;

        divCustomerDetails.appendChild(spanCustomerDetails);
        tdCustomerDetails.appendChild(divCustomerDetails);

        //Seller Details
        var divSellerDetails = document.createElement('div');
        var spanSellerDetails = document.createElement('span');
        spanSellerDetails.innerHTML = enquiry.company_name + "<br />Phone No. " + enquiry.seller_phone
                                        + "<br />" + enquiry.seller_address_line1 + "<br />" + enquiry.seller_address_line2 + "<br/>" + enquiry.seller_address_line3
                                        + "<br />" + enquiry.seller_city + " - (" + enquiry.seller_state + ")" + "<br />"
                                        + "Pincode: " + enquiry.seller_pin;
        
        divSellerDetails.appendChild(spanSellerDetails);
        tdSellerDetails.appendChild(divSellerDetails);

        //Product Details
        var divProductDetails = document.createElement('div');
        var spanProductDetails = document.createElement('span');

        var arrProducts = enquiry.product_names;
        var arrQty = enquiry.product_qty;

        for(var idx = 0; idx < arrProducts.length; idx++){
            var productName = arrProducts[idx];
            var qty = arrQty[idx];

            spanProductDetails.innerHTML += productName + " (" + qty + ")<br/>"
        }

        divProductDetails.appendChild(spanProductDetails);
        tdProductDetails.appendChild(divProductDetails);

        var divAction = document.createElement('div');
        var btnAcceptEnquiry = document.createElement("button");
        btnAcceptEnquiry.style.width = "150px";
        btnAcceptEnquiry.textContent = "Accept Enquiry";
        btnAcceptEnquiry.setAttribute("id", enquiry.doc_id);
        btnAcceptEnquiry.setAttribute("type", "button");
        divAction.appendChild(btnAcceptEnquiry);
        tdAction.appendChild(divAction);

        tr.appendChild(tdOrderDate);
        tr.appendChild(tdCustomerDetails);
        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdProductDetails);
        tr.appendChild(tdAction);

        table.appendChild(tr);




      

       

    
    }
    //productList.push(product);
}

// function getSellerDetails() {
//     return new Promise((resolve, reject)=>{
//         var docRef = firebase.firestore().collection("seller").doc(sellerId);
//         docRef.get().then(function (doc) {
//             if (doc.exists) {
//                 mSeller = doc.data();
//                 resolve();
//             } else {
//                 mSeller = null;
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//                 reject();
    
//             }
//         }).catch(function (error) {
//             seller = null;
//             console.log("Error getting document:", error);
//             reject();
//         });

//     })
   
// }

