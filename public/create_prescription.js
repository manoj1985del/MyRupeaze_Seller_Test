var divContent = document.getElementById('divContent');
var table = document.getElementById('tblData');
var btnSubmit = document.getElementById("btnSubmit");

var txtChiefComplaints = document.getElementById("txtChiefComplaints");
var btnAddComplaint = document.getElementById("btnAddComplaint");

var txtDiagonosis = document.getElementById("txtDiagonosis");

var txtAdvices = document.getElementById("txtAdvices");

var btnAddAdvice = document.getElementById("btnAddAdvice");

var txtFollowUp = document.getElementById("txtFollowUp");

var tblComplaint = document.getElementById("tblComplaints");

var tblAdvices = document.getElementById("tblAdvices");

var tbl

var complaints = [];
var advices = [];

btnAddComplaint.addEventListener("click", function(){
    if(!txtChiefComplaints.value == ""){
        complaints.push(txtChiefComplaints.value);
        txtChiefComplaints.value = "";
    }

    console.log(complaints);
    showComplaintTable();
})

function showComplaintTable(){

    console.log(complaints);
    if(!complaints.length == 0){

    deleteComplaintsRows();
    
    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSNo = document.createElement("th");
    thSNo.textContent = "S.No.";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    var thComplaint = document.createElement("th");
    thComplaint.textContent = "Complaint";

    tr.appendChild(thSNo);
    tr.appendChild(thComplaint);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblComplaint.appendChild(tHead);

    for (var i = 0; i < complaints.length; i++) {

        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdSNo = document.createElement('td');
        var tdComplaint = document.createElement('td');
        var tdAction = document.createElement('td');
      

        var divSNo = document.createElement('div');
        var rowNum = i + 1;
        var spanSNo = document.createElement('span');
        spanSNo.textContent = rowNum.toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divComplaint = document.createElement('div');
        var spainComplaint = document.createElement('span');
        spainComplaint.textContent = complaints[i];
        divComplaint.appendChild(spainComplaint);
        tdComplaint.appendChild(divComplaint);

        
        var divAction = document.createElement('div');

        var divDelete = document.createElement('div');
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.setAttribute("id", i.toString());
        btnDelete.textContent = "Delete Complaint";
        btnDelete.setAttribute("type", "button");
        divDelete.appendChild(btnDelete);
        divAction.appendChild(divDelete);

        tdAction.appendChild(divAction);

        console.log(i);


        tr.appendChild(tdSNo);
        tr.appendChild(tdComplaint);
        tr.appendChild(tdAction);

        tblComplaint.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            complaints.splice(index, 1);
            alert("Item removed successfully");
            console.log(complaints);
            console.log("index" + index);

            showComplaintTable();
    })
        
 }


    }
}

btnAddAdvice.addEventListener("click", function(){
    if(!txtAdvices.value == ""){
        advices.push(txtAdvices.value);
        txtAdvices.value = "";
    }

    console.log(advices);
   showAdviceTable();
})


function showAdviceTable(){
   

    if(!advices.length == 0){

    deleteAdvicesRows();
    
    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSNo = document.createElement("th");
    thSNo.textContent = "S.No.";

    var thAdvice = document.createElement("th");
    thAdvice.textContent = "Advice";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSNo);
    tr.appendChild(thAdvice);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblAdvices.appendChild(tHead);

    for (var i = 0; i < advices.length; i++) {

        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdSNo = document.createElement('td');
        var tdAdvice = document.createElement('td');
        var tdAction = document.createElement('td');
      

        var divSNo = document.createElement('div');
        var rowNum = i + 1;
        var spanSNo = document.createElement('span');
        spanSNo.textContent = rowNum.toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divAdvice = document.createElement('div');
        var spanAdvice = document.createElement('span');
        spanAdvice.textContent = advices[i];
        divAdvice.appendChild(spanAdvice);
        tdAdvice.appendChild(divAdvice);

        var divAction = document.createElement('div');

        var divDelete = document.createElement('div');
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.setAttribute("id", i.toString());
        btnDelete.textContent = "Delete Advice";
        btnDelete.setAttribute("type", "button");
        divDelete.appendChild(btnDelete);
        divAction.appendChild(divDelete);
        tdAction.appendChild(divAction);

        tr.appendChild(tdSNo);
        tr.appendChild(tdAdvice);
        tr.appendChild(tdAction);

        tblAdvices.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            advices.splice(index, 1);
            alert("Item removed successfully");

            showAdviceTable();
    })
 }


    }
}

