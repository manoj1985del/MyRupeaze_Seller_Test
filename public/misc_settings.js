var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');

var txtVersionCode = document.getElementById('txtVersionCode');
var cmbForceUpdate = document.getElementById('cmbForceUpdate');

var txtDoctorCommision = document.getElementById('txtDoctorCommision');
var txtPharmaCommision = document.getElementById('txtPharmaCommision');

//var txtAddNewSlot = document.getElementById('txtAddNewSlot');
//var btnAddNewSlot = document.getElementById('btnAddNewSlot');
//var tblSlots = document.getElementById('tblSlots');

var txtDoctorDegree = document.getElementById('txtDoctorDegree');
var btnAddDegree = document.getElementById('btnAddDegree');
var tblDegree = document.getElementById('tblDegree');

var txtAddDoctorSpeciality = document.getElementById('txtAddDoctorSpeciality');
var btnAddSpeciality = document.getElementById('btnAddSpeciality');
var tblSpeciality = document.getElementById('tblSpeciality');

var inpFile_Speciality_image = document.getElementById("inpFile_Speciality_image");
var imagePreview_SpecialityContainer = document.getElementById("imagePreview_Speciality_image");
var previewImage_Speciality_image = imagePreview_SpecialityContainer.querySelector(".image-preview_image");
var previewText_Speciality_image = imagePreview_SpecialityContainer.querySelector(".image-preview_default-text");
var btnUploadSpecialityImage = document.getElementById("btnUploadSpecialityImage");
var imgProgressSpecialityImage = document.getElementById("imgProgressSpecialityImage");
var uploadMsgSpecialityImage = document.getElementById("uploadMsgSpecialityImg");

var txtAddPharmaCategory = document.getElementById('txtAddPharmaCategory');
var btnAddPharmaCategory = document.getElementById('btnAddPharmaCategory');
var tblPharmaCategories = document.getElementById('tblPharmaCategories');

var btnUpdate = document.getElementById('btnUpdate');

var fileSpecialityImage;
var urlSpecialityImage = null;
var arrSpecialityImages = [];
var mSettings = null;

getSettings().then(() => {
    updateUI();
})

setImage(inpFile_Speciality_image, previewImage_Speciality_image, previewText_Speciality_image, "fileSpecialityImage");

// btnAddNewSlot.addEventListener("click", function () {
//     mSettings.slot_timings.push(txtAddNewSlot.value);
//     mSettings.availability.push("A");
//     createSlotTable();
//     txtAddNewSlot.value = "";
// })

btnAddDegree.addEventListener("click", function () {
    mSettings.doctor_degrees.push(txtDoctorDegree.value);
    createDegreeTable();
    txtDoctorDegree.value = "";
})

btnAddSpeciality.addEventListener("click", function () {
    mSettings.doctor_specialities.push(txtAddDoctorSpeciality.value);
    createSpecialitytable();
    txtAddDoctorSpeciality.value = "";
})

btnAddPharmaCategory.addEventListener("click", function () {
    mSettings.pharma_categories.push(txtAddPharmaCategory.value);
    createPharmaCategoryTable();
    txtAddPharmaCategory.value = "";
})

btnUploadSpecialityImage.addEventListener("click", function () {
    uploadFile(fileSpecialityImage, imgProgressSpecialityImage, uploadMsgSpecialityImage, urlSpecialityImage, "speciality");
});

btnUpdate.addEventListener("click", function () {
    updateDetails();
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
            fileSpecialityImage = file;
        }
        else {
            previewImage.style.display = null;
            previewImageDeraultText.style.display = null;
        }
    });
}

