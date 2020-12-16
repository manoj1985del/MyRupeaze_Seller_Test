var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var cmbProductCategory = document.getElementById("productCategory");
var txtSubCategory = document.getElementById("txtSubCategory");
var table = document.getElementById("tbl");
var btnSubmit = document.getElementById("btnSubmit");


var inpFile_CarouselImage1 = document.getElementById("inpFile_CarouselImage1");
var imagePreview_CarouselImage1Container = document.getElementById("imagePreview_CarouselImage1");
var previewImage_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_image");
var previewText_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_default-text");
var btnUploadCarouselImage1 = document.getElementById("btnUploadCarouselImage1");
var imgProgressCarouselImage1 = document.getElementById("imgProgressCarouselImage1");
var uploadMsgCarouselImage1 = document.getElementById("uploadMsgCarouselImage1");


var arrSubCategories = [];
var arrImages = [];

var mSelectedCateogry = null;
var fileCarousel_Img1;
var url_Carousel_Img1 = null;

divProgress.style.display = "none";
divContent.style.display = "block";
cmbProductCategory.addEventListener("change", function () {
    loadSubCategories(cmbProductCategory.value);
});


setImage(inpFile_CarouselImage1, previewImage_CarouselImage1, previewText_CarouselImage1, "fileCarousel_Img1");

btnUploadCarouselImage1.addEventListener("click", function () {
    if (arrSubCategories.includes(cmbProductCategory.value)) {
        alert("This subcategory is already present");
        return;
    }
    uploadFile(fileCarousel_Img1, imgProgressCarouselImage1, uploadMsgCarouselImage1, url_Carousel_Img1, cmbProductCategory.value, txtSubCategory.value);
});

btnSubmit.addEventListener("click", function(){

    if(url_Carousel_Img1 != null){
        arrImages.push(imgUrl);
        arrSubCategories.push(txtSubCategory.value);

        if(arrImages.length == 1){
            saveSubCategory();
        }
        else{
            upddateSubCategory();
        }
    }

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
        url_Carousel_Img1 = imgUrl;
    })
}

function saveImageAtFirebase(file, groupname) {
    imgUrl = null;
    var imagePath = "subcategories" + '/' + groupname + '/' + file.name;
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




function loadSubCategories(category) {

    arrImages = [];
    arrSubCategories = [];
    var docRef = firebase.firestore().collection("categories").doc(category);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            mSelectedCateogry = doc.data();
            for (var i = 0; i < mSelectedCateogry.sub_categories.length; i++) {
                arrSubCategories.push(mSelectedCateogry.sub_categories[i]);
                arrImages.push(mSelectedCateogry.img_url[i]);

                drawTable();
            }

            if(arrSubCategories.length == 0){
                deleteTableRows();
            }

        } else {
            // doc.data() will be undefined in this case
            deleteTableRows();
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}

function createTableHeaders() {
    var tr = document.createElement('tr');

    var imageHeader = document.createElement("th");
    var categoryHeader = document.createElement('th');
    var actionHeader = document.createElement('th');

    imageHeader.innerHTML = "Image";
    categoryHeader.innerHTML = "SubCategory";
    actionHeader.innerHTML = "Action";

    tr.appendChild(imageHeader);
    tr.appendChild(categoryHeader);
    tr.appendChild(actionHeader);
    table.appendChild(tr);
}

function drawTable() {

    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < arrSubCategories.length; i++) {

        var imgUrl = arrImages[i];
        var subCategory = arrSubCategories[i];

        var tr = document.createElement('tr');

        var tdImage = document.createElement('td');
        var tdCategory = document.createElement('td');
        var tdAction = document.createElement('td');

        var divImage = document.createElement("div");
        var imgCategory = document.createElement("img");
        imgCategory.setAttribute("src", imgUrl);
        imgCategory.style.width = "50px";
        imgCategory.style.height = "50px";
        divImage.appendChild(imgCategory);


        var divSubCategory = document.createElement('div');
        var spanSubCategory = document.createElement("span");
        spanSubCategory.innerHTML = subCategory;
        divSubCategory.appendChild(spanSubCategory);

        var divAction = document.createElement("div");
        var divDelete = document.createElement("div");
        var btnDeleteListing = document.createElement("button");
        btnDeleteListing.setAttribute("id", i.toString());
        btnDeleteListing.textContent = "Delete SubCategory";
        btnDeleteListing.style.width = "150px";
        divDelete.appendChild(btnDeleteListing);
        divAction.appendChild(divDelete);

        tdImage.appendChild(divImage);
        tdCategory.appendChild(divSubCategory);
        tdAction.appendChild(divAction);

        tr.appendChild(tdImage);
        tr.appendChild(tdCategory);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnDeleteListing.addEventListener("click", function(){
            if (confirm("You are going to delete a subcategory. Do you wish to continue?")) {
                var index = parseInt(this.id);
                arrSubCategories.splice(index, 1);
                arrImages.splice(index, 1);

                upddateSubCategory();
              
            
            }
        })



    }

}

function upddateSubCategory() {
    var washingtonRef = firebase.firestore().collection("categories").doc(cmbProductCategory.value);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        Category: cmbProductCategory.value,
        sub_categories: arrSubCategories,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbProductCategory.value);

        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function saveSubCategory() {
    var washingtonRef = firebase.firestore().collection("categories").doc(cmbProductCategory.value);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.set({
        Category: cmbProductCategory.value,
        sub_categories: arrSubCategories,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbProductCategory.value);

        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}



