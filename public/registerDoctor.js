//GET QUERY VARIABLE
var sellerId = getQueryVariable("sellerid");
var update = getQueryVariable("update");
var bUpdate = false;

var divDoctorDegree = document.getElementById("divDoctorDegree");
var divDoctorSpeciality = document.getElementById("divDoctorSpeciality");

var arrDoctorDegree = [];
var arrSelectedDoctorDegree = [];
var arrDegreeLabels = [];

var arrDoctorSpeciality = [];
var arrSelectedDocSpeciality = [];
var arrSpecialityLabels = [];

var degreeCheckboxes = [];
var specialityCheckboxes = [];


var txtNmae = document.getElementById("txtName");
var txtMobile = document.getElementById("txtMobile");
var txtCompanyName = document.getElementById("txtCompanyName");
var txtAddressLine1 = document.getElementById("txtAddressLine1");
var txtAddressLine2 = document.getElementById("txtAddressLine2");
var txtAddressLine3 = document.getElementById("txtAddressLine3");
var txtCity = document.getElementById("txtCity");

var txtPincode = document.getElementById("txtPincode");
var txtGST = document.getElementById("txtGSTNo");
var txtPANCardNo = document.getElementById("txtPANCardNo");
var txtAccountHolderName = document.getElementById("txtAccountHolderName");
var txtAccountNumber = document.getElementById("txtAccountNumber");
var txtBankName = document.getElementById("txtBankName");
var txtIFSCCode = document.getElementById("txtIFSCCode");
var btnSubmit = document.getElementById("btnSubmit");
var rbCurrent = document.getElementById("rbCurrent");
var rbSavings = document.getElementById("rbSavings");


var btnUplaodGST = document.getElementById("btnUplaodGST");
var gstProgress = document.getElementById("gstProgress");
var btnUploadCancelCheque = document.getElementById("btnUploadCancelCheque");
var chequeProgress = document.getElementById("chequeProgress");
var gstStatus = document.getElementById("gstStatus");
var chequeStatus = document.getElementById("chequeStatus");
var btnViewGST = document.getElementById("btnViewGST");
var btnViewCancelledCheque = document.getElementById("btnViewCancelledCheque");
var txtAboutShop = document.getElementById("txtAboutShop");

var fileGST;
var fileCancelledCheque;
var txtUploadGST = document.getElementById("txtUploadGST");
var txtUploadCancelCheque = document.getElementById("txtUploadCancelCheque");



var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");

var cmbState = document.getElementById("state");
var msgHeader = document.getElementById("msgHeader");
var imgHeader = document.getElementById("imgHeader");
var actionMsg = document.getElementById("actionMsg");
var mercahntIdExist = false;
var merchantId = null;

var txtMerchantId = document.getElementById("txtMerchantId");
var btnCheckAvailability = document.getElementById("btnCheckAvailability");
var imgCheckAvailability = document.getElementById("imgCheckAvailability");
var cmbSellerCategory = document.getElementById("sellerCategory");

var divCity = document.getElementById("divCity");
var txtOpeningTime = document.getElementById("txtOpeningTime");
var txtClosingTime = document.getElementById("txtClosingTime");
var txtEmail = document.getElementById("txtEmail");
var email = localStorage.getItem("sellerEmail");

var txtEducationCollege = document.getElementById("txtEducationCollege");
var txtHospitalServing = document.getElementById("txtHospitalServing");

var inpFile_CarouselImage1 = document.getElementById("inpFile_CarouselImage1");
var inpFile_CarouselImage2 = document.getElementById("inpFile_CarouselImage2");
var inpFile_CarouselImage3 = document.getElementById("inpFile_CarouselImage3");


var imagePreview_CarouselImage1Container = document.getElementById("imagePreview_CarouselImage1");
var imagePreview_CarouselImage2Container = document.getElementById("imagePreview_CarouselImage2");
var imagePreview_CarouselImage3Container = document.getElementById("imagePreview_CarouselImage3");


var previewImage_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_image");
var previewText_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_default-text");

var previewImage_CarouselImage2 = imagePreview_CarouselImage2Container.querySelector(".image-preview_image");
var previewText_CarouselImage2 = imagePreview_CarouselImage2Container.querySelector(".image-preview_default-text");

var previewImage_CarouselImage3 = imagePreview_CarouselImage3Container.querySelector(".image-preview_image");
var previewText_CarouselImage3 = imagePreview_CarouselImage3Container.querySelector(".image-preview_default-text");

var btnUploadCarouselImage1 = document.getElementById("btnUploadCarouselImage1");
var imgProgressCarouselImage1 = document.getElementById("imgProgressCarouselImage1");
var uploadMsgCarouselImage1 = document.getElementById("uploadMsgCarouselImage1");

var btnUploadCarouselImage2 = document.getElementById("btnUploadCarouselImage2");
var imgProgressCarouselImage2 = document.getElementById("imgProgressCarouselImage2");
var uploadMsgCarouselImage2 = document.getElementById("uploadMsgCarouselImage2");