function uploadFile(file, imgProgress, msgUpload, url, groupName) {

    if (file == null) {
        alert("Please select file to upload");
        return;
    }

    console.log(file.size);

    if (file.size > 200000) {
        alert("File cannot be more than 200 KB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }

    imgProgress.style.display = "block";

    saveImageAtFirebase(file, groupName).then(() => {
        imgProgress.style.display = "none";
        msgUpload.style.display = "block";
        urlSpecialityImage = imgUrl;
        arrSpecialityImages.push(imgUrl);
    })
}

function saveImageAtFirebase(file, groupname) {
    imgUrl = null;
    var imagePath = "AppInfo" + '/' + "doctor_specialities" + '/' + file.name;
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


function createSlotTableHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSlotTiming = document.createElement("th");
    thSlotTiming.textContent = "Slot Timing";

    var thSlotAvailable = document.createElement("th");
    thSlotAvailable.textContent = "Slot Availability";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSlotTiming);
    tr.appendChild(thSlotAvailable);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblSlots.appendChild(tHead);

}

function createSlotTable() {

    deleteTableRows(tblSlots);
    createSlotTableHeaders();

    for (var i = 0; i < mSettings.slot_timings.length; i++) {
        var slotName = mSettings.slot_timings[i];
        var slotAvailable = mSettings.availability[i];

        var tr = document.createElement('tr');
        var tdSlotTiming = document.createElement('td');
        var tdSlotAvailable = document.createElement('td');
        var tdAction = document.createElement('td');

        var divSlotTiming = document.createElement('div');
        var spanSlotTiming = document.createElement('span');
        spanSlotTiming.innerHTML = slotName;
        divSlotTiming.appendChild(spanSlotTiming);
        tdSlotTiming.appendChild(divSlotTiming);

        var divSlotAvailable = document.createElement('div');
        var spanSlotAvailable = document.createElement('span');
        spanSlotAvailable.innerHTML = slotAvailable;
        divSlotAvailable.appendChild(spanSlotAvailable);
        tdSlotAvailable.appendChild(divSlotAvailable);

        var divAction = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.textContent = "Delete Slot";
        var id = i.toString();
        btnDelete.setAttribute("id", id);
        btnDelete.setAttribute("type", "button");
        divAction.appendChild(btnDelete);

        var divMarkAvailable = document.createElement('div');
        var btnMarkAvailable = document.createElement("button");
        btnMarkAvailable.style.width = "150px";
        if (slotAvailable == "A") {
            btnMarkAvailable.textContent = "Mark UnAvailable";
        }
        else {
            btnMarkAvailable.textContent = "Mark Available";
        }
        divMarkAvailable.style.marginTop = "10px";
        var id = i.toString();
        btnMarkAvailable.setAttribute("id", id);
        btnMarkAvailable.setAttribute("type", "button");
        divMarkAvailable.appendChild(btnMarkAvailable);
        divAction.appendChild(divMarkAvailable);

        tdAction.appendChild(divAction);

        tr.appendChild(tdSlotTiming);
        tr.appendChild(tdSlotAvailable);
        tr.appendChild(tdAction);
        tblSlots.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);

            mSettings.slot_timings.splice(index, 1);
            mSettings.availability.splice(index, 1);
            createSlotTable();
        })

        btnMarkAvailable.addEventListener("click", function () {
            var index = parseInt(this.id);
            if (mSettings.availability[index] == "A") {
                mSettings.availability[index] = "NA";
            }
            else {
                mSettings.availability[index] = "A";
            }

            createSlotTable();
        })
    }
}

function createDegreeTableHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thDoctorDegree = document.createElement("th");
    thDoctorDegree.textContent = "Doctor Degree";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thDoctorDegree);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblDegree.appendChild(tHead);

}

function createDegreeTable() {

    deleteTableRows(tblDegree);
    createDegreeTableHeaders();

    for (var i = 0; i < mSettings.doctor_degrees.length; i++) {

        var doctorDegree = mSettings.doctor_degrees[i];

        var tr = document.createElement('tr');
        var tdDoctorDegree = document.createElement('td');
        var tdAction = document.createElement('td');

        var divDoctorDegree = document.createElement('div');
        var spanDoctorDegree = document.createElement('span');
        spanDoctorDegree.innerHTML = doctorDegree;
        divDoctorDegree.appendChild(spanDoctorDegree);
        tdDoctorDegree.appendChild(divDoctorDegree);

        var divAction = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.textContent = "Delete Degree";
        var id = i.toString();
        btnDelete.setAttribute("id", id);
        btnDelete.setAttribute("type", "button");
        divAction.appendChild(btnDelete);

        tdAction.appendChild(divAction);

        tr.appendChild(tdDoctorDegree);
        tr.appendChild(tdAction);
        tblDegree.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            mSettings.doctor_degrees.splice(index, 1);
            createDegreeTable();
        })
    }
}

function createSpecialityTableHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thSpecialityImg = document.createElement("th");
    thSpecialityImg.textContent = "Speciality Image";

    var thDoctorSpeciality = document.createElement("th");
    thDoctorSpeciality.textContent = "Doctor Speciality";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thSpecialityImg);
    tr.appendChild(thDoctorSpeciality);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblSpeciality.appendChild(tHead);
}

function createSpecialitytable() {

    deleteTableRows(tblSpeciality);
    createSpecialityTableHeaders();

    for (var i = 0; i < mSettings.doctor_specialities.length; i++) {

        var doctorSpeciality = mSettings.doctor_specialities[i];
        var specialityImgUrl = arrSpecialityImages[i];

        var tr = document.createElement('tr');
        var tdSpecialityImg = document.createElement('td');
        var tdDoctorDegree = document.createElement('td');
        var tdAction = document.createElement('td');

        var divSpecialityImg = document.createElement('div');
        var specialityImg = document.createElement("img");
        specialityImg.style.width = "200px"
        specialityImg.style.height = "200px"
        specialityImg.src = specialityImgUrl;
        divSpecialityImg.appendChild(specialityImg);
        tdSpecialityImg.appendChild(divSpecialityImg);

        var divDoctorDegree = document.createElement('div');
        var spanDoctorDegree = document.createElement('span');
        spanDoctorDegree.innerHTML = doctorSpeciality;
        divDoctorDegree.appendChild(spanDoctorDegree);
        tdDoctorDegree.appendChild(divDoctorDegree);

        var divAction = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.textContent = "Delete Speciality";
        var id = i.toString();
        btnDelete.setAttribute("id", id);
        btnDelete.setAttribute("type", "button");
        divAction.appendChild(btnDelete);

        tdAction.appendChild(divAction);

        tr.appendChild(tdSpecialityImg);
        tr.appendChild(tdDoctorDegree);
        tr.appendChild(tdAction);
        tblSpeciality.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            mSettings.doctor_specialities.splice(index, 1);
            arrSpecialityImages.splice(index, 1);
            createSpecialitytable();
        })
    }
}

