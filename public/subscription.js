var card3Months = document.getElementById("card3Months");
var card6Months = document.getElementById("card6Months");
var cardAnnual = document.getElementById("cardAnnual");

var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");

var sellerid = localStorage.getItem("sellerid");
var sellerPhone = localStorage.getItem("sellerPhone");
var sellerEmail = localStorage.getItem("seller_email");
var sellerName = localStorage.getItem("sellerName");

var validTill = null;
var divWaitForConfirmation = document.getElementById("divWaitForConfirmation");




card3Months.addEventListener("mouseenter", function () {
    card3Months.classList.add("cardHover");
});

card3Months.addEventListener("mouseleave", function () {
    card3Months.classList.remove("cardHover");
});


card3Months.addEventListener("click", function () {
    if (confirm("you are going to pay INR 349 for silver subscription.\nDo you wish to continue?")) {

        var amount = 349 * 100;
        createOrder(amount, 1, 'Silver');
    }
})

// 6 months
card6Months.addEventListener("mouseenter", function () {
    card6Months.classList.add("cardHover");
});

card6Months.addEventListener("mouseleave", function () {
    card6Months.classList.remove("cardHover");
});

card6Months.addEventListener("click", function () {
    if (confirm("you are going to pay INR 449 for Gold subscription.\nDo you wish to continue?")) {

        var amount = 449 * 100;
        createOrder(amount, 1, "Gold");
    }
})


// Annual
cardAnnual.addEventListener("mouseenter", function () {
    cardAnnual.classList.add("cardHover");
});

cardAnnual.addEventListener("mouseleave", function () {
    cardAnnual.classList.remove("cardHover");
});

cardAnnual.addEventListener("click", function () {
    if (confirm("you are going to pay INR 549 for diamond subscription.\nDo you wish to continue?")) {

        var amount = 549 * 100;
        createOrder(amount, 1, "Diamond");
    }
})

function createOrder(amount, months, type) {

    divProgress.style.display = "block";
    divContent.style.display = "none";

    var url = '/api/payment/order';
    var params = {
        amount: amount,
        currency: "INR",
        payment_capture: '1'

    };

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function (res) {
        if (xmlHttp.readyState == 4) {
            res = JSON.parse(xmlHttp.responseText);
            var orderId = res.sub.id;
            createPayment(orderId, amount, months, type);
        }
    }
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(params));
}

function createPayment(orderId, amount, months, type) {

   // alert("going to make payment");

    var options = {
        "key": "rzp_live_dANcm3iqiuijPN", // Enter the Key ID generated from the Dashboard
        "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "My Rupeaze",
        "description": "Test Transaction",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
         //   alert(response.razorpay_payment_id);
         divWaitForConfirmation.style.display = "block";
            updateSubscription(response.razorpay_payment_id, amount, months, type);
          //  alert(response.razorpay_order_id);
          //  alert(response.razorpay_signature)

            divProgress.style.display = "none";
           // divContent.style.display = "block";

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
    //e.preventDefault();
}

function updateSubscription(paymentId, amount, months, type) {

   

    var amount = parseFloat(amount) / 100;

    validTill = new Date();
    validTill.setMonth(validTill.getMonth() + months);

    var washingtonRef = firebase.firestore().collection("seller").doc(sellerid);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        subscription_amount: amount,
        subscription_payment_id: paymentId,
        subscription_start_date: firebase.firestore.FieldValue.serverTimestamp(),
        subscription_end_date: validTill,
        subscription_type: type

    })
        .then(function () {
            divContent.style.display = "block";
            divWaitForConfirmation.style.display = "none";
            alert("Subscription successful");
             sendSubscriptionEmail();
             window.location.href = "home.html?sellerid=" + sellerid;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

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


function sendSubscriptionEmail(){

    var ord = validTill;
    var dd = ord.getDate();
    var mm = ord.getMonth() + 1;
    if (dd < 10) {
        dd = '0' + dd;
    }
    var yyyy = ord.getFullYear();
    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;




    var msg = "<h3>Hello " + sellerName + "</h3>"
        + "<p>Greetings from My Rupeaze!!</p>"
        + "<p> This is to inform you that you are subscribed with us till " + formattedDay
       

        + "<p>Keep Selling!!</p>"

        + "<p>With Kind Regards,<br/>"
        + "My Rupeaze Team </p>";

        sendEmail(sellerEmail, "My Rupeaze Subscription Confirmation", msg);


}
