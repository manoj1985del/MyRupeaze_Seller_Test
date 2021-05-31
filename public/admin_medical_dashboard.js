var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var cmbGroupType = document.getElementById("dashboardGroupType");
var cmbDashboardGroup = document.getElementById("dashboardGroup");
var txtGroupTitle = document.getElementById("txtGroupTitle")
var txtItemName = document.getElementById("txtItemName");
var txtItemTag = document.getElementById("txtItemTag");
var txtRating = document.getElementById("txtRating");
var txtRatingCount = document.getElementById("txtRatingCount");
var txtMRP = document.getElementById("txtMRP");
var txtOfferPrice = document.getElementById("txtOfferPrice");

var lblDashboardGroup = document.getElementById("lblDashboardGroup");
var lblTitle = document.getElementById("lblTitle");
var lblName = document.getElementById("lblName");
var lblTag = document.getElementById("lblTag");
var lblRating = document.getElementById("lblRating");
var lblRatingCount = document.getElementById("lblRatingCount");
var lblMrp = document.getElementById("lblMrp");
var lblOfferPrice = document.getElementById("lblOfferPrice");


var table = document.getElementById("tbl");
var btnSubmit = document.getElementById("btnSubmit");


var inpFile_CarouselImage1 = document.getElementById("inpFile_CarouselImage1");
var imagePreview_CarouselImage1Container = document.getElementById("imagePreview_CarouselImage1");
var previewImage_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_image");
var previewText_CarouselImage1 = imagePreview_CarouselImage1Container.querySelector(".image-preview_default-text");
var btnUploadCarouselImage1 = document.getElementById("btnUploadCarouselImage1");
var imgProgressCarouselImage1 = document.getElementById("imgProgressCarouselImage1");
var uploadMsgCarouselImage1 = document.getElementById("uploadMsgCarouselImage1");


var arrItemNames = [];
var arrItemTags = [];
var arrImages = [];
var arrItemRating = [];
var arrItemRatingCount = [];
var arrItemMRP = [];
var arrOfferPrice = [];

var groupTitle;

var mSelectedGroup = null;
var fileCarousel_Img1;
var url_Carousel_Img1 = null;

divProgress.style.display = "none";
divContent.style.display = "block";

cmbDashboardGroup.style.display = "none";
txtGroupTitle.style.display = "none";
txtItemName.style.display = "none";
txtItemTag.style.display = "none";
txtRating.style.display = "none";
txtRatingCount.style.display = "none";
txtMRP.style.display = "none";
txtOfferPrice.style.display = "none";

lblDashboardGroup.style.display = "none";
lblTitle.style.display = "none";
lblName.style.display = "none";
lblTag.style.display = "none";
lblRating.style.display = "none";
lblRatingCount.style.display = "none";
lblMrp.style.display = "none";
lblOfferPrice.style.display = "none";

btnSubmit.disabled = true;


var categoriesAdded = false;
var productsAdded = false;

cmbGroupType.addEventListener("change", function () {
    loadDashboardGroup(cmbGroupType.value);
});

cmbDashboardGroup.addEventListener("change", function () {
    loadSubCategories(cmbDashboardGroup.value);
});

function loadDashboardGroup(value){
    if(value == "Dashboard Categories"){
        if(categoriesAdded == false){

            categoriesAdded = true;

            cmbDashboardGroup.style.display = "block";
            txtGroupTitle.style.display = "block";
            txtItemName.style.display = "block";
            txtItemTag.style.display = "block";

            lblDashboardGroup.style.display = "block";
            lblTitle.style.display = "block";
            lblName.style.display = "block";
            lblTag.style.display = "block";

            txtRating.style.display = "none";
            txtRatingCount.style.display = "none";
            txtMRP.style.display = "none";
            txtOfferPrice.style.display = "none";

            lblRating.style.display = "none";
            lblRatingCount.style.display = "none";
            lblMrp.style.display = "none";
            lblOfferPrice.style.display = "none";

            var option1 = document.createElement("option");
            option1.text = "Group 1";
            cmbDashboardGroup.add(option1)

            var option2 = document.createElement("option");
            option2.text = "Group 4";
            cmbDashboardGroup.add(option2)

            var option3 = document.createElement("option");
            option3.text = "Group 6";
            cmbDashboardGroup.add(option3);

            btnSubmit.disabled = false;

        }
    }
    else if(value == "Dashboard Products"){
        if(productsAdded == false){

            productsAdded = true;

            cmbDashboardGroup.style.display = "block";
            txtGroupTitle.style.display = "block";
            txtItemName.style.display = "block";
            txtItemTag.style.display = "block";
            txtRating.style.display = "block";
            txtRatingCount.style.display = "block";
            txtMRP.style.display = "block";
            txtOfferPrice.style.display = "block";

            lblDashboardGroup.style.display = "block";
            lblTitle.style.display = "block";
            lblName.style.display = "block";
            lblTag.style.display = "block";
            lblRating.style.display = "block";
            lblRatingCount.style.display = "block";
            lblMrp.style.display = "block";
            lblOfferPrice.style.display = "block";

            var option4 = document.createElement("option");
            option4.text = "Group 2";
            cmbDashboardGroup.add(option4)

            var option5 = document.createElement("option");
            option5.text = "Group 3";
            cmbDashboardGroup.add(option5);

            var option6 = document.createElement("option");
            option6.text = "Group 5";
            cmbDashboardGroup.add(option6)

            btnSubmit.disabled = false;
            
        }
    }
}