function createPharmaCategoryHeaders() {

    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");

    var thPharmaCategory = document.createElement("th");
    thPharmaCategory.textContent = "Pharma Category";

    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thPharmaCategory);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    tblPharmaCategories.appendChild(tHead);

}

function createPharmaCategoryTable() {
    deleteTableRows(tblPharmaCategories);
    createPharmaCategoryHeaders();

    for (var i = 0; i < mSettings.pharma_categories.length; i++) {

        var pharmaCategory = mSettings.pharma_categories[i];

        var tr = document.createElement('tr');
        var tdPharmaCategory = document.createElement('td');
        var tdAction = document.createElement('td');

        var divPharmaCategory = document.createElement('div');
        var spanPharmaCategory = document.createElement('span');
        spanPharmaCategory.innerHTML = pharmaCategory;
        divPharmaCategory.appendChild(spanPharmaCategory);
        tdPharmaCategory.appendChild(divPharmaCategory);

        var divAction = document.createElement("div");
        var btnDelete = document.createElement("button");
        btnDelete.style.width = "150px";
        btnDelete.textContent = "Delete Category";
        var id = i.toString();
        btnDelete.setAttribute("id", id);
        btnDelete.setAttribute("type", "button");
        divAction.appendChild(btnDelete);

        tdAction.appendChild(divAction);

        tr.appendChild(tdPharmaCategory);
        tr.appendChild(tdAction);
        tblPharmaCategories.appendChild(tr);

        btnDelete.addEventListener("click", function () {
            var index = parseInt(this.id);
            mSettings.pharma_categories.splice(index, 1);
            createPharmaCategoryTable();
        })
    }
}

function deleteTableRows(tbl) {
    var child = tbl.lastElementChild;
    while (child) {
        tbl.removeChild(child);
        child = tbl.lastElementChild;
    }
}

function updateUI() {

    arrSpecialityImages = mSettings.doctor_speciality_img;

    console.log(arrSpecialityImages);

    txtVersionCode.value = mSettings.medical_version;
    txtDoctorCommision.value = parseFloat(mSettings.doctor_commission);
    txtPharmaCommision.value = parseFloat(mSettings.pharma_commission);

    if (mSettings.medical_force_update) {
        cmbForceUpdate.value = "Yes";
    }
    else {
        cmbForceUpdate.value = "No";
    }

    arrSpecialityImages = mSettings.doctor_speciality_img;

    // if (mSettings.slot_timings.length != 0) {
    //     createSlotTable();
    // }

    if (mSettings.doctor_degrees.length != 0) {
        createDegreeTable();
    }

    if (mSettings.doctor_specialities.length != 0 && arrSpecialityImages.length != 0) {
        createSpecialitytable();
    }

    if (mSettings.pharma_categories.length != 0) {
        createPharmaCategoryTable();
    }

}


function getSettings() {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("AppInfo").doc("AppInfo");
        docRef.get().then(function (doc) {
            if (doc.exists) {
                mSettings = doc.data();
                resolve();
            } else {
                seller = null;
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

function updateDetails() {

    var docRef = firebase.firestore().collection("AppInfo").doc("AppInfo");
    var forceUpdate = false;
    if (cmbForceUpdate.value.toUpperCase() == "YES") {
        forceUpdate = true;
    }

    return docRef.update({
        doctor_commission: parseFloat(txtDoctorCommision.value),
        doctor_degrees: mSettings.doctor_degrees,
        medical_force_update: forceUpdate,
        medical_version: txtVersionCode.value,
        //slot_timings: mSettings.slot_timings,
        //availability: mSettings.availability,
        doctor_specialities: mSettings.doctor_specialities,
        doctor_speciality_img: arrSpecialityImages,
        pharma_commission: parseFloat(txtPharmaCommision.value),
        pharma_categories: mSettings.pharma_categories
    })
        .then(() => {
            alert("Update Successful");
            getSettings().then(() => {
                updateUI();
            })
        })
        .catch(function (error) {
            console.error("Error updating document: ", error);
        });

}