var consultationId = getQueryVariable("consultation_id");

var headerCreated = false;

var medicine_names = [];
var medicine_timing = [];
var medicine_frequency = [];
var medicne_days = [];


divContent.style.display = 'block';

createTable();


function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thMedicineName = document.createElement("th");
    thMedicineName.textContent = "Medicine Name";


    var thTiming = document.createElement("th");
    thTiming.textContent = "Timing";


    var thFrequency = document.createElement("th");
    thFrequency.textContent = "Frequency";

    var thDays = document.createElement("th");
    thDays.textContent = "Days";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thMedicineName);
    tr.appendChild(thTiming);
    tr.appendChild(thFrequency);
    tr.appendChild(thDays);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {

    createTableHeaders();

    var index = 0;

    for (var i = 0; i < 1; i++) {


        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdMedicineName = document.createElement('td');
        var tdTiming = document.createElement('td');
        var tdFrequency = document.createElement('td');
        var tdDays = document.createElement('td');
        var tdAction = document.createElement('td');


        var divMedicineName = document.createElement('div');
        var inputMedicineName = document.createElement('input');
        inputMedicineName.setAttribute("type", "text");
        inputMedicineName.classList.add("form-control");
        inputMedicineName.setAttribute("id", "medicines" + index.toString());
        divMedicineName.appendChild(inputMedicineName);
        tdMedicineName.appendChild(divMedicineName);


        var divTiming = document.createElement('div');
        var inputTiming = document.createElement('input');
        inputTiming.setAttribute("type", "text");
        inputTiming.classList.add("form-control");
        inputTiming.setAttribute("id", "medicine_timing" + index.toString());
        divTiming.appendChild(inputTiming);
        tdTiming.appendChild(divTiming);

        var divFrequency = document.createElement('div');
        var inputFrequency = document.createElement('input');
        inputFrequency.setAttribute("type", "number");
        inputFrequency.classList.add("form-control")
        inputFrequency.setAttribute("id", "frequency" + index.toString());
        divFrequency.appendChild(inputFrequency);
        tdFrequency.appendChild(divFrequency);

        var divDays = document.createElement('div');
        var inputDays = document.createElement('input');
        inputDays.setAttribute("type", "number");
        inputDays.classList.add("form-control")
        inputDays.setAttribute("id", "days" + index.toString());
        divDays.appendChild(inputDays);
        tdDays.appendChild(divDays);


        var divAction = document.createElement('div');

        var divAccept = document.createElement('div');
        var btnAcceptEnquiry = document.createElement("button");
        btnAcceptEnquiry.style.width = "150px";
        btnAcceptEnquiry.textContent = "Add Medicine";
        btnAcceptEnquiry.setAttribute("id", index.toString());
        btnAcceptEnquiry.setAttribute("type", "button");
        divAccept.appendChild(btnAcceptEnquiry);
        divAction.appendChild(divAccept);

        tdAction.appendChild(divAction);

       
        tr.appendChild(tdMedicineName);
        tr.appendChild(tdTiming);
        tr.appendChild(tdFrequency);
        tr.appendChild(tdDays);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnAcceptEnquiry.addEventListener("click", function () {
            console.log(index);
            var medicineName = document.getElementById("medicines" + this.id);
            var timing = document.getElementById("medicine_timing" + this.id);
            var frequency = document.getElementById("frequency" + this.id);
            var days =  document.getElementById("days" + this.id);

            console.log(medicineName.value);

            medicine_names[index] = medicineName.value;
            medicine_timing[index] = timing.value;
            medicine_frequency[index] = parseFloat(frequency.value);
            medicne_days[index] = parseFloat(days.value);

            if(medicineName.value == "" || timing.value == "" || frequency.value == "" || days.value == ""){

            }
            else{
                showMedicineTable();
                medicineName.value = "";
                timing.value = "";
                frequency.value = "";
                days.value = "";
            }

            index++;
        })
    }
  
}


function submitResponse() {

    var consultationRef = firebase.firestore().collection("consultations").doc(consultationId);
    consultationRef.update({
        medicines: medicine_names,
        medicine_timings: medicine_timing,
        medicines_frequency: medicine_frequency,
        medicine_days: medicne_days,
        chief_complaints: complaints,
        advices: advices,
        diagonosis: txtDiagonosis.value,
        followUp: txtFollowUp.value,
        status: "completed"
    })
        .then(function () {
            alert("Details saved successfully");
        })
        .catch(function (error) {
            console.log("doc does not exist");
        });

}