var btnUploadCarouselImage3 = document.getElementById("btnUploadCarouselImage3");
var imgProgressCarouselImage3 = document.getElementById("imgProgressCarouselImage3");
var uploadMsgCarouselImage3 = document.getElementById("uploadMsgCarouselImage3");

var btnLogout = document.getElementById("btnLogout");

var fileCarousel_Img1;
var url_Carousel_Img1 = null;

var fileCarousel_Img2;
var url_Carousel_Img2 = null;

var fileCarousel_Img3;
var url_Carousel_Img3 = null;



var shop_opening_time = null;
var shop_closing_time = null;

var mAreaPin;

var mSeller = null;
var mShop = null;
console.log(email);

txtEmail.value = email;
var uploadFileUrl = null;
var gstURL = null;
var chequeURL = null;

// var specialityCheckboxes = document.getElementsByName("Speciality");
// var degreeCheckboxes = document.getElementsByName("Degree");  
// var selectedDegrees = new Array();
// var selectedSpecialities = new Array();

// var checkedDegrees = 0;  

firebase.firestore().collection("doctor_degrees").doc("anUVt5alS2ZMpFMjFiVX").get().then(queryResult =>{
   var document = queryResult.data();
   arrDoctorDegree = document.doc_degrees;
});

firebase.firestore().collection("doctor_specialities").doc("l1Lgq8cbgOjWtvT5E37b").get().then(queryResult =>{
   var document = queryResult.data();
   arrDoctorSpeciality = document.doc_specialities;
});
   

setImage(inpFile_CarouselImage1, previewImage_CarouselImage1, previewText_CarouselImage1, "fileCarousel_Img1");
setImage(inpFile_CarouselImage2, previewImage_CarouselImage2, previewText_CarouselImage2, "fileCarousel_Img2");
setImage(inpFile_CarouselImage3, previewImage_CarouselImage3, previewText_CarouselImage3, "fileCarousel_Img3");



btnUploadCarouselImage1.addEventListener("click", function () {
   uploadFile(fileCarousel_Img1, imgProgressCarouselImage1, uploadMsgCarouselImage1, url_Carousel_Img1, sellerId, "img");
});

btnUploadCarouselImage2.addEventListener("click", function () {
   uploadFile(fileCarousel_Img2, imgProgressCarouselImage2, uploadMsgCarouselImage2, url_Carousel_Img2, sellerId, "img");
});

btnUploadCarouselImage3.addEventListener("click", function () {
   uploadFile(fileCarousel_Img3, imgProgressCarouselImage3, uploadMsgCarouselImage3, url_Carousel_Img3, sellerId, "img");
});

btnLogout.addEventListener("click", function(){
   logOut();
})

function setImage(inpFile, previewImage, previewImageDeraultText, imgNmae) {

   inpFile.addEventListener("change", function () {
       var file = this.files[0];
       if (file) {
           var reader = new FileReader();
           previewImage.style.display = "block";
           previewImageDeraultText.style.display = "none";

           reader.addEventListener("load", function () {
               previewImage.setAttribute("src", this.result);

           });
           reader.readAsDataURL(file);
           switch (imgNmae) {

               case "fileCarousel_Img1":
                   fileCarousel_Img1 = file;
                   break;

               case "fileCarousel_Img2":
                   fileCarousel_Img2 = file;
                   break;

               case "fileCarousel_Img3":
                   fileCarousel_Img3 = file;
                   break;
           }

       }
       else {
           previewImage.style.display = null;
           previewImageDeraultText.style.display = null;

       }
   });


}

function uploadFile(file, imgProgress, msgUpload, url, groupName, imageName) {

   if (file == null) {
       alert("Please select file to upload");
       return;
   }

   console.log(file.size);

   if (file.size > 102400) {
       alert("File cannot be more than 100 KB");
       return;
   }

   if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
       alert("Only png or jpeg files are allowed to upload");
       return;
   }


   console.log("going to show progress bar");
   imgProgress.style.display = "block";

   saveImageAtFirebase(file, groupName).then(() => {
       imgProgress.style.display = "none";
       msgUpload.style.display = "block";
       if(url == url_Carousel_Img1){
         url_Carousel_Img1 = imgUrl;
       }
       else if(url == url_Carousel_Img2){
         url_Carousel_Img2 = imgUrl;
       }
       else if(url == url_Carousel_Img3){
         url_Carousel_Img3 = imgUrl;
       }
       
   })
}

function saveImageAtFirebase(file, groupname) {
   imgUrl = null;
   var imagePath = "seller_images" + '/' + groupname + '/' + file.name;
   console.log(imagePath);
   return new Promise((resolve, reject) => {
       firebase.storage().ref(imagePath).put(file).then(function () {
           firebase.storage().ref(imagePath).getDownloadURL().then(function (url) {
               imgUrl = url;
               
               console.log("resolving");
               resolve();
           });
       });
   });
}

