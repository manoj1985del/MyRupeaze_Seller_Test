var btnGetOrderId = document.getElementById("btnGetOrderId");
var txtOrderId = document.getElementById("txtOrderId");
var btnSendEmail = document.getElementById("btnSendEmail");

var sellerPhone = localStorage.getItem("sellerPhone");
var sellerEmail = localStorage.getItem("seller_email");
var sellerName = localStorage.getItem("sellerName");

var btnPay = document.getElementById("rzp");
btnPay.addEventListener("click", function(){

    alert("clicked");


    var options = {
        "key": "rzp_live_dANcm3iqiuijPN", // Enter the Key ID generated from the Dashboard
        "amount": "100", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "My Rupeaze",
        "description": "Test Transaction",
        "order_id": txtOrderId.value, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": "Manoj Kumar",
            "email": "manoj1985del@gmail.com",
            "contact": "9971930997"
        },
        "theme": {
            "color": "#F37254"
        }
    };
    var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
})





btnSendEmail.addEventListener("click", function(){
    var xmlHttp = new XMLHttpRequest();

    var name = "Manoj Kumar";
    var body = "<h3>Hello Manoj Kumar,</h3>"
    +"<p>Greetings from My Rupeaze!!</p>"
    +"<p> This is to inform you that we have initiated a refund of INR 400" 
    + ", against order id - <b>Test Order Id</b> for below products <br/>"
    + "Test Product Names" + "</p>"

    +"<p>This amount will be credited to your bank account within 5-7 working days." 
     + "In case of any questions please feel free to revert us back. </p>"

     +"<p>Keep shopping with us!!</p>"

     +"<p>With Kind Regards,<br/>"
     + "My Rupeaze Team </p>";

    var url = '/sendMail/manoj1985del@gmail.com/Test/';

    xmlHttp.onreadystatechange = function(res){
        if(xmlHttp.readyState == 4){
            alert(res);
            console.log(res); 
        }
    }

    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", 'text/html; charset="UTF-8"'); 
    xmlHttp.send(body);
   // xmlHttp.send();


})

btnGetOrderId.addEventListener("click", function(){

    var url = '/api/payment/order';
    var params = {
        amount: 100,
        currency: "INR",
        payment_capture: '1'
        
    };

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function(res){
        if(xmlHttp.readyState == 4){
            alert("parsing resonse");
            console.log("response text = " + xmlHttp.responseText);
            res = JSON.parse(xmlHttp.responseText);
            txtOrderId.value = res.sub.id;
            createPayment(txtOrderId.value, "100");
        }
    }

    alert("making request");
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json"); 
    xmlHttp.send(JSON.stringify(params));
})

function createPayment(orderId, amount){

    alert("going to make payment");

    var options = {
        "key": "rzp_live_dANcm3iqiuijPN", // Enter the Key ID generated from the Dashboard
        "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "My Rupeaze",
        "description": "Test Transaction",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": sellerName,
            "email": sellerEmail,
            "contact": sellerPhone
        },
        "theme": {
            "color": "#F37254"
        }
    };
    var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
}