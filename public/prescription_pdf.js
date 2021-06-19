var divContent = document.getElementById("divContent");

var sellerId = localStorage.getItem("sellerid");
var consultation;
var seller;

var divProgress = document.getElementById("divProgress");


var txtDoctorName = document.getElementById("txtDoctorName");
var txtDoctorDegree = document.getElementById("txtDoctorDegree");
var txtDoctorAddress = document.getElementById("txtDoctorAddress");
var txtPatientName = document.getElementById("txtPatientName");
var txtPatientDetails = document.getElementById("txtPatientDetails");
var txtConsultationDate = document.getElementById("txtConsultationDate");
var txtConsultationId = document.getElementById("txtConsultationId");
var ulChiefComplaints = document.getElementById('ulChiefComplaints');

// var txtComplaints1 = document.getElementById("txtComplaints1");
// var txtComplaints2 = document.getElementById("txtComplaints2");

var txtDiagonosis = document.getElementById("txtDiagonosis");
//var txtAdvice = document.getElementById("txtAdvice");
var liAdvice = document.getElementById('liAdvice');
var txtFollowUp = document.getElementById("txtFollowUp");

var btnUpload = document.getElementById('btnUpload');

var prescriptionUrl = null;

var table = document.getElementById("tblMedicine");


var consultationId = getQueryVariable("consultation_id");
  fetchConsultation(consultationId).then(() => {
    divProgress.style.display = "none";
    divContent.style.display = "block";
    loadConsultation();
  })




function fetchConsultation(consultationId) {

    return new Promise((resolve, reject) => {
        var query = firebase.firestore()
          .collection('consultations').doc(consultationId)
    
        query.get()
          .then(function (doc) {
            if (doc.exists) {
              consultation = doc.data();
              // resolve();
            }
            else {
              consultation = null;
              reject();
            }
          }).then(function () {
    
            var query = firebase.firestore()
              .collection('seller').doc(sellerId);
    
            query.get()
              .then(function (snapshot) {
                   seller = snapshot.data();
                    resolve();
              })
    
          })
      })
  }


function loadConsultation(){

  console.log(consultation);
  console.log(seller);
    txtDoctorName.textContent = "Dr " + consultation.seller_name;
    txtDoctorDegree.textContent = seller.speciality[0] + " " + seller.degrees[0]; 
    txtDoctorAddress.textContent = seller.address_line1 + ", " + seller.address_line2 + ", " + seller.address_line3 + ", " + seller.city + ", "
    + seller.state;
    txtPatientName.textContent = "Patient Name: " +  consultation.customer_name;
    txtPatientDetails.textContent = consultation.customer_age + " years, " + consultation.customer_gender;
    txtConsultationDate.textContent = "Date: " + consultation.consultation_date;
    txtConsultationId.textContent = "Consultation Id: " + consultation.consultation_id;
    var arrComplaints = consultation.chief_complaints;
    if(arrComplaints != null){
      for(var i = 0; i < arrComplaints.length; i++){
        var li = document.createElement('li');
        li.innerHTML = arrComplaints[i];
        ulChiefComplaints.appendChild(li);
      }
    }
    // txtComplaints1.textContent = consultation.complaint1;
    // txtComplaints2.textContent = consultation.complaint2;
    txtDiagonosis.innerHTML = consultation.diagonosis;
    txtDiagonosis.style.fontSize = "13px";
    txtDiagonosis.style.fontStyle = "bold";
    var adviceList = consultation.advices;
    if(adviceList != null){
      for(var i = 0; i < adviceList.length; i++){
        var advice = adviceList[i];
        var li = document.createElement('li');
        li.innerHTML = advice;
        liAdvice.appendChild(li); 
      }
    }
    if(consultation.followUp == null){
      consultation.followUp = "No follow up advised";
    }
    else{
      txtFollowUp.textContent = consultation.followUp;
    }
    

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thMedicine = document.createElement("th");
    thMedicine.textContent = "Medicine";
    

    var thTiming = document.createElement("th");
    thTiming.textContent = "Timing";
  
    var thFrequency = document.createElement("th");
    thFrequency.textContent = "Frequency";
  

    var thDays = document.createElement("th");
    thDays.textContent = "Days";
 

    tr.appendChild(thMedicine);
    tr.appendChild(thTiming);
    tr.appendChild(thFrequency);
    tr.appendChild(thDays);

    tHead.appendChild(tr);
    table.appendChild(tHead);
    

    for (var i = 0; i < consultation.medicines.length; i++) {

        var tr = document.createElement("tr");
        var tdMedicine = document.createElement('td');
        var tdTiming = document.createElement('td');
        var tdFrequency = document.createElement('td');
        var tdDays = document.createElement('td');

        //Medicine
        var divMedicine = document.createElement('div');
        var spanMedicine = document.createElement('span');
        spanMedicine.textContent = consultation.medicines[i];
        divMedicine.appendChild(spanMedicine);
        tdMedicine.appendChild(divMedicine);

        //Timing
        var divTiming = document.createElement('div');
        var spanTiming = document.createElement('span');
        spanTiming.textContent = consultation.medicine_timings[i];
        divTiming.appendChild(spanTiming);
        tdTiming.appendChild(divTiming);

        //Frequency
        var divFrequency = document.createElement('div');
        var spanFrequency = document.createElement('span');
        spanFrequency.textContent = consultation.medicines_frequency[i] + " times a day";
        divFrequency.appendChild(spanFrequency);
        tdFrequency.appendChild(divFrequency);

    
        //Days
        var divDays = document.createElement('div');
        var spanDays = document.createElement('span');
        spanDays.textContent = consultation.medicine_days[i];
        divDays.appendChild(spanDays);
        tdDays.appendChild(divDays);

        tr.appendChild(tdMedicine);
        tr.appendChild(tdTiming);
        tr.appendChild(tdFrequency);
        tr.appendChild(tdDays);

        table.appendChild(tr);
    }

    document.getElementById("download")
        .addEventListener("click", () => {
          var consultationId = getQueryVariable("consultation_id");
          const consultation = this.document.getElementById("consultation");
          console.log(consultation);
          console.log(window);
          var opt = {
            margin: 1,
            filename: consultationId + ".pdf",
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          html2pdf().from(consultation).set(opt).save();
        })

}


btnUpload.addEventListener("click", function(){
  var input = document.createElement("INPUT");
  input.setAttribute("type", "file"); 
  input.click();

  var pdfFile;

  input.addEventListener("change", function () {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        pdfFile = file;
        uploadFile(pdfFile);
    }
});
})

function uploadFile(file) {

  if (file == null) {
      alert("Please select file to upload");
      return;
  }

  console.log(file.type);

  if (!(file.type == "application/pdf")) {
      alert("Only PDF files are allowed to upload");
      return;
  }


  console.log("going to show progress bar");

  saveFileToFirebase(file).then(() => {
    firebase.firestore().collection('consultations').doc(consultationId).update({
      prescription_url: prescriptionUrl
  })
    alert("File Uploaded Successfuly")
})
}

function saveFileToFirebase(file) {
 
  var imagePath = "doctor_prescription" + '/' + file.name;
  return new Promise((resolve, reject) => {
      firebase.storage().ref(imagePath).put(file).then(function () {
          firebase.storage().ref(imagePath).getDownloadURL().then(function (url) {
            prescriptionUrl = url;
              console.log(prescriptionUrl);
              console.log("resolving");
              resolve();
          });
      });
  });
}