loadDoctorDegree().then(() => {

   loadSellerDetails(sellerId).then(() => {
      //seller exists.. we are at this form for updation
      if (mSeller != null) {
         bUpdate = true;
         loadShopDetails(sellerId).then(() => {
            loadUI();
         })
      }
   })

});

loadDoctorspeciality().then(() => {

   loadSellerDetails(sellerId).then(() => {
      //seller exists.. we are at this form for updation
      if (mSeller != null) {
         bUpdate = true;
         loadShopDetails(sellerId).then(() => {
            loadUI();
         })
      }
   })

});



btnUplaodGST.addEventListener("click", function () {
   uploadFileUrl = null;
   if (fileGST == null) {
      alert("Please select a gst certificate to upload");
      return;
   }
   gstProgress.style.display = "block";
   saveFileToFirebase(fileGST).then(() => {
      gstURL = uploadFileUrl;

      if (bUpdate) {
         mSeller.gst_url = gstURL;
         updateGSTURL();
      }
      console.log(gstURL);
      gstStatus.textContent = "GST Certificate Uploaded Successfully";
      gstProgress.style.display = "none";
   })
})

btnUploadCancelCheque.addEventListener("click", function () {
   uploadFileUrl = null;
   if (fileCancelledCheque == null) {
      alert("Please select a cancel cheque to upload");
      return;
   }
   chequeProgress.style.display = "block";
   saveFileToFirebase(fileCancelledCheque).then(() => {
      chequeURL = uploadFileUrl;

      if (bUpdate) {
         mSeller.cheque_url = chequeURL;
         updateChequeURL();
      }
      console.log(chequeURL);
      chequeStatus.textContent = "Cancelled Cheque Uploaded Successfully";
      chequeProgress.style.display = "none";
   })
})




txtUploadGST.addEventListener("change", function () {
   gstStatus.textContent = "";
   fileGST = this.files[0];

})

txtUploadCancelCheque.addEventListener("change", function () {
   chequeStatus.textContent = "";
   fileCancelledCheque = this.files[0];
})

function saveFileToFirebase(file) {
   console.log(file);
   return new Promise((resolve, reject) => {

      if (file != null) {
         var filepath = "seller_certificates" + '/' + sellerId + '/' + file.name;
         firebase.storage().ref(filepath).put(file).then(() => {
            firebase.storage().ref(filepath).getDownloadURL().then((url) => {
               uploadFileUrl = url;
               resolve();

            })
         })

      }
      else {
         reject();
      }

   })

}


function loadUI() {

   console.log(mSeller.seller_category);

   txtMerchantId.disabled = true;
   //txtCompanyName.disabled = true;
   //txtPANCardNo.disabled = true;
   //txtGST.disabled = true;
   btnSubmit.textContent = "Update";


   sellerId = localStorage.getItem("sellerid");

   btnCheckAvailability.style.display = "none";
   txtCompanyName.value = mSeller.company_name;
   txtEmail.value = mSeller.email;
   txtAddressLine1.value = mSeller.address_line1;
   txtAddressLine2.value = mSeller.address_line2;
   txtAddressLine3.value = mSeller.address_line3;
   txtCity.value = mSeller.city;
   cmbState.value = mSeller.state;
   txtPANCardNo.value = mSeller.pan_no;
   txtGST.value = mSeller.gstin;
   txtPincode.value = mSeller.pincode;
   txtMobile.value = mSeller.mobile;
   txtMerchantId.value = mSeller.merchant_id;
   txtAccountNumber.value = mSeller.account_no;
   txtAboutShop.value = mSeller.about_shop;
   url_Carousel_Img1 = mSeller.img_url;
   previewImage_CarouselImage1.src = url_Carousel_Img1;
   previewImage_CarouselImage1.style.display = "block";
   previewText_CarouselImage1.style.display = "none";
   // createDegreeCheckBoxes();
   // createSubCategoryCheckBoxes();
   // createSubCategoryCheckBoxes(cmbSellerCategory.value);
   // if (mSeller.seller_subcategories != null) {
   //    for (var i = 0; i < mSeller.seller_subcategories.length; i++) {
   //       var subCategory = mSeller.seller_subcategories[i];
   //       for(var j = 0; j < arrLabels.length; j++){
   //          if(arrLabels[j].textContent == subCategory){
   //             var inputElement = checkBoxes[j];
   //             inputElement.checked = true;
   //             arrSelectedSubCategories.push(arrLabels[j].textContent);
   //             break;
   //          }
   //       }
   //    }
   // }

   txtIFSCCode.value = mSeller.ifsc;
   txtBankName.value = mSeller.bank_name;
   txtNmae.value = mSeller.seller_name;
   cmbSellerCategory.value = mSeller.seller_category;

   txtAccountHolderName.value = mSeller.account_holder_name;
   if (mSeller.city_seller == true) {
      rbCityYes.checked = true;
      rbCityNo.checked = false;
      divCity.style.display = "block";
   }
   else {

      rbCityYes.checked = false;
      rbCityNo.checked = true;
      divCity.style.display = "none";


   }

   if (mSeller.city_seller) {
      txtOpeningTime.value = mSeller.shop_opening_time;
      txtClosingTime.value = mSeller.shop_closing_time;
   }


   if (mSeller.accountType == "current") {
      rbCurrent.checked = true;
   } else {
      rbCurrent.checked = false;
   }

   btnViewCancelledCheque.style.display = "block";
   btnViewGST.style.display = "block";

   //approved customer are allowed to edit only certain things
   if (mSeller.status == "approved") {
      txtCompanyName.disabled = true;
      txtAddressLine1.disabled = true;
      txtAddressLine2.disabled = true;
      txtAddressLine3.disabled = true;
      txtCity.disabled = true;
      cmbState.disabled = true;
      txtUploadGST.style.display = "none";
      btnUplaodGST.style.display = "none";
      txtPANCardNo.disabled = true;
      txtAccountHolderName.disabled = true;
      txtAccountNumber.disabled = true;
      txtBankName.disabled = true;
      txtIFSCCode.disabled = true;
      txtUploadCancelCheque.style.display = "none";
      btnUploadCancelCheque.style.display = "none";
      rbCurrent.disabled = true;
      rbSavings.disabled = true;
      txtGST.disabled = true;

   }
}


