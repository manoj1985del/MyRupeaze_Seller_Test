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


var adm = getQueryVariable("adm");
var mType = getQueryVariable("type");
var admin = false;
if (adm == "1") {
    admin = true;
}

getSellerDetails();
getEnquiries();

function getEnquiries() {

    var query;
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

        if(mType == "today_completed"){
            var query = firebase.firestore()
            .collection('consultations')
            .where("seller_id", "==", sellerId)
            .where("invoice_timestamp", ">=", today)
            .where("cancelled", "==", false);
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

        if(mType == "today_completed"){
            var query = firebase.firestore()
            .collection('consultations')
            .where("invoice_timestamp", ">=", today)
            .where("cancelled", "==", false);
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
    thDate.textContent = "Date";

    var thConsultationSlot = document.createElement("th");
    thConsultationSlot.textContent = "Time Slot";

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
        spanTimeSlot.textContent = consultation.slot;
        divTimeSlot.appendChild(spanTimeSlot);
        tdConsultationSlot.appendChild(divTimeSlot);


        // Status
        var divStatus = document.createElement('div');
        var spanStatus = document.createElement('span');
        spanStatus.textContent = consultation.status;
        divStatus.appendChild(spanStatus);
        tdStatus.appendChild(divStatus);


        var divAction = document.createElement('div');

        if(mType == "pending"){
            var divAcceptConsultation = document.createElement('div');
            var btnAccept = document.createElement("button");
            divAcceptConsultation.style.marginTop = "10px";
            btnAccept.style.width = "150px";
            btnAccept.textContent = "Accept";
            btnAccept.setAttribute("id", consultation.consultation_id);
            btnAccept.setAttribute("type", "button");
            divAcceptConsultation.appendChild(btnAccept);
            divAction.appendChild(divAcceptConsultation);
            tdAction.appendChild(divAction);
    
            var divRejectConsultation = document.createElement('div');
            var btnReject = document.createElement("button");
            btnReject.style.marginTop = "10px";
            btnReject.style.width = "150px";
            btnReject.textContent = "Reject";
            btnReject.setAttribute("id", consultation.consultation_id);
            btnReject.setAttribute("type", "button");
            divRejectConsultation.appendChild(btnReject);
            divAction.appendChild(divRejectConsultation);
        }

        else if(mType == "completed"){
            var divPrescribeMedicines = document.createElement('div');
            var btnPrescribeMedicines = document.createElement("button");
            divPrescribeMedicines.style.marginTop = "10px";
            btnPrescribeMedicines.style.width = "200px";
            btnPrescribeMedicines.textContent = "Generate Prescription";
            btnPrescribeMedicines.setAttribute("id", consultation.consultation_id);
            btnPrescribeMedicines.setAttribute("type", "button");
            divPrescribeMedicines.appendChild(btnPrescribeMedicines);
            divAction.appendChild(divPrescribeMedicines);
            tdAction.appendChild(divAction);
        }
       

        //for admin disable mark delivery or reject enquery buttons
        if (admin) {
            divAcceptConsultation.style.display = "none";
            divRejectConsultation.style.display = "none";
            divPrescribeMedicines.style.display = "none";
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

        if(mType == "pending"){

            btnAccept.addEventListener("click", function () {
                acceptConsultation(this.id);
            })
    
            btnReject.addEventListener("click", function(){
                rejectConsultation(this.id);
            })

        }

        else if(mType == "completed"){
            btnPrescribeMedicines.addEventListener("click", function(){
                window.location.href = "prescription_pdf.html?consultation_id=" + consultation.consultation_id;
            })
        }


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


function rejectConsultation(docId) {

    var consultationRef = firebase.firestore().collection("consultations").doc(docId);
    consultationRef.update({
        status: "rejected"
    })
        .then(function () {
            alert("Appointment has ben rejected by you!!");
            window.location.href = "pending_appointments.html?type=" + mType;
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.log("doc does not exist");

        });

}

function getSellerDetails() {
    return new Promise((resolve, reject) => {
        var docRef = firebase.firestore().collection("doctor").doc(sellerId);
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




