var imgIcon = document.getElementById("imgIcon");
var divBody = document.getElementById("divBody");
var divUpdateApplication = document.getElementById("divUpdateApplication");
var btnUpdateApplication = document.getElementById("btnUpdateApplication");

var sellerId = getQueryVariable("sellerid");
var merchantId = getQueryVariable("merchant_id");
var sellerName = getQueryVariable("name");
var status = getQueryVariable("status");
var reason = getQueryVariable("rejection_reason");



if(status == "pending"){
    imgIcon.setAttribute('src', "img_pending.jpg");
    //var divData = document.createElement("div");
    var span = document.createElement("span");
    span.innerHTML = getPendingBody();
    divBody.appendChild(span);

    divUpdateApplication.style.display = "block";
}

if(status == "suspended"){
    imgIcon.setAttribute('src', "img_suspended.jpg");
    //var divData = document.createElement("div");
    var span = document.createElement("span");
    span.innerHTML = getSuspensionBody();
    divBody.appendChild(span);

    divUpdateApplication.style.display = "block";
}

if(status == "rejected"){
    imgIcon.setAttribute('src', "img_rejected.jpg");
    //var divData = document.createElement("div");
    var span = document.createElement("span");
    span.innerHTML = getRejectionBody();
    divBody.appendChild(span);

    divUpdateApplication.style.display = "block";
}

function getPendingBody(){
    var msg = 
    "<h3>Hello " + sellerName + " (" + merchantId + ")</h3>" +
    `<p>We have recieved your application. Your status is <b>Pending</b> and your application is under review.
    </p>
    <p>We will notify you via e-mail once your applicatoin is approved or rejected.</p>
    <p>For any assistance please call our toll free number - <b> 1800 212 1484 </b></p>

    <p>With Kind Regards, <br />
        My Rupeaze Team
    </p>`;

    return msg;
}

function getSuspensionBody(){
    var msg = 
    "<h3>Hello " + sellerName + " (" + merchantId + ")</h3>" +
    "<p>Your account has been suspended. Reason of Suspension: <b> " + reason + "</b></p>" + 
    `<p>For resumption of your account or any other assistance please call our toll free number - <b> 1800 212 1484 </b></p>
    <p>With Kind Regards, <br />
        My Rupeaze Team
    </p>`;

    return msg;
}

function getRejectionBody(){
    var msg = 
    "<h3>Hello " + sellerName + " (" + merchantId + ")</h3>" +
    "<p>Your request for joining our platform has been rejected. Reason of Rejection: <b> " + reason + "</b></p>" + 
    `<p>Please correct this information by clicking Update Account at the bottom right of this page.</p>
    <p>Alternatively you may call our toll free number - <b> 1800 212 1484 </b></p>
    <p>With Kind Regards, <br />
        My Rupeaze Team
    </p>`;

    return msg;
}

btnUpdateApplication.addEventListener("click", function(){
    window.location.href = "RegisterUser.html?sellerid=" + sellerId;
})


// window.location.href = "seller_approval.html?sellerid=" + mSeller.seller_id + "&merchant_id=" + mSeller.merchant_id
// + "&name=" + mSeller.company_name + "&status=" + mSeller.status
// +"&rejection_reason" + mSeller.suspension_reason;