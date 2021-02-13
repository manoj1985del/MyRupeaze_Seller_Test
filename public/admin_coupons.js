
var txtCouponCode = document.getElementById('txtCouponCode');
var dtValidThru = document.getElementById('dtValidThru');
var txtPercentOff = document.getElementById('txtPercentOff');
var btnAddCoupon = document.getElementById('btnAddCoupon');
var table = document.getElementById('tblCoupons');
var mErrMsg = "";
var couponList = [];

loadCoupons().then(() => {
    createTable();
})

btnAddCoupon.addEventListener("click", function () {
    bValidateFormDetails();
    if (mErrMsg != "") {
        alert(mErrMsg);
        return;
    }

    var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date(dtValidThru.value));
    saveCouponDetails(txtCouponCode.value.toUpperCase().trim(), myTimestamp);


});

function saveCouponDetails(couponCode, formattedDate) {

    // Add a new document in collection "cities"
    firebase.firestore().collection("coupons").doc(couponCode).set({
        coupon_code: couponCode,
        valid_through: formattedDate,
        percent_off: txtPercentOff.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'Active'
    })
        .then(function () {
            loadCoupons().then(()=>{
                createTable();
            })
            
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}


function bValidateFormDetails() {
    mErrMsg = "";

    if (txtCouponCode.value == "") {
        mErrMsg += "Please Enter Coupon Code\n";
    }

    else {
        if (txtCouponCode.value.length != 6) {
            mErrMsg += "Coupon Code has to be only 6 characters long";
        }
    }


    if (dtValidThru.value == "") {
        mErrMsg += "Please Enter Coupon Validity Last Date\n";
    }


    if (txtPercentOff.value == "") {
        mErrMsg += "Please Enter Percentage Off\n";
    }

    var couponExists = false;
    for (var i = 0; i < couponList.length; i++) {
        var coupon = couponList[i];
        if (txtCouponCode.value.toUpperCase().trim() == coupon.coupon_code.toUpperCase().trim()) {
            couponExists = true;
            break;
        }
    }
    if (couponExists) {
        mErrMsg += "This Coupon Code has already been created.\n";
    }

}

function formatDate(expdate) {


    var dd = expdate.getDate();
    var mm = expdate.getMonth() + 1;
    var year = expdate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + year;

    return formattedDay;

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


function loadCoupons() {
    return new Promise((resolve, reject) => {
        couponList = [];
        firebase.firestore().collection("coupons")
            .orderBy("timestamp", "desc")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var coupon = doc.data();
                    couponList.push(coupon);
                });
            })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                reject();
                console.log("Error getting documents: ", error);
            });
    })



}

function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thCouponCode = document.createElement("th");
    thCouponCode.textContent = "Coupon Code";

    var thValidThru = document.createElement("th");
    thValidThru.textContent = "Valid Through";

    var thPercentOff = document.createElement("th");
    thPercentOff.textContent = "Percent Off";

    var thStatus = document.createElement("th");
    thStatus.textContent = "Status";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thCouponCode);
    tr.appendChild(thValidThru);
    tr.appendChild(thPercentOff);
    tr.appendChild(thStatus);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function createTable() {
    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < couponList.length; i++) {
        var coupon = couponList[i];
        var tr = document.createElement('tr');
        var tdCouponCode = document.createElement('td');
        var tdValidThru = document.createElement('td');
        var tdPercentOff = document.createElement('td');
        var tdStatus = document.createElement('td');
        var tdAction = document.createElement('td');

        var divCouponCode = document.createElement('div');
        var spanCouponCode = document.createElement('span');
        spanCouponCode.innerHTML = coupon.coupon_code;
        divCouponCode.appendChild(spanCouponCode);

        var divValidThru = document.createElement('div');
        var spanValidThru = document.createElement('span');
        var formatted_date = formatDate(coupon.valid_through.toDate());
        spanValidThru.innerHTML = formatted_date;
        divValidThru.appendChild(spanValidThru);

        var divPercentOff = document.createElement('div');
        var spanPercentoff = document.createElement('span');
        spanPercentoff.innerHTML = coupon.percent_off;
        divPercentOff.appendChild(spanPercentoff);

        var divStatus = document.createElement('div');
        var spanStatus = document.createElement('span');

        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);
        today.setSeconds(0);

        var status = coupon.status;
        if (today > coupon.valid_through.toDate()) {
            status = "Expired";
        }
        spanStatus.innerHTML = status;
        divStatus.appendChild(spanStatus);

        var divAction = document.createElement("div");
        var btnDeactivateCoupon = document.createElement("button");
        btnDeactivateCoupon.style.width = "150px";
        btnDeactivateCoupon.textContent = "Deactivate Coupon";
        var id = coupon.coupon_code;
        btnDeactivateCoupon.setAttribute("id", id);
        btnDeactivateCoupon.setAttribute("type", "button");
        divAction.appendChild(btnDeactivateCoupon);


        tdCouponCode.appendChild(divCouponCode);
        tdValidThru.appendChild(divValidThru);
        tdPercentOff.appendChild(divPercentOff);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        tr.appendChild(tdCouponCode);
        tr.appendChild(tdValidThru);
        tr.appendChild(tdPercentOff);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnDeactivateCoupon.addEventListener("click", function () {
            var coupon_code = this.id;
            deActivateCoupon(coupon_code);
        })


    }
}

function deActivateCoupon(couponCode) {
    var washingtonRef = firebase.firestore().collection("coupons").doc(couponCode);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        status: "Disabled"
    })
        .then(function () {
            loadCoupons().then(()=>{
                createTable();
            })
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}