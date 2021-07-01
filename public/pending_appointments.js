var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var table = document.getElementById("tblData");
var rupeeSymbol = "₹ ";

var sellerId = localStorage.getItem("sellerid");
var mSeller;
var consultationList = [];
var mCustomer = null;
var newInvoiceId = null;
var mSeller = null;
var mRedeemPoints = 0;

var todayDate;


var sellerType = getQueryVariable("sellerType");
var mType = getQueryVariable("type");
var admin = false;
if (sellerType == "admin") {
    admin = true;
}

getSellerDetails();
getEnquiries();

function getEnquiries() {

    var query;

    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var month = getMonthNmae(mm);
    var yyyy = d.getFullYear().toString();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var yy = yyyy.slice(-2);
    todayDate = dd + '-' + month + '-' + yy;

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    today.setSeconds(0);

    if (!admin) {

        if (mType == "pending") {
            query = firebase.firestore().collection("consultations")
                .where("status", "==", "pending")
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "completed") {
            query = firebase.firestore().collection("consultations")
                .where("status", "==", "completed")
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');


        }

        if (mType == "today") {
            query = firebase.firestore()
                .collection('consultations')
                .where("seller_id", "==", sellerId)
                .where("consultation_date", "==", todayDate)
        }

        if (mType == "receivedToday") {
            query = firebase.firestore()
                .collection('consultations')
                .where("seller_id", "==", sellerId)
                .where("timestamp", ">=", today)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "approved") {
            query = firebase.firestore()
                .collection('consultations')
                .where("seller_id", "==", sellerId)
                .where("status", "==", "approved")
                .orderBy('timestamp', 'desc');
        }

        if (mType == "unsettled") {
            alert(sellerId);
            query = firebase.firestore()
                .collection('consultations')
                .where("status", "==", "completed")
                .where("seller_id", "==", sellerId)
                .where("settlement_done", "==", false)
                .orderBy('timestamp', 'desc');
        }


        if (mType == "all") {
            query = firebase.firestore().collection("consultations")
                .where("seller_id", "==", sellerId)
                .orderBy('timestamp', 'desc');
        }


    }
    else {

        if (mType == "pending") {
            query = firebase.firestore().collection("consultations")
                .where("status", "==", "pending")
                .orderBy('timestamp', 'desc');

        }

        if (mType == "completed") {
            query = firebase.firestore().collection("consultations")
                .where("status", "==", "completed")
                .orderBy('timestamp', 'desc');

        }

        if (mType == "today") {
            query = firebase.firestore()
                .collection('consultations')
                .where("consultation_date", "==", todayDate)
        }

        if (mType == "receivedToday") {
            query = firebase.firestore()
                .collection('consultations')
                .where("timestamp", ">=", today)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "approved") {
            query = firebase.firestore()
                .collection('consultations')
                .where("status", "==", "approved")
                .orderBy('timestamp', 'desc');
        }

        if (mType == "unsettled") {
            query = firebase.firestore()
                .collection('consultations')
                .where("status", "==", "completed")
                .where("settlement_done", "==", false)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "pending_refund") {
            query = firebase.firestore()
                .collection('consultations')
                .where("cancelled", "==", true)
                .where("refund_issued", "==", false)
                .orderBy('timestamp', 'desc');
        }

        if (mType == "all") {
            query = firebase.firestore().collection("consultations")
                .orderBy('timestamp', 'desc');

        }


    }

    loadEnquiry(query).then(() => {

        divProgress.style.display = "none";
        divContent.style.display = "block";
        console.log(consultationList);

        createTable();
        //createTableHeaders();

    })
}

function loadEnquiry(query) {

    return new Promise((resolve, reject) => {

        query
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    var enquery = doc.data();
                    consultationList.push(enquery);
                });
            })
            .then(() => {

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

    var thConsultationId = document.createElement("th");
    thConsultationId.textContent = "Consultation ID";

    var thPatient = document.createElement("th");
    thPatient.textContent = "Patient Details";

    var thDoctor = document.createElement("th");
    thDoctor.textContent = "Doctor Details";

    var thDate = document.createElement("th");
    thDate.textContent = "Booking Date";


    var thConsultationSlot = document.createElement("th");
    thConsultationSlot.textContent = "Consultation Date/Slot";

    var thStatus = document.createElement("th");
    thStatus.textContent = "Status";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thConsultationId);
    tr.appendChild(thPatient);
    tr.appendChild(thDoctor);
    tr.appendChild(thDate);
    tr.appendChild(thConsultationSlot);
    tr.appendChild(thStatus);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {

    createTableHeaders();

    // table.style.display = "block";

    // var product = new Products(txtProductName.value, txtGST.value, txtPrice.value, txtQty.value);


    for (var i = 0; i < consultationList.length; i++) {

        var consultation = consultationList[i];


        var tr = document.createElement("tr");
        var tdConsultationId = document.createElement('td');
        var tdPatientDetails = document.createElement('td');
        var tdDoctorDetails = document.createElement('td');
        var tdDate = document.createElement('td');
        var tdConsultationSlot = document.createElement('td');
        var tdStatus = document.createElement('td');
        var tdAction = document.createElement('td');


        //Consultation ID
        var divConsultationID = document.createElement('div');
        var spanConsultation = document.createElement('span');
        spanConsultation.textContent = consultation.consultation_id;
        divConsultationID.appendChild(spanConsultation);
        tdConsultationId.appendChild(divConsultationID);

        //Patient Details
        var divPatientDetails = document.createElement('div');
        var spanPatientDetails = document.createElement('span');
        spanPatientDetails.innerHTML = consultation.customer_name + "<br />Phone No. " + consultation.customer_phone
            + "<br />" + consultation.customer_address_line_1 + "<br />" + consultation.customer_address_line_2 + "<br/>" + consultation.customer_address_line_3
            + "<br />" + consultation.customer_city + " - (" + consultation.customer_state + ")" + "<br />"
            + "Pincode: " + consultation.customer_pincode;

        divPatientDetails.appendChild(spanPatientDetails);
        tdPatientDetails.appendChild(divPatientDetails);

        //Order Date
        var divDate = document.createElement('div');
        var date = document.createElement("span");
        var consultationDate = consultation.timestamp.toDate();
        var dd = consultationDate.getDate();
        var mm = consultationDate.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        var yyyy = consultationDate.getFullYear();
        var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;
        date.textContent = formattedDay;
        divDate.appendChild(date);
        tdDate.appendChild(divDate);


        //Doctor Details
        var divDoctorDetails = document.createElement('div');
        var spanDoctorDetails = document.createElement('span');
        spanDoctorDetails.innerHTML = consultation.seller_name + "<br />Phone No. " + mSeller.mobile
            + "<br />" + mSeller.address_line1 + "<br />" + mSeller.address_line2 + "<br/>" + mSeller.address_line3
            + "<br />" + mSeller.city + " - (" + mSeller.state + ")" + "<br />"
            + "Pincode: " + mSeller.pincode;

        divDoctorDetails.appendChild(spanDoctorDetails);
        tdDoctorDetails.appendChild(divDoctorDetails);

        // Consultation Slot
        var divTimeSlot = document.createElement('div');
        var spanTimeSlot = document.createElement('span');
        spanTimeSlot.innerHTML = "<b>Consultation Date:</b> " + consultation.consultation_date + "<br /><b>Slot: </b>" + consultation.slot;
        //  spanTimeSlot.textContent = consultation.slot;
        divTimeSlot.appendChild(spanTimeSlot);
        tdConsultationSlot.appendChild(divTimeSlot);


        // Status
        var divStatus = document.createElement('div');
        var divStatus1 = document.createElement('div');
        var spanStatus = document.createElement('span');
        var divRefund = document.createElement('div');
        var spanRefund = document.createElement("span");
        spanStatus.innerHTML = consultation.status;
        if(consultation.refund_issued){
         
            spanRefund.marginTop = "10px";
            spanRefund.style.color = "#ff0000";
            spanRefund.innerHTML += "Refund Issued";
        }
        divStatus1.appendChild(spanStatus);
        divRefund.appendChild(spanRefund);
        divStatus.appendChild(divStatus1);
        divStatus.appendChild(divRefund);
        tdStatus.appendChild(divStatus);
        


        var divAction = document.createElement('div');

        //accept consultation
        var divAcceptConsultation = document.createElement('div');
        var btnAccept = document.createElement("button");
        divAcceptConsultation.style.marginTop = "10px";
        btnAccept.style.width = "150px";
        btnAccept.textContent = "Accept";
        btnAccept.setAttribute("id", consultation.consultation_id);
        btnAccept.setAttribute("type", "button");
        divAcceptConsultation.appendChild(btnAccept);
        divAction.appendChild(divAcceptConsultation);

        //cancel appointment
        var divRejectConsultation = document.createElement('div');
        var btnCancelAppointment = document.createElement("button");
        btnCancelAppointment.style.marginTop = "10px";
        btnCancelAppointment.style.width = "150px";
        btnCancelAppointment.textContent = "Cancel Appointment";
        btnCancelAppointment.setAttribute("id", consultation.consultation_id);
        btnCancelAppointment.setAttribute("type", "button");
        divRejectConsultation.appendChild(btnCancelAppointment);
        divAction.appendChild(divRejectConsultation);

        //admin Issue Refund
        var divIssueRefund = document.createElement('div');
        var btnIssueRefund = document.createElement("button");
        divIssueRefund.style.marginTop = "10px";
        btnIssueRefund.style.width = "150px";
        btnIssueRefund.textContent = "Issue Refund";
        btnIssueRefund.setAttribute("id", consultation.consultation_id);
        btnIssueRefund.setAttribute("type", "button");
        divIssueRefund.style.display = "none";
        divIssueRefund.appendChild(btnIssueRefund);
        divAction.appendChild(divIssueRefund);

        //completed
        var divViewPrescription = document.createElement('div');
        var btnViewPrescription = document.createElement("button");
        divViewPrescription.style.marginTop = "10px";
        btnViewPrescription.style.width = "200px";
        btnViewPrescription.textContent = "View Prescription";
        btnViewPrescription.setAttribute("id", consultation.consultation_id);
        btnViewPrescription.setAttribute("type", "button");
        divViewPrescription.appendChild(btnViewPrescription);
        divAction.appendChild(divViewPrescription);

        var divCreatePrescription = document.createElement('div');
        var btnCreatePrescription = document.createElement("button");
        divCreatePrescription.style.marginTop = "10px";
        btnCreatePrescription.style.width = "200px";
        btnCreatePrescription.textContent = "Create Prescription";
        btnCreatePrescription.setAttribute("id", consultation.consultation_id);
        btnCreatePrescription.setAttribute("type", "button");
        divCreatePrescription.appendChild(btnCreatePrescription);
        divAction.appendChild(divCreatePrescription);

        tdAction.appendChild(divAction);

        if (consultation.status == "pending") {
            divAcceptConsultation.style.display = "block";
            divRejectConsultation.style.display = "block";
            divViewPrescription.style.display = "none";
            divCreatePrescription.style.display = "none";
        }

        if (consultation.status == "completed") {
            divAcceptConsultation.style.display = "none";
            divRejectConsultation.style.display = "none";
            divViewPrescription.style.display = "block";
            divCreatePrescription.style.display = "none";
        }

        if (consultation.status == "approved") {
            divAcceptConsultation.style.display = "none";
            divRejectConsultation.style.display = "none";
            divViewPrescription.style.display = "none";
            divCreatePrescription.style.display = "block";
        }

        if (consultation.status == "cancelled") {
            divAcceptConsultation.style.display = "none";
            divRejectConsultation.style.display = "none";
            divViewPrescription.style.display = "none";
            divCreatePrescription.style.display = "none";
        }

        //for admin disable mark delivery or reject enquery buttons
        if (admin) {
            divAcceptConsultation.style.display = "none";
            divRejectConsultation.style.display = "none";
            divViewPrescription.style.display = "none";

            if (consultation.status == "cancelled") {
                if(consultation.refund_issued){
                    divIssueRefund.style.display = "none";
                }
                else{

                    divIssueRefund.style.display = "block";
                }
              
            }

            if (consultation.status == "pending") {
                divRejectConsultation.style.display = "block";
            }
        }

        tr.appendChild(tdConsultationId);
        tr.appendChild(tdPatientDetails);
        tr.appendChild(tdDoctorDetails);
        tr.appendChild(tdDate);
        tr.appendChild(tdConsultationSlot);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        // if (enquiry.status_code == 0) {
        //     tr.style.background = "#FFC133";
        // }

        table.appendChild(tr);

        btnAccept.addEventListener("click", function () {
            acceptConsultation(this.id);
        })

        btnCancelAppointment.addEventListener("click", function () {
            cancelAppointment(this.id);
        })

        btnCreatePrescription.addEventListener("click", function () {
            var consultation_id = this.id;
            window.location.href = "create_prescription.html?consultation_id=" + consultation_id;
        })

        btnViewPrescription.addEventListener("click", function () {

            var consultation_id = this.id;
            window.location.href = "prescription_pdf.html?consultation_id=" + consultation_id;
        })

        btnIssueRefund.addEventListener("click", function () {
            var consultation_id = this.id;
            getConsultationDetail(consultation_id).then(() => {
                var walletMoneyUsed = mConsultation.charges - mConsultation.paid_by_card;
                var htmlData = "Consultation Charges: " + mConsultation.charges + "\n"
                    + "Wallet Money Used / Offers Used: " + walletMoneyUsed + "\n"
                    + "Amount Being Refunded: " + mConsultation.paid_by_card;

                alert(htmlData);

                //will be enabled with my rupeaze integration
                var points = walletMoneyUsed * mNumberOfPointsInOneRupee;

                creditPoints(points, mConsultation.customer_id).then(() => {
                    updateRefundStatus(consultation_id).then(() => {
                        // refundPrepaidOrder(mConsultation.paid_by_card, mConsultation.consultation_id);
                    })

                })

            })

        })








        //     else if (consultation.status == "approved") {
        //         btnCreatePrescription.addEventListener("click", function () {
        //             window.location.href = "create_prescription.html?consultation_id=" + consultation.consultation_id;
        //         })
        //     }

        // }

        // else if (mType == "approved") {
        //     btnCreatePrescription.addEventListener("click", function () {
        //         window.location.href = "create_prescription.html?consultation_id=" + consultation.consultation_id;
        //     })
        // }


    }
}

function acceptConsultation(docId) {

    var consultationRef = firebase.firestore().collection("consultations").doc(docId);
    consultationRef.update({
        status: "approved"
    })
        .then(function () {
            alert("Appointment has ben accepted by you!!");
            window.location.href = "pending_appointments.html?type=" + mType;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}


function cancelAppointment(docId) {

    var consultationRef = firebase.firestore().collection("consultations").doc(docId);
    consultationRef.update({
        status: "cancelled",
        cancelled: true,
        refund_issued: false,
    })
        .then(function () {
            alert("Appointment has ben cancelled by you!!");
            window.location.href = "pending_appointments.html?type=" + mType;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });
}

function getSellerDetails() {

    return new Promise((resolve, reject) => {
        var docRef = firebase.firestore().collection("seller").doc(sellerId);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                mSeller = doc.data();
                resolve();
            } else {
                mSeller = null;
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();

            }
        }).catch(function (error) {
            seller = null;
            console.log("Error getting document:", error);
            reject();
        });

    })

}