btnCheckAvailability.addEventListener("click", function () {


   if (txtMerchantId.value == "") {
      alert("Please Enter Merchant Id");
      return;

   }

   if (txtMerchantId.value.length != 8) {
      alert("Merchant id has to be exact 8 characters");
      txtMerchantId.focus();
      return;
   }

   imgCheckAvailability.style.display = "block";
   imgCheckAvailability.setAttribute("src", "img_progress.gif");


   merchantIdAlreadyExists(txtMerchantId.value).then(() => {
      if (mercahntIdExist == false) {
         merchantId = txtMerchantId.value;
         imgCheckAvailability.style.width = "50px";
         imgCheckAvailability.style.height = "50px";
         imgCheckAvailability.setAttribute("src", "img_ok.png");
      }
      else {
         merchantId = null;
         imgCheckAvailability.style.width = "50px";
         imgCheckAvailability.style.height = "50px";
         imgCheckAvailability.setAttribute("src", "img_error.png");
      }
   })


})

function merchantIdAlreadyExists(merchantId) {
   return new Promise((resolve, reject) => {

      firebase.firestore().collection("doctor")
         .where("merchant_id", "==", merchantId)
         .get()
         .then(function (querySnapshot) {
            if (querySnapshot.docs.length == 0) {
               mercahntIdExist = false;
               resolve();
            }
            else {
               mercahntIdExist = true;
               resolve();

            }

         })
         .catch(function (error) {
            mercahntIdExist = true;
            resolve();
            console.log("Error getting documents: ", error);
         });

   })

}

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split('&');
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
         return decodeURIComponent(pair[1]);
      }
   }
   return null;
}