setImage(inpFile_CarouselImage1, previewImage_CarouselImage1, previewText_CarouselImage1, "fileCarousel_Img1");

btnUploadCarouselImage1.addEventListener("click", function () {
    if (arrItemNames.includes(cmbDashboardGroup.value)) {
        alert("This item is already present");
        return;
    }
    uploadFile(fileCarousel_Img1, imgProgressCarouselImage1, uploadMsgCarouselImage1, url_Carousel_Img1, cmbDashboardGroup.value, txtItemName.value, txtItemTag.value);
});

btnSubmit.addEventListener("click", function(){

    if(url_Carousel_Img1 != null){
        arrImages.push(imgUrl);
        arrItemNames.push(txtItemName.value);
        arrItemTags.push(txtItemTag.value);

        if(cmbGroupType.value == "Dashboard Products"){
            arrItemRating.push(txtRating.value);
            arrItemRatingCount.push(txtRatingCount.value);
            arrItemMRP.push(txtMRP.value);
            arrOfferPrice.push(txtOfferPrice.value);
        }

        if(arrImages.length == 1){
            if(cmbGroupType.value == "Dashboard Categories"){
                
                saveGroupCategory();
            }
            else{
               
                saveGroupProduct();

            }
        }
        else{
            if(cmbGroupType.value == "Dashboard Categories"){
                updateGroupCategory();
                
            }
            else{
                updateGroupProduct();
            }
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

    if (file.size > 200000) {
        alert("File cannot be more than 200 KB");
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
    var imagePath = "medical_dashboard" + '/' + groupname + '/' + file.name;
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




function loadSubCategories(group) {

    arrImages = [];
    arrItemTags = [];
    arrItemNames = [];
    arrItemRating = [];
    arrItemRatingCount = [];
    arrItemMRP = [];
    arrOfferPrice = [];
    var docRef = firebase.firestore().collection("medical_dashboard").doc(group);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            mSelectedGroup = doc.data();

            for (var i = 0; i < mSelectedGroup.item_name.length; i++) {
                if(cmbGroupType.value == "Dashboard Products"){
                    arrItemNames.push(mSelectedGroup.item_name[i]);
                    arrItemTags.push(mSelectedGroup.item_tag[i]);
                    arrImages.push(mSelectedGroup.img_url[i]);
                    arrItemRating.push(mSelectedGroup.item_rating[i]);
                    arrItemRatingCount.push(mSelectedGroup.item_rating_count[i]);
                    arrItemMRP.push(mSelectedGroup.item_mrp[i]);
                    arrOfferPrice.push(mSelectedGroup.item_offer_price[i]);
                    drawTable();
                }
                else{
                    arrItemNames.push(mSelectedGroup.item_name[i]);
                    arrItemTags.push(mSelectedGroup.item_tag[i]);
                    arrImages.push(mSelectedGroup.img_url[i]);
                    drawTable();
                }
            }

            if(arrItemNames.length == 0){
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
    if(cmbGroupType.value == "Dashboard Products"){
        var tr = document.createElement('tr');

        var imageHeader = document.createElement("th");
        var nameHeader = document.createElement('th');
        var tagHeader = document.createElement('th');
        var ratingHeader = document.createElement('th');
        var ratingCountHeader = document.createElement('th');
        var mrpHeader = document.createElement('th');
        var offerPriceHeader = document.createElement('th');
        var actionHeader = document.createElement('th');

        imageHeader.innerHTML = "Image";
        nameHeader.innerHTML = "Item Name";
        tagHeader.innerHTML = "Item Tag";
        ratingHeader.innerHTML = "Item Rating";
        ratingCountHeader.innerHTML = "Rating count"
        mrpHeader.innerHTML = "Item MRP";
        offerPriceHeader.innerHTML = "Offer Price";
        actionHeader.innerHTML = "Action";
    
        tr.appendChild(imageHeader);
        tr.appendChild(nameHeader);
        tr.appendChild(tagHeader);
        tr.appendChild(ratingHeader);
        tr.appendChild(ratingCountHeader);
        tr.appendChild(mrpHeader);
        tr.appendChild(mrpHeader);
        tr.appendChild(offerPriceHeader);
        tr.appendChild(actionHeader);
        table.appendChild(tr);
    }
    else{
        var tr = document.createElement('tr');
        var imageHeader = document.createElement("th");
        var nameHeader = document.createElement('th');
        var tagHeader = document.createElement('th');
        var actionHeader = document.createElement('th');
    
        imageHeader.innerHTML = "Image";
        nameHeader.innerHTML = "Item Name";
        tagHeader.innerHTML = "Item Tag";
        actionHeader.innerHTML = "Action";
    
        tr.appendChild(imageHeader);
        tr.appendChild(nameHeader);
        tr.appendChild(tagHeader);
        tr.appendChild(actionHeader);
        table.appendChild(tr);
    }
}

function drawTable() {

    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < arrItemNames.length; i++) {

        var imgUrl = arrImages[i];
        var itemName = arrItemNames[i];
        var itemTag = arrItemTags[i];

        if(cmbGroupType.value == "Dashboard Products"){
            var imgUrl = arrImages[i];
            var itemName = arrItemNames[i];
            var itemTag = arrItemTags[i];
            var itemRating = arrItemRating[i];
            var itemRatingCount = arrItemRatingCount[i];
            var itemMRP = arrItemMRP[i];
            var itemOfferPrice = arrOfferPrice[i];
        }

        var tr = document.createElement('tr');

        var tdImage = document.createElement('td');
        var tdItemName = document.createElement('td');
        var tdItemTag = document.createElement('td');
        var tdAction = document.createElement('td');

        if(cmbGroupType.value == "Dashboard Products"){

            var tdItemRating = document.createElement('td');
            var tdRatingCount = document.createElement('td');
            var tdItemMRP = document.createElement('td');
            var tdOfferPrice = document.createElement('td');
        }

        var divImage = document.createElement("div");
        var imgItem = document.createElement("img");
        imgItem.setAttribute("src", imgUrl);
        imgItem.style.width = "50px";
        imgItem.style.height = "50px";
        divImage.appendChild(imgItem);


        var divItemName = document.createElement('div');
        var spanItemName = document.createElement("span");
        spanItemName.innerHTML = itemName;
        divItemName.appendChild(spanItemName);

        var divItemTag = document.createElement('div');
        var spanItemTag = document.createElement("span");
        spanItemTag.innerHTML = itemTag;
        divItemTag.appendChild(spanItemTag);

        if(cmbGroupType.value == "Dashboard Products"){

            var divItemRating = document.createElement('div');
            var spanItemRating = document.createElement("span");
            spanItemRating.innerHTML = itemRating;
            divItemRating.appendChild(spanItemRating);

            var divRatingCount = document.createElement('div');
            var spanRatingCount = document.createElement("span");
            spanRatingCount.innerHTML = itemRatingCount;
            divRatingCount.appendChild(spanRatingCount);

            var divItemMRP = document.createElement('div');
            var spanItemMRP = document.createElement("span");
            spanItemMRP.innerHTML = itemMRP;
            divItemMRP.appendChild(spanItemMRP);

            var divOfferPrice = document.createElement('div');
            var spanOfferPrice = document.createElement("span");
            spanOfferPrice.innerHTML = itemOfferPrice;
            divOfferPrice.appendChild(spanOfferPrice);

        }

       

        var divAction = document.createElement("div");
        var divDelete = document.createElement("div");
        var btnDeleteListing = document.createElement("button");
        btnDeleteListing.setAttribute("id", i.toString());
        btnDeleteListing.textContent = "Delete Item";
        btnDeleteListing.style.width = "150px";
        divDelete.appendChild(btnDeleteListing);
        divAction.appendChild(divDelete);

        if(cmbGroupType.value == "Dashboard Products"){
            tdImage.appendChild(divImage);
            tdItemName.appendChild(divItemName);
            tdItemTag.appendChild(divItemTag);
            tdItemRating.appendChild(divItemRating);
            tdRatingCount.appendChild(divRatingCount);
            tdItemMRP.appendChild(divItemMRP);
            tdOfferPrice.appendChild(divOfferPrice);
            tdAction.appendChild(divAction);
        }
        else{
            tdImage.appendChild(divImage);
            tdItemName.appendChild(divItemName);
            tdItemTag.appendChild(divItemTag);
            tdAction.appendChild(divAction);
    
        }

        if(cmbGroupType.value == "Dashboard Products"){
            tr.appendChild(tdImage);
            tr.appendChild(tdItemName);
            tr.appendChild(tdItemTag);
            tr.appendChild(tdItemRating);
            tr.appendChild(tdRatingCount);
            tr.appendChild(tdItemMRP);
            tr.appendChild(tdOfferPrice);
            tr.appendChild(tdAction);
        }
        else{
            tr.appendChild(tdImage);
            tr.appendChild(tdItemName);
            tr.appendChild(tdItemTag);
            tr.appendChild(tdAction);
        }

        table.appendChild(tr);

        btnDeleteListing.addEventListener("click", function(){
            if (confirm("You are going to delete an Item. Do you wish to continue?")) {
                var index = parseInt(this.id);

        

                if(cmbGroupType.value == "Dashboard Products"){
                    arrItemNames.splice(index, 1);
                    arrItemTags.splice(index, 1);
                    arrImages.splice(index, 1);
                    arrItemRating.splice(index, 1);
                    arrItemRatingCount.splice(index, 1);
                    arrItemMRP.splice(index, 1);
                    arrOfferPrice.splice(index, 1);
                    console.log(arrItemRating);
                    console.log(arrItemRatingCount);
                    console.log(arrItemMRP);
                    console.log(arrOfferPrice);
                    updateGroupProduct();
                }
                else{
                    arrItemNames.splice(index, 1);
                    arrItemTags.splice(index, 1);
                    arrImages.splice(index, 1);
                    updateGroupCategory();
                }
            }
        })



    }

}

function updateGroupCategory() {
    var washingtonRef = firebase.firestore().collection("medical_dashboard").doc(cmbDashboardGroup.value);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        group_title: txtGroupTitle.value,
        item_name: arrItemNames,
        item_tag: arrItemTags,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbDashboardGroup.value);
            alert("Group Updated");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function updateGroupProduct() {
    var washingtonRef = firebase.firestore().collection("medical_dashboard").doc(cmbDashboardGroup.value);

    // Set the "capital" field of the city 'DC'
    console.log(arrItemRating);
    console.log(arrItemRatingCount);
    console.log(arrItemMRP);
    console.log(arrOfferPrice);

    return washingtonRef.update({
        group_title: txtGroupTitle.value,
        item_name: arrItemNames,
        item_tag: arrItemTags,
        item_rating: arrItemRating,
        item_rating_count: arrItemRatingCount,
        item_mrp: arrItemMRP,
        item_offer_price: arrOfferPrice,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbDashboardGroup.value);
            alert("Group Updated");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function saveGroupCategory() {
    var washingtonRef = firebase.firestore().collection("medical_dashboard").doc(cmbDashboardGroup.value);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.set({
        group_title: txtGroupTitle.value,
        item_name: arrItemNames,
        item_tag: arrItemTags,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbDashboardGroup.value);
            alert("Item Saved");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function saveGroupProduct() {
    var washingtonRef = firebase.firestore().collection("medical_dashboard").doc(cmbDashboardGroup.value);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.set({
        group_title: txtGroupTitle.value,
        item_name: arrItemNames,
        item_tag: arrItemTags,
        item_rating: arrItemRating,
        item_rating_count: arrItemRatingCount,
        item_mrp: arrItemMRP,
        item_offer_price: arrOfferPrice,
        img_url: arrImages
    })
        .then(function () {
            loadSubCategories(cmbDashboardGroup.value);
            alert("Item Saved");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}