btnSubmit.addEventListener("click", function () {
   console.log("clicked");
    submitResponse();

})



function createHeaders(){

    headerCreated = true;

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSNo = document.createElement("th");
    thSNo.textContent = "S.No.";

    var thMedicineName = document.createElement("th");
    thMedicineName.textContent = "Medicine Name";


    var thTiming = document.createElement("th");
    thTiming.textContent = "Timing";


    var thFrequency = document.createElement("th");
    thFrequency.textContent = "Frequency";

    var thDays = document.createElement("th");
    thDays.textContent = "Days";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

 

    tr.appendChild(thSNo);
    tr.appendChild(thMedicineName);
    tr.appendChild(thTiming);
    tr.appendChild(thFrequency);
    tr.appendChild(thDays);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblMedicine.appendChild(tHead);

}

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = tblMedicine.lastElementChild;
    while (child) {
        tblMedicine.removeChild(child);
        child = tblMedicine.lastElementChild;
    }
}

function deleteAdvicesRows() {
    //e.firstElementChild can be used. 
    var child = tblAdvices.lastElementChild;
    while (child) {
        tblAdvices.removeChild(child);
        child = tblAdvices.lastElementChild;
    }
}



function deleteComplaintsRows() {
    //e.firstElementChild can be used. 
    var child = tblComplaint.lastElementChild;
    while (child) {
        tblComplaint.removeChild(child);
        child = tblComplaint.lastElementChild;
    }
}



function showMedicineTable(){

    var tblMedicine = document.getElementById("tblMedicine");
    deleteTableRows();
    createHeaders();
    console.log(medicine_names);

    // if(!headerCreated){
    //     createHeaders();
    // }

    for (var i = 0; i < medicine_names.length; i++) {

        var tr = document.createElement('tr');
        tr.setAttribute("id", "tr" + i.toString());
        var tdSNo = document.createElement('td');
        var tdMedicineName = document.createElement('td');
        var tdTiming = document.createElement('td');
        var tdFrequency = document.createElement('td');
        var tdDays = document.createElement('td');
        var tdAction = document.createElement('td');
      

        var divSNo = document.createElement('div');
        var rowNum = i + 1;
        var spanSNo = document.createElement('span');
        spanSNo.textContent = rowNum.toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divMedicineName = document.createElement('div');
        var spanMedicineName = document.createElement('span');
        spanMedicineName.textContent = medicine_names[i];
        divMedicineName.appendChild(spanMedicineName);
        tdMedicineName.appendChild(divMedicineName);


        var divTiming = document.createElement('div');
        var spanTiming = document.createElement('span');
        spanTiming.textContent = medicine_timing[i];
        divTiming.appendChild(spanTiming);
        tdTiming.appendChild(divTiming);

        var divFrequency = document.createElement('div');
        var spanFrequency = document.createElement('span');
        spanFrequency.textContent = medicine_frequency[i];
        divFrequency.appendChild(spanFrequency);
        tdFrequency.appendChild(divFrequency);

        var divDays = document.createElement('div');
        var spanDays = document.createElement('span');
        spanDays.textContent = medicne_days[i];
        divDays.appendChild(spanDays);
        tdDays.appendChild(divDays);

        var divAction = document.createElement('div');

        var divDelete = document.createElement('div');
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.setAttribute("id", i.toString);
        btnDelete.textContent = "Delete Medicine";
        btnDelete.setAttribute("type", "button");
        divDelete.appendChild(btnDelete);
        divAction.appendChild(divDelete);

        tdAction.appendChild(divAction);
    
        tr.appendChild(tdSNo);
        tr.appendChild(tdMedicineName);
        tr.appendChild(tdTiming);
        tr.appendChild(tdFrequency);
        tr.appendChild(tdDays);
        tr.appendChild(tdAction);

        tblMedicine.appendChild(tr);


        btnDelete.addEventListener("click", function () {
                var index = parseInt(this.id);
                medicine_names.splice(index, 1);
                medicine_timing.splice(index, 1);
                medicine_frequency.splice(index, 1);
                medicne_days.splice(index, 1);
    
                alert("Item removed successfully");
    
                showMedicineTable();
        })
 }
}