//This function will validate if all the details are filled up correctly...
function validateFormDetails() {
   var errorMsg = "";
   var errorFound = false;

   // alert(cmbSellerCategory.selectedIndex);

   // if (cmbSellerCategory.selectedIndex == 0) {
   //    console.log("control here");
   //    errorMsg += "Please Choose Seller Category <br />";
   //    errorFound = true;
   // }


   if (merchantId == null && bUpdate == false) {
      errorMsg += "Please enter a valid merchant id <br/>";
      errorFound = true;
   }



   if (txtNmae.value == "") {
      errorMsg += "Please Enter Name<br/>"
      errorFound = true;
   }

   if (txtMobile.value == "") {
      errorMsg += "Please Enter Mobile Number<br/>"
      errorFound = true;
   }

   if (txtCompanyName.value == "") {
      errorMsg += "Please Enter Company Name<br/>"
      errorFound = true;
   }

   if (txtAddressLine1.value == "") {
      errorMsg += "Please Enter Address Line 1<br/>"
      errorFound = true;
   }

   if (txtAddressLine2.value == "") {
      errorMsg += "Please Enter Address Line 2<br/>"
      errorFound = true;
   }

   if (txtAddressLine3.value == "") {
      errorMsg += "Please Enter Address Line 3<br/>"
      errorFound = true;
   }

   if (txtCity.value == "") {
      errorMsg += "Please Enter City<br/>"
      errorFound = true;
   }

   if (txtPincode.value == "") {
      errorMsg += "Please Enter Pincode<br/>"
      errorFound = true;
   }

   if (txtGST.value == "") {
      errorMsg += "Please Enter GST Number<br/>"
      errorFound = true;
   }


   else {
      if (txtGST.value.length != 15) {
         errorMsg += "GST Number has to be exact 15 characters long.<br/>"
         errorFound = true;
      }
   }

   if(txtEducationCollege.value == ""){
      errorMsg += "Please Enter your Education Details<br/>"
      errorFound = true;
   }

   if(txtHospitalServing.value == ""){
      errorMsg += "Please Enter Hospitals you are serving for<br/>"
      errorFound = true;
   }



   if (txtPANCardNo.value == "") {
      errorMsg += "Please Enter PAN Card Number<br/>"
      errorFound = true;
   }
   else {
      if (txtPANCardNo.value.length != 10) {
         errorMsg += "PAN card number has to be exact 10 characters long.<br/>"
         errorFound = true;
      }
   }

   if (txtAccountHolderName.value == "") {
      errorMsg += "Please Enter Account Holder Name<br/>"
      errorFound = true;
   }

   if (txtAccountNumber.value == "") {
      errorMsg += "Please Enter Account Number<br/>"
      errorFound = true;
   }

   if (txtBankName.value == "") {
      errorMsg += "Please Enter Bank Name<br/>"
      errorFound = true;
   }

   if (txtIFSCCode.value == "") {
      errorMsg += "Please Enter Bank IFSC Code<br/>"
      errorFound = true;
   }



      if (txtOpeningTime.value == "") {
         errorMsg += "Please Enter Shop Opening Time <br/>";
         errorFound = true;
      

      if (txtClosingTime.value == "") {
         errorMsg += "Please Enter Shop Closing Time <br/>";
         errorFound = true;
      }
   }


   if (bUpdate == false) {
      console.log("gst url = " + gstURL);
      console.log("cheque url = " + chequeURL);

      if (gstURL == null) {
         errorMsg += "Please upload GST certificate. <br/>";
         errorFound = true;
      }

      if (chequeURL == null) {
         errorMsg += "Please upload Cancelled Cheque";
         errorFound = true;
      }

      if(url_Carousel_Img1 == null){
         errorMsg += "Please upload your passport size photo";
         errorFound = true;
      }

      if(url_Carousel_Img2 == null){
         errorMsg += "Please upload your logo";
         errorFound = true;
      }

      if(url_Carousel_Img3 == null){
         errorMsg += "Please upload your degree";
         errorFound = true;
      }
   }

   if(arrSelectedDoctorDegree.length == 0){
      errorMsg += "Please Select your degree. <br/>";
      errorFound = true;
   }

   if(arrSelectedDocSpeciality.length == 0){
      errorMsg += "Please Select your speciality. <br/>";
      errorFound = true;
   }



   if (errorFound) {
      errorMsg = "There are following errors -  <br/>" + errorMsg;
      setErrorHeader(errorMsg);
      window.scrollTo(0, document.body.scrollHeight);
      return false;
   }
   msgHeader.style.display = "none";

   return true;
}


function setSuccessHeader(msg) {
   msgHeader.classList.remove("errorBorder");
   msgHeader.style.display = "block";
   imgHeader.setAttribute("src", "img_ok.png");
   actionMsg.innerHTML = msg;
   msgHeader.classList.add("successBorder");
}
function setErrorHeader(msg) {

   msgHeader.classList.remove("successBorder");
   msgHeader.style.display = "block";
   imgHeader.setAttribute("src", "img_error.png");
   actionMsg.innerHTML = msg;
   msgHeader.classList.add("errorBorder");

}


btnSubmit.addEventListener("click", function () {
   console.log("clicked update");

   if (!bUpdate) {
      registerSeller();
   }
   else {


      updateSellerDetails();

   }
});

function registerSeller() {


   console.log("before validation");
   if (validateFormDetails() == false) {
      return;
   }

   mAreaPin = txtPincode.value.substring(0, 3);
   console.log(mAreaPin);

   if (bUpdate) {

      updateSellerDetails();
      return;
   }
   divProgress.style.display = "block";
   divContent.style.display = "none";

   var citySeller = true;
   if (citySeller) {
      shop_opening_time = txtOpeningTime.value;
      shop_closing_time = txtClosingTime.value;
     
   }
   else {

      shop_opening_time = null;
      shop_closing_time = null;
    

   }

   saveSellerDetails().then(() => {
      sendWelcomeEmail();
   })

   // if (rbCityNo.checked) {
   //    saveSellerDetails().then(() => {
   //       sendWelcomeEmail();
   //    });
   // }
   // else {
   //    saveShopDetail().then(() => {
   //       saveSellerDetails().then(() => {
   //          sendWelcomeEmail();

   //       });
   //    });
   // }


}

function loadSellerDetails(sellerid) {
   return new Promise((resolve, reject) => {

      var docRef = firebase.firestore().collection("doctor").doc(sellerid);

      docRef.get().then(function (doc) {
         if (doc.exists) {
            mSeller = doc.data();
            resolve();
         } else {
            mSeller = null;
            resolve();
         }
      }).catch(function (error) {
         console.log("Error getting document:", error);
         reject();
      });

   })

}

function updateGSTURL() {
   var washingtonRef = firebase.firestore().collection("doctor").doc(mSeller.seller_id);

   // Set the "capital" field of the city 'DC'
   return washingtonRef.update({
      gst_url: gstURL
   })
      .then(function () {
         console.log("Document successfully updated!");
      })
      .catch(function (error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });

}