var mConsultation = null;
function getConsultationDetail(consultation_id) {

    return new Promise((resolve, reject) => {
        var docRef = firebase.firestore().collection("consultations").doc(consultation_id);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                mConsultation = doc.data();
                resolve();
            } else {
                mConsultation = null;
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();

            }
        }).catch(function (error) {
            mConsultation = null;
            console.log("Error getting document:", error);
            reject();
        });

    })

}

function refundPrepaidOrder(amtTobeRefunded, paymentId) {
    console.log("going to refund amount");

    return new Promise((resolve, reject) => {


        var url = '/payments/' + paymentId + "/refund";
        var params = {
            amount: amtTobeRefunded * 100
        };

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function (res) {
            if (xmlHttp.readyState == 4) {
                console.log("response text = " + xmlHttp.responseText);

                res = JSON.parse(xmlHttp.responseText);
                if (res.status == "success") {
                    resolve();
                    //sendRefundMail(refundMailProps);
                }
                else {
                    setErrorHeader(res.status);
                    reject();
                }
            }
        }
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.send(JSON.stringify(params));

    })

}


function creditPoints(points, customer_id) {

    return new Promise((resolve, reject) => {

        var washingtonRef = firebase.firestore().collection("users").doc(customer_id);

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            points: firebase.firestore.FieldValue.increment(points)
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                reject();
            });

    })


}


function updateRefundStatus(docId) {


    return new Promise((resolve, reject) => {

        var consultationRef = firebase.firestore().collection("consultations").doc(docId);
        consultationRef.update({
            refund_issued: true,
        })
            .then(function () {
                resolve();

            })
            .catch(function (error) {
                // The document probably doesn't exist.
                reject();

            });

    })

}