function updateChequeURL() {
   var washingtonRef = firebase.firestore().collection("doctor").doc(mSeller.seller_id);

   // Set the "capital" field of the city 'DC'
   return washingtonRef.update({
      cheque_url: chequeURL
   })
      .then(function () {
         console.log("Document successfully updated!");
      })
      .catch(function (error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });

}

function updateSellerDetails() {

   if (validateFormDetails() == false) {
      return;
   }

   for(var i = 0; i < degreeCheckboxes.length; i++)  
   {  
       if (degreeCheckboxes[i].checked) {
           console.log(degreeCheckboxes[i].value);
           selectedDegrees.push(degreeCheckboxes[i].value);
       }
   }  

   var checkedSpecialities = 0;  
   for(var i = 0; i < specialityCheckboxes.length; i++)  
   {  
       if (specialityCheckboxes[i].checked) {
           console.log(specialityCheckboxes[i].value);
           selectedSpecialities.push(specialityCheckboxes[i].value);
       }
   }      

   mAreaPin = txtPincode.value.substring(0, 3);
   console.log(mAreaPin);

   var accountType = "savings";
   if (rbCurrent.checked) {
      accountType = "current";
   }

   var citySeller = true;
   if (citySeller) {
      shop_opening_time = txtOpeningTime.value;
      shop_closing_time = txtClosingTime.value;
     
   }
   else {

      shop_opening_time = null;
      shop_closing_time = null;
     
   

   }
   var status;
   if (mSeller.status == "approved") {
      status = "approved";
   } else {
      status = "pending";
   }

   divProgress.style.display = "block";
   divContent.style.display = "none";


   var washingtonRef = firebase.firestore().collection("doctor").doc(mSeller.seller_id);

   // Set the "capital" field of the city 'DC'
   return washingtonRef.update({
      seller_name: txtNmae.value,
      mobile: txtMobile.value,
      company_name: txtCompanyName.value,
      address_line1: txtAddressLine1.value,
      address_line2: txtAddressLine2.value,
      address_line3: txtAddressLine3.value,
      city: txtCity.value,
      state: cmbState.value,
      pincode: txtPincode.value,
      seller_area_pin: mAreaPin,
      gstin: txtGST.value,
      pan_no: txtPANCardNo.value,
      degrees: arrSelectedDoctorDegree,
      speciality: arrSelectedDocSpeciality,
      educationCollege: txtEducationCollege.value,
      hospitalsServing: txtHospitalServing.value,
      account_holder_name: txtAccountHolderName.value,
      account_no: txtAccountNumber.value,
      bank_name: txtBankName.value,
      ifsc: txtIFSCCode.value,
      accountType: accountType,
      merchant_id: txtMerchantId.value,
      shop_opening_time: shop_opening_time,
      shop_closing_time: shop_closing_time,

      status: status,
      doctor_img_url: url_Carousel_Img1,
      logo_url: url_Carousel_Img2,
      degree_url: url_Carousel_Img3,
      about_doctor: txtAboutShop.value,
      suspension_reason: null,
   })
      .then(function () {

         divProgress.style.display = "none";
         divContent.style.display = "block";

         if (mSeller.status != "approved") {
            window.location.href = "seller_approval.html?sellerid=" + mSeller.seller_id + "&merchant_id=" + mSeller.merchant_id
               + "&name=" + mSeller.company_name + "&status=pending"
               + "&rejection_reason=null";
         }
         else {
            window.location.href = "home.html?sellerid=" + sellerId;
         }

         console.log("Document successfully updated!");

      })
      .catch(function (error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });

}

// function loadShopDetails(sellerid) {


//    return new Promise((resolve, reject) => {

//       var docRef = firebase.firestore().collection("shops").doc(sellerid);

//       docRef.get().then(function (doc) {

//          if (doc.exists) {
//             mShop = doc.data();
//             resolve();

//          } else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//             resolve();
//          }
//       }).catch(function (error) {
//          console.log("Error getting document:", error);
//          reject();
//       });

//    })


// }

function saveSellerDetails() {

   return new Promise((resolve, reject) => {

      var accountType = "savings";
      if (rbCurrent.checked) {
         accountType = "current";
      }

      var citySeller = true;

      firebase.firestore().collection('doctor').doc(sellerId).set({
         seller_id: sellerId,
         seller_name: txtNmae.value,
         email: email,
         mobile: txtMobile.value,
         company_name: txtCompanyName.value,
         address_line1: txtAddressLine1.value,
         address_line2: txtAddressLine2.value,
         address_line3: txtAddressLine3.value,
         city: txtCity.value,
         state: cmbState.value,
         pincode: txtPincode.value,
         seller_area_pin: mAreaPin,
         gstin: txtGST.value,
         pan_no: txtPANCardNo.value,
         account_holder_name: txtAccountHolderName.value,
         account_no: txtAccountNumber.value,
         bank_name: txtBankName.value,
         ifsc: txtIFSCCode.value,
         accountType: accountType,
         merchant_id: txtMerchantId.value,
         degrees: arrSelectedDoctorDegree,
         speciality: arrSelectedDocSpeciality,
         educationCollege: txtEducationCollege.value,
         hospitalsServing: txtHospitalServing.value,
         status: "pending",
         suspension_reason: null,
         gst_url: gstURL,
         cheque_url: chequeURL,
         subscription_start_date: null,
         subscription_end_date: null,
         subscription_amount: null,
         subscription_payment_id: null,
         subscription_type: null,
         shop_opening_time: shop_opening_time,
         shop_closing_time: shop_closing_time,
      
         doctor_img_url: url_Carousel_Img1,
         logo_url: url_Carousel_Img2,
         degree_url: url_Carousel_Img3,
         about_doctor: txtAboutShop.value,
         timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function () {
         divProgress.style.display = "none";
         resolve();

         //doc succesfully written. now land him to main page

         //window.location.reload(true);
      }).catch(function (error) {
         console.error('Error writing new message to database', error);
         reject();
      });

   })


}

// function saveShopDetail() {

//    return new Promise((resolve, reject) => {

//       firebase.firestore().collection('shops').doc(sellerId).set({
//          seller_id: sellerId,
//          Name: txtCompanyName.value,
//          Phone: txtMobile.value,
//          AddressLine1: txtAddressLine1.value,
//          AddressLine2: txtAddressLine2.value,
//          AddressLine3: txtAddressLine3.value,
//          Avg_Rating: 3,
//          Pincode: txtPincode.value,
//          City: txtCity.value,
//          Shop_Opening_Time: txtOpeningTime.value,
//          Shop_Closing_Time: txtClosingTime.value,
//          Offers: txtOffer.value,
//          Products: null,
//          product_price_map: null,

//       }).then(function () {
//          resolve();
//       }).catch(function (error) {
//          console.error('Error writing new message to database', error);
//          reject();
//       });

//    })
// }

function sendWelcomeEmail() {

   var msg = "<h3>Hello " + txtCompanyName.value + "</h3>"
      + "<p>Greetings from My Rupeaze!!</p>"
      + "<p>We have recieved your request. We will cross verify the details provided by you. We hope you have uploaded correct GST certificate and Cancelled Cheque.</p>"
      + "<p>Once your request is approved you will be eligible for selling your products at our platform.</p>"
      + "<p>My rupeaze believes in providing end-to-end support to all our sellers. Once your request is approved our team will get in touch to assist you further with the onboarding process. We look forward to having you onboard!</p>"
      + "<p>For further assistance, please contact us on our toll free number - <b> 1800 212 1484 </b></p>"
      + "<p>With Kind Regards,<br/>"
      + "My Rupeaze Team </p>";

   sendEmail(txtEmail.value, "My Rupeaze: Your Request Under Review", msg);

   window.location.href = "seller_approval.html?sellerid=" + sellerId + "&merchant_id=" + txtMerchantId.value
      + "&name=" + txtNmae.value + "&status=pending"
      + "&rejection_reason=null";

}

btnViewGST.addEventListener("click", function () {

   var link = document.createElement("a");
   if (link.download !== undefined) {
      link.setAttribute("href", mSeller.gst_url);
      link.setAttribute("target", "_blank");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }

})

btnViewCancelledCheque.addEventListener("click", function () {
   var link = document.createElement("a");
   if (link.download !== undefined) {
      link.setAttribute("href", mSeller.cheque_url);
      link.setAttribute("target", "_blank");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }
})

firebase.firestore().collection("doctor_degrees").doc("anUVt5alS2ZMpFMjFiVX").get().then(queryResult =>{
   var document = queryResult.data();
   arrDoctorDegree = document.doc_degrees;
   createDegreeCheckBoxes(arrDoctorDegree);
});

firebase.firestore().collection("doctor_specialities").doc("l1Lgq8cbgOjWtvT5E37b").get().then(queryResult =>{
   var document = queryResult.data();
   arrDoctorSpeciality = document.doc_specialities;
   createSpecialityCheckBoxes(arrDoctorSpeciality);
});
   



function deleteElements(parentElement) {
   //e.firstElementChild can be used. 
   var child = parentElement.lastElementChild;
   while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
   }
}


function createDegreeCheckBoxes(degree){
   deleteElements(degree);
   

   for (var i = 0; i < degree.length; i++) {
      var subCategory = degree[i];
      if (subCategory.toUpperCase().trim() == "ALL") {
         continue;
      }

      var divCheckbox = document.createElement("div");
      var inputElement = document.createElement("input");
      inputElement.setAttribute("type", "checkbox");
      inputElement.setAttribute("id", i.toString());
      inputElement.classList.add("form-check-input");
      degreeCheckboxes.push(inputElement);

      var labelElemet = document.createElement("label");
      labelElemet.classList.add("form-check-label");
      labelElemet.setAttribute("id", i.toString());
      labelElemet.textContent = subCategory;
      arrDegreeLabels.push(labelElemet);

      divCheckbox.appendChild(inputElement);
      divCheckbox.appendChild(labelElemet);
      divDoctorDegree.appendChild(divCheckbox);
     

      inputElement.addEventListener("change", function () {

         if (this.checked) {
            var id = this.id;
            var le = null;
            for (var i = 0; i < arrDegreeLabels.length; i++) {
               var label = arrDegreeLabels[i];
               console.log(label.id);
               if (label.id == id) {
                  le = label;
                  break;
               }
            }
               arrSelectedDoctorDegree.push(le.textContent);
               console.log(arrSelectedDoctorDegree);
         }
      })
   }
}

function createSpecialityCheckBoxes(specialities){

   deleteElements(specialities);

   for (var j = 0; j < specialities.length; j++) {
      var speciality = specialities[j];
      if (speciality.toUpperCase().trim() == "ALL") {
         continue;
      }

      var divSpecialityBox = document.createElement("div");
      var inputSpeciality = document.createElement("input");
      inputSpeciality.setAttribute("type", "checkbox");
      inputSpeciality.setAttribute("id", j.toString());
      inputSpeciality.classList.add("form-check-input");
      specialityCheckboxes.push(inputSpeciality);

      var elementLabel = document.createElement("label");
      elementLabel.classList.add("form-check-label");
      elementLabel.setAttribute("id", j.toString());
      elementLabel.textContent = speciality;
      arrSpecialityLabels.push(elementLabel);

      divSpecialityBox.appendChild(inputSpeciality);
      divSpecialityBox.appendChild(elementLabel);
      divDoctorSpeciality.appendChild(divSpecialityBox);
     

      inputSpeciality.addEventListener("change", function () {

         if (this.checked) {
            var id = this.id;
            var le = null;
            for (var j = 0; j < arrSpecialityLabels.length; j++) {
               var label = arrSpecialityLabels[j];
               console.log(label.id);
               if (label.id == id) {
                  le = label;
                  break;
               }
            }
            arrSelectedDocSpeciality.push(le.textContent);
            console.log(arrSelectedDocSpeciality);
         }
      })



    
   }
}

// function createSubCategoryCheckBoxes(arrSubCategories, type) {

//    arrLabels = [];
//    checkBoxes = [];
//    deleteElements(arrSubCategories);
   

//    for (var i = 0; i < arrSubCategories.length; i++) {
//       var subCategory = arrSubCategories[i];
//       if (subCategory.toUpperCase().trim() == "ALL") {
//          continue;
//       }

//       var divCheckbox = document.createElement("div");
//       var inputElement2 = document.createElement("input");
//       inputElement2.setAttribute("type", "checkbox");
//       inputElement2.setAttribute("id", i.toString());
//       inputElement2.classList.add("form-check-input");
//       checkBoxes.push(inputElement2);

//       var labelElemet = document.createElement("label");
//       labelElemet.classList.add("form-check-label");
//       labelElemet.setAttribute("for", i.toString());
//       labelElemet.setAttribute("id", i.toString());
//       labelElemet.textContent = subCategory;
//       arrLabels.push(labelElemet);

//       divCheckbox.appendChild(inputElement2);
//       divCheckbox.appendChild(labelElemet);
//       if(type == "degree"){
//          divDoctorDegree.appendChild(divCheckbox);
//       }
//       else if(type == "speciality"){
//          divDoctorSpeciality.appendChild(divCheckbox);
//       }
     


//       inputElement2.addEventListener("change", function () {

//          if (this.checked) {
//             var id = this.id;
//             var le = null;
//             for (var i = 0; i < arrLabels.length; i++) {
//                var label = arrLabels[i];
//                if (label.id == id) {
//                   le = label;
//                   break;
//                }
//             }
//                arrSelectedDoctorDegree.push(le.textContent);
//          }
//       })
//    }
// }
   


function loadDoctorDegree() {
   return new Promise((resolve, reject) => {
      firebase.firestore().collection("doctor_degrees")
         .get()
         .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
               // doc.data() is never undefined for query doc snapshots
               arrDoctorDegree = doc.data();
            });
         })
         .then(function () {
            resolve();
         })
         .catch(function (error) {
            console.log("Error getting documents: ", error);
            reject();
         });


   })
}

function loadDoctorspeciality() {
   return new Promise((resolve, reject) => {
      firebase.firestore().collection("doctor_specialities")
         .get()
         .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
               // doc.data() is never undefined for query doc snapshots
               arrDoctorSpeciality = doc.data();
            });
         })
         .then(function () {
            resolve();
         })
         .catch(function (error) {
            console.log("Error getting documents: ", error);
            reject();
         });


   })
}

function logOut() {
   firebase.auth().signOut().then(function () {
       window.location.href = "seller_login.html";
   }).catch(function (error) {
       // An error happened.
   });


}


