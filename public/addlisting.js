var sellerId = localStorage.getItem("sellerid");
var mSeller;
var sellerName = localStorage.getItem("sellerName");
var nav = document.getElementById("nav");
var txtProductRating = document.getElementById("txtProductRating");
var divProductRating = document.getElementById("divProductRating");



var update = false;
var newTagsAdded = false;
var localTagList = [];
var globalTagList = [];
var activeTagDocId = null;

var imgUrl = null;
var coverImageUrl = null;
var Img1Url = null;
var Img2Url = null;
var Img3Url = null;
var Img4Url = null;
var Img5Url = null;

var productFeatures;
var qtyDiscounts;
var productVariants = null;
let arrBullets = [];
var tags;
var expiryDate = null;


var divContent = document.getElementById("divContent");
var divProgress = document.getElementById("divProgress");

var pageHeading = document.getElementById("pageHeading");
var txtBulletPoints = document.getElementById("txtBulletPoints");
var btnBulletPoints = document.getElementById("btnBulletPoints");
var ulBulletpoints = document.getElementById("ulBulletPoints");
var btnFeature = document.getElementById("btnAddFeature");
var ulFeatures = document.getElementById("ulfeatures");
var txtFeatureName = document.getElementById("txtFeatureName");
var txtFeatureValue = document.getElementById("txtFeatureDetail");
var imgSaving = document.getElementById("imgSaving");
var txtCountryOfOrigin = document.getElementById("txtcoo");
var txtExpiryDate = document.getElementById("txtExpiryDate");
var productCategory = document.getElementById("productCategory");

var rbVariantYes = document.getElementById("rbVariantsYes");
var rbVariantNo = document.getElementById("rbVariantsNo");
var txtVariantName = document.getElementById("txtVariantName");
var txtVariantValue = document.getElementById("txtVariantValue");

var btnAddVariant = document.getElementById("btnAddVariant");
var divVariant = document.getElementById("divVariant");

var btnMapVariant = document.getElementById("btnMapVariant");
var spanMapVariant = document.getElementById("spanMapVariant");
var txtReturnWindow = document.getElementById("txtReturnWindow");
var divQtyDiscounts = document.getElementById("divQtyDiscounts");



//cover image variables
var inpFielCover = document.getElementById("inpFile_Cover");
var previewContainerCover = document.getElementById("imagePreview_Cover");
var previewImageCover = previewContainerCover.querySelector(".image-preview_image");
var previewImageDefaultTextCover = previewContainerCover.querySelector(".image-preview_default-text");
var btnUploadCover = document.getElementById("btnUploadCover");
var imgProgressCover = document.getElementById("imgProgressCover");
var uploadMsgCover = document.getElementById("uploadMsgCover");

//image1 variables
var inpFielImage1 = document.getElementById("inpFile_Img1");
var previewContainerImage1 = document.getElementById("imagePreview_Img1");
var previewImageImage1 = previewContainerImage1.querySelector(".image-preview_image");
var previewImageDefaultTextImage1 = previewContainerImage1.querySelector(".image-preview_default-text");

//image2 variables
var inpFielImage2 = document.getElementById("inpFile_Img2");
var previewContainerImage2 = document.getElementById("imagePreview_Img2");
var previewImageImage2 = previewContainerImage2.querySelector(".image-preview_image");
var previewImageDefaultTextImage2 = previewContainerImage2.querySelector(".image-preview_default-text");

//image3 variables
var inpFielImage3 = document.getElementById("inpFile_Img3");
var previewContainerImage3 = document.getElementById("imagePreview_Img3");
var previewImageImage3 = previewContainerImage3.querySelector(".image-preview_image");
var previewImageDefaultTextImage3 = previewContainerImage3.querySelector(".image-preview_default-text");

//image4 variables
var inpFielImage4 = document.getElementById("inpFile_Img4");
var previewContainerImage4 = document.getElementById("imagePreview_Img4");
var previewImageImage4 = previewContainerImage4.querySelector(".image-preview_image");
var previewImageDefaultTextImage4 = previewContainerImage4.querySelector(".image-preview_default-text");

//image5 variables
var inpFielImage5 = document.getElementById("inpFile_Img5");
var previewContainerImage5 = document.getElementById("imagePreview_Img5");
var previewImageImage5 = previewContainerImage5.querySelector(".image-preview_image");
var previewImageDefaultTextImage5 = previewContainerImage5.querySelector(".image-preview_default-text");

var btnUploadCover = document.getElementById("btnUploadCover");
var btnUploadImg1 = document.getElementById("btnUploadImg1");
var btnUploadImg2 = document.getElementById("btnUploadImg2");
var btnUploadImg3 = document.getElementById("btnUploadImg3");
var btnUploadImg4 = document.getElementById("btnUploadImg4");
var btnUploadImg5 = document.getElementById("btnUploadImg5");

var imgProgressCover = document.getElementById("imgProgressCover");
var imgProgressImg1 = document.getElementById("imgProgressImg1");
var imgProgressImg2 = document.getElementById("imgProgressImg2");
var imgProgressImg3 = document.getElementById("imgProgressImg3");
var imgProgressImg4 = document.getElementById("imgProgressImg4");
var imgProgressImg5 = document.getElementById("imgProgressImg5");

var uploadMsgCover = document.getElementById("uploadMsgCover");
var uploadMsgImg1 = document.getElementById("uploadMsgImg1");
var uploadMsgImg2 = document.getElementById("uploadMsgImg2");
var uploadMsgImg3 = document.getElementById("uploadMsgImg3");
var uploadMsgImg4 = document.getElementById("uploadMsgImg4");
var uploadMsgImg5 = document.getElementById("uploadMsgImg5");

//field variables
var txtProductTitle = document.getElementById("txtProductTitle");
var txtOfferPrice = document.getElementById("txtOfferPrice");
var txtMRP = document.getElementById("txtMRP");
var txtGST = document.getElementById("txtGST");
var txtBrand = document.getElementById("txtBrand");
var txtStockQty = document.getElementById("txtStockQty");
var txtProductDescription = document.getElementById("txtProductDescription");
var rbYes = document.getElementById("rbYes");
var txtTags = document.getElementById("txtTags")
var btnSubmit = document.getElementById("btnSubmit");
var btnUpdate = document.getElementById("btnUpdate");

var msgHeader = document.getElementById("msgHeader");
var imgHeader = document.getElementById("imgHeader");
var actionMsg = document.getElementById("actionMsg");

var txtQtyDiscountQty = document.getElementById("txtQtyDiscountQty");
var txtQtyDiscountPrice = document.getElementById("txtQtyDiscountPrice");
var btnAddQtyDiscount = document.getElementById("btnAddQtyDiscount");
var ulQtyDiscount = document.getElementById("ulQtyDiscount");

var txtProductId = document.getElementById("txtProductId");
var btnSearchProduct = document.getElementById("btnSearchProduct");
var divAddFromProduct = document.getElementById("divAddFromProduct");
var chkAddExisting = document.getElementById("chkAddExisting");
var divAddExisting = document.getElementById("divAddExisting");

var divVariantPricing = document.getElementById("divVariantPricing");
var rbYesVariantPricing = document.getElementById("rbYesVariantPricing");
var rbNoVariantPricing = document.getElementById("rbNoVariantPricing");

var divVariantSelection = document.getElementById("divVariantSelection");
var selectVariant = document.getElementById("selectVariant");
var table = document.getElementById("tblVariantPrice");
var cmbSubCategory = document.getElementById("cmbSubCategory");

var fileCover;
var fileImg1;
var fileImg2;
var fileImg3;
var fileImg4;
var fileImg5;

// var coverImagePath;
// var Img1Path;
// var Img2Path;
// var Img3Path;
// var Img4Path;
// var Img5Path;

var arrFileImg = [];

var bulletCounts = 1;
var bullets = [];
let bulletMap = new Map();
let featureMap = new Map();
let variantMap = new Map();
let qtyDiscountMap = new Map();

let variantPriceMap = new Map();
var variantList = [];
var mProduct;

var subCategoryMap = new Map();

loadSubCategories();
loadTags();
getSellerDetails();

var bUpdate = false;


productCategory.addEventListener("change", function(){
    addSubCategoryInDropDown();
    
})
rbYesVariantPricing.addEventListener("change", function () {
    if (this.checked) {
        divVariantSelection.style.display = "block";
        addVariantsInDropDown();
    }
    else {
        divVariantSelection.style.display = "none";
        deleteTableRows();
    }
})

rbNoVariantPricing.addEventListener("change", function () {
    if (this.checked) {
        divVariantSelection.style.display = "none";
        deleteTableRows();

    }
    else {
        divVariantSelection.style.display = "block";
        addVariantsInDropDown();
    }
})

selectVariant.addEventListener("change", function () {
    // alert(this.value);
    setVariantPricing(this.value);


})

function setVariantPricing(variantName) {
    variantPriceMap = new Map();
    var tmpVariantName = [];
    variants = [];
    tmpVariantName = variantMap.get(variantName).split(',');
    // console.log(tmpVariantName);
    for (var i = 0; i < tmpVariantName.length; i++) {
        var variant = tmpVariantName[i].trim();
        variantPriceMap.set(variant, 0);
    }

    createTable();
}

chkAddExisting.addEventListener("change", function () {
    if (this.checked) {
        divAddExisting.style.display = "block";
    } else {
        divAddExisting.style.display = "none";
    }
})

btnUploadCover.addEventListener("click", function () {
    if (fileCover == null) {
        alert("Please select a cover file");
        return;
    }

    if (fileCover.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(fileCover.type == "image/png" || fileCover.type == "image/jpeg" || fileCover.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }

    // console.log(fileCover);

    // console.log("going to show progress bar");
    imgProgressCover.style.display = "block";

    saveImageAtFirebase(fileCover, productId).then(() => {
        imgProgressCover.style.display = "none";
        uploadMsgCover.style.display = "block";

        coverImageUrl = imgUrl;
        // console.log("cover image url - " + coverImageUrl);
    })

})

btnUploadImg1.addEventListener("click", function () {

    var file = fileImg1;
    console.log(file.name);
    if (file == null) {
        alert("Please select a cover file");
        return;
    }

    if (file.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }


    console.log("going to show progress bar");
    imgProgressImg1.style.display = "block";

    saveImageAtFirebase(file, productId).then(() => {
        imgProgressImg1.style.display = "none";
        uploadMsgImg1.style.display = "block";
        Img1Url = imgUrl;
    })

})

btnUploadImg2.addEventListener("click", function () {
    var file = fileImg2;
    if (file == null) {
        alert("Please select a cover file");
        return;
    }

    if (file.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }


    console.log("going to show progress bar");
    imgProgressImg2.style.display = "block";

    saveImageAtFirebase(file, productId).then(() => {
        imgProgressImg2.style.display = "none";
        uploadMsgImg2.style.display = "block";
        Img2Url = imgUrl;
    })

})

btnUploadImg3.addEventListener("click", function () {
    var file = fileImg3;
    if (file == null) {
        alert("Please select a cover file");
        return;
    }

    if (file.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }


    console.log("going to show progress bar");
    imgProgressImg3.style.display = "block";

    saveImageAtFirebase(file, productId).then(() => {
        imgProgressImg3.style.display = "none";
        uploadMsgImg3.style.display = "block";
        Img3Url = imgUrl;
    })

})

btnUploadImg4.addEventListener("click", function () {
    var file = fileImg4;
    if (file == null) {
        alert("Please select a cover file");
        return;
    }

    if (file.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }


    console.log("going to show progress bar");
    imgProgressImg4.style.display = "block";

    saveImageAtFirebase(file, productId).then(() => {
        imgProgressImg4.style.display = "none";
        uploadMsgImg4.style.display = "block";
        Img4Url = imgUrl;
    })

})

btnUploadImg5.addEventListener("click", function () {
    var file = fileImg5;
    if (file == null) {
        alert("Please select a cover file");
        return;
    }

    if (file.size > 1048576) {
        alert("File cannot be more than 1 MB");
        return;
    }

    if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg")) {
        alert("Only png or jpeg files are allowed to upload");
        return;
    }


    console.log("going to show progress bar");
    imgProgressImg5.style.display = "block";

    saveImageAtFirebase(file, productId).then(() => {
        imgProgressImg5.style.display = "none";
        uploadMsgImg5.style.display = "block";
        Img5Url = imgUrl;
    })

})





btnMapVariant.addEventListener("click", function () {
    if (txtVariantName.value == "") {
        alert("Please enter variant name");
        txtVariantName.focus();
        return;
    }

    if (txtVariantValue.value == "") {
        alert("Please enter variant value");
        txtVariantValue.focus();
        return;
    }

    variantList.push(txtVariantValue.value);
    var sValues = "";
    for (var i = 0; i < variantList.length; i++) {
        var sValue = variantList[i];
        if (i == variantList.length - 1) {
            sValues += sValue;
        }
        else {
            sValues += sValue + ", ";
        }
    }
    spanMapVariant.textContent = sValues;
    txtVariantValue.value = "";
    txtVariantValue.focus();
});

btnAddVariant.addEventListener("click", function () {
    addVariant(txtVariantName.value, spanMapVariant.textContent);
    divVariantPricing.style.display = "block";
    spanMapVariant.textContent = "";
    txtVariantName.value = "";
    txtVariantValue.value = "";
    variantList = [];

    // variantMap.set(txtVariantName.value, variantList);
})

btnSearchProduct.addEventListener("click", function () {
    if (txtProductId.value == null) {
        alert("Please enter a product Id");
        return;
    }

    bUpdate = false;
    loadUI(true, txtProductId.value);

})
var productId = getQueryVariable("productid");
var admin = getQueryVariable("admin");
if(admin){
    divProductRating.style.display = "block";
}
else{
    divProductRating.style.display = "none";
}

if (productId != null) {
    bUpdate = true;
    divAddFromProduct.style.display = "none";
    loadUI(false, productId);

}
else {
    bUpdate = false;
    productId = generateUUID();
}

function loadUI(bProductIdEntered, p_ProductId) {

    btnSubmit.style.display = "none";
    btnUpdate.style.display = "block";
    pageHeading.innerHTML = "<h1>Edit Listing</h1>";

    var query = firebase.firestore()
        .collection('products')
        .where("Product_Id", "==", p_ProductId);

    query.get()
        .then(function (snapshot) {
            snapshot.forEach(function (doc) {
                var product = doc.data();
                mProduct = product;
                txtProductTitle.value = product.Title;

                if (bUpdate) {
                    txtOfferPrice.value = product.Offer_Price;
                    txtMRP.value = product.MRP;

                    var qd = product.qty_discount_in_percent;
                    for (const property in qd) {
                        var propertyName = `${property}`;
                        var propertyValue = `${qd[property]}`;
                        addQtyDiscount(propertyName, propertyValue);
                    }

                }

                
                txtProductRating.value = product.Avg_Rating;
                txtGST.value = product.GST;
                txtBrand.value = product.Brand;
                txtTags.value = product.Tags;
                txtReturnWindow.value = product.returning_window;
                txtCountryOfOrigin.value = product.CountryOfOrigin;
                productCategory.value = product.Category;
                addSubCategoryInDropDown();
                cmbSubCategory.value = product.SubCategory;
                if (product.ExpiryDate != null) {
                    txtExpiryDate.value = product.ExpiryDate;
                }

                var bullets = product.bullet_points;
                //  console.log("going to add bullets");
                for (var i = 0; i < bullets.length; i++) {
                    addBullets(bullets[i]);
                }

                txtStockQty.value = product.stock_qty;
                txtProductDescription.value = product.Description;
                rbYes.checked = product.COD;

                var variantsAvailable = product.VariantsAvailable;
                if (variantsAvailable) {
                    rbVariantYes.checked = true;
                    divVariant.style.display = "block";
                    divVariantPricing.style.display = "block";
                    divVariantSelection.style.display = "block";
                }
                else {
                    rbVariantNo.checked = true;
                    divVariant.style.display = "none";
                    divVariantPricing.style.display = "none";
                    divVariantSelection.style.display = "none";
                }


                var pf = product.Features;

                for (const property in pf) {
                    var propertyName = `${property}`;
                    var propertyValue = `${pf[property]}`;
                    addfeatures(propertyName, propertyValue);
                }



                if (variantsAvailable) {
                    var vr = product.Variants;
                    for (const property in vr) {
                        var propertyName = `${property}`;
                        var propertyValue = `${vr[property]}`;
                        addVariant(propertyName, propertyValue);

                    }
                }
                else {
                    divVariantPricing.style.display = "none";
                    divVariantSelection.style.display = "none";
                }

                if (product.variant_pricing) {
                    rbYesVariantPricing.checked = true;
                    addVariantsInDropDown();
                    selectVariant.value = product.variant_pricing_attribute;

                    var vr = product.variant_price_map;
                    for (const property in vr) {
                        var propertyName = `${property}`;
                        var propertyValue = `${vr[property]}`;
                        variantPriceMap.set(propertyName, propertyValue);
                        //  addVariant(propertyName, propertyValue);

                    }

                    createTable();

                    // setVariantPricing(product.variant_pricing_attribute);

                }

                if (product.ImageUrlCover != null) {
                    coverImageUrl = product.ImageUrlCover;
                    previewImageCover.src = product.ImageUrlCover;
                    previewImageCover.style.display = "block";
                    previewImageDefaultTextCover.style.display = "none";
                }

                if (product.ImageUrlImage1 != null) {
                    Img1Url = product.ImageUrlImage1;
                    previewImageImage1.src = product.ImageUrlImage1;
                    previewImageImage1.style.display = "block";
                    previewImageDefaultTextImage1.style.display = "none";
                }

                if (product.ImageUrlImage2 != null) {
                    Img2Url = product.ImageUrlImage2;
                    previewImageImage2.src = product.ImageUrlImage2;
                    previewImageImage2.style.display = "block";
                    previewImageDefaultTextImage2.style.display = "none";
                }

                if (product.ImageUrlImage3 != null) {
                    Img3Url = product.ImageUrlImage3;
                    previewImageImage3.src = product.ImageUrlImage3;
                    previewImageImage3.style.display = "block";
                    previewImageDefaultTextImage3.style.display = "none";
                }

                if (product.ImageUrlImage4 != null) {
                    Img4Url = product.ImageUrlImage4;
                    previewImageImage4.src = product.ImageUrlImage4;
                    previewImageImage4.style.display = "block";
                    previewImageDefaultTextImage4.style.display = "none";
                }

                if (product.ImageUrlImage5 != null) {
                    Img5Url = product.ImageUrlImage5;
                    previewImageImage5.src = product.ImageUrlImage5;
                    previewImageImage5.style.display = "block";
                    previewImageDefaultTextImage5.style.display = "none";
                }

                console.log(admin);
                if (admin == "true") {
                    console.log("here");
                    //nav.style.display = "none";
                    pageHeading.innerHTML = "<h1>View Product Details</h1>";

                    //     productCategory.disabled = true;
                    //     txtProductTitle.disabled = true;
                    //     txtOfferPrice.disabled = true;
                    //     txtMRP.disabled = true;
                    //     txtReturnWindow.disabled = true;
                    //     txtGST.disabled = true;
                    //     txtBrand.disabled = true;
                    //     txtCountryOfOrigin.disabled = true;
                    //     txtExpiryDate.disabled = true;
                    //     //txtTags.disabled = true;
                    //     txtBulletPoints.disabled = true;
                    //     txtStockQty.disabled = true;
                    //     txtProductDescription.disabled = true;
                    //   //  rbYes.disabled = true;
                    //     txtFeatureName.disabled = true;
                    //     txtFeatureValue.disabled = true;
                    //     btnUploadCover.style.display = "none";
                    //     btnUploadImg1.style.display = "none";
                    //     btnUploadImg2.style.display = "none";
                    //     btnUploadImg3.style.display = "none";
                    //     btnUploadImg4.style.display = "none";
                    //     btnUploadImg5.style.display = "none";

                    console.log(mSeller);

                    btnUpdate.style.display = "block";
                    btnSubmit.style.display = "none";
                }


            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}

rbVariantYes.addEventListener("change", function () {
    if (rbVariantYes.checked) {
        divVariant.style.display = "block";
    }
    else {
        divVariant.style.display = "none";
    }
})

rbVariantNo.addEventListener("change", function () {
    if (rbVariantNo.checked) {
        divVariant.style.display = "none";
        deleteTableRows();
        divVariantPricing.style.display = "none";
        divVariantSelection.style.display = "none";
        variantMap = new variantMap();

    }
    else {
        divVariant.style.display = "block";

    }
})


//This function will validate if all the details are filled up correctly...
function validateFormDetails() {
    var errorMsg = "";
    var errorFound = false;
    console.log("going to validate form details");

    if (productCategory.value == "null") {
        errorMsg = "Please select product category<br/>"
        errorFound = true;
    }

    if (cmbSubCategory.value == "null") {
        errorMsg = "Please select product SubCategory<br/>"
        errorFound = true;
    }

    if (txtProductTitle.value == "") {
        errorMsg += "Please Enter Product Title<br/>"
        errorFound = true;
    }

    if (txtOfferPrice.value == "") {
        errorMsg += "Please Enter Offer Price<br/>"
        errorFound = true;
    }

    if (!isNumber(txtOfferPrice.value)) {
        errorMsg += "Offer Price has to be numeric";
        errorFound = true;
    }

    if (txtMRP.value == "") {
        errorMsg += "Please Enter MRP<br/>"
        errorFound = true;
    }

    if (!isNumber(txtMRP.value)) {
        errorMsg += "MRP has to be numeric<br/>"
        errorFound = true;
    }

    if (txtReturnWindow.value == "") {
        errorMsg += "Please Enter Return Widnow days<br/>"
        errorFound = true;
    }

    if (!isNumber(txtReturnWindow.value)) {
        errorMsg += "Return window has to be numeric<br/>"
        errorFound = true;
    }

    if (txtGST.value == "") {
        errorMsg += "Please Enter GST rate.<br/>"
        errorFound = true;
    }

    if (!isNumber(txtGST.value)) {
        errorMsg += "GST has to be a number only.<br/>"
        errorFound = true;
    }

    if (txtBrand.value == "") {
        errorMsg += "Please Enter Product Brand.<br/>"
        errorFound = true;
    }

    if (txtCountryOfOrigin.value == "") {
        errorMsg += "Please select country of origin<br/>";
        errorFound = true;
    }

    if (bulletMap.length == 0) {
        errorMsg += "Please Enter at least one bullet point for the productt.<br/>"
        errorFound = true;
    }

    if (txtStockQty.value == "") {
        errorMsg += "Please Enter Stock Quantity.<br/>"
        errorFound = true;
    }

    if (!isNumber(txtStockQty.value)) {
        errorMsg += "GST has to be a number only.<br/>"
        errorFound = true;
    }



    if (txtProductDescription.value == "") {
        errorMsg += "Please Enter Product Description.<br/>"
        errorFound = true;
    }

    if (bulletMap.size == 0) {
        errorMsg += "Please enter at least one bullet point<br/>";
        errorFound = true;
    }
    if (featureMap.size == 0) {
        errorMsg += "Please Enter at least one feature.<br/>"
        errorFound = true;
    }

    if (rbVariantYes.checked) {
        if (variantMap.size == 0) {
            errorMsg += "You have checked variant option. You need to add at least one variant.<br/>"
            errorFound = true;
        }
    }

    if (coverImageUrl == null) {
        errorMsg += "Please upload cover image";
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
    window.scrollTo(0, document.body.scrollHeight);
}
function setErrorHeader(msg) {

    msgHeader.classList.remove("successBorder");
    msgHeader.style.display = "block";
    imgHeader.setAttribute("src", "img_error.png");
    actionMsg.innerHTML = msg;
    msgHeader.classList.add("errorBorder");

}


function setImageFromFirebase(previewImage, previewImageDefaultText, imgName) {

    var storageRef = firebase.storage();
    var path = "products/" + productId + "/" + imgName;
    storageRef.ref(path).getDownloadURL().then(function (url) {
        console.log("download url-" + imgName + " : " + url);
        previewImage.src = url;
        previewImage.style.display = "block";
        previewImageDefaultText.style.display = "none";

        switch (imgName) {
            case "cover.jpg":
                coverImageUrl = url;
                break;

            case "1.jpg":
                Img1Url = url;
                break;

            case "2.jpg":
                Img2Url = url;
                break;

            case "3.jpg":
                Img3Url = url;
                break;

            case "4.jpg":
                Img4Url = url;
                break;

            case "5.jpg":
                Img5Url = url;
                break;
        }
    }).catch(function (error) {
        // Handle any errors
    });
}

function getDownloadUrl(path) {
    return new Promise((resolve, reject) => {
        firebase.storage().ref(path).getDownloadURL().then(function (url) {
            resolve();
            return url;
        }).catch(function (error) {
            reject();
            return null;
        });

    })
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

function formatDate() {

    let expdate = new Date(txtExpiryDate.value);

    var dd = expdate.getDate();
    var mm = expdate.getMonth() + 1;
    var year = expdate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + year;

    return formattedDay;

}
btnSubmit.addEventListener("click", function () {

    if (validateFormDetails() == false) {
        return;
    }

    divProgress.style.display = "block";
    divContent.style.display = "none";

    var tmpTags = [];
    tags = [];

    tmpTags = txtTags.value.split(',');
    for (var i = 0; i < tmpTags.length; i++) {
        var tag = tmpTags[i].trim().toLowerCase();
        tags.push(tag);
        if (!globalTagList.includes(tag)) {
            localTagList.push(tag);
            newTagsAdded = true;
        }

    }

    addTags().then(() => {
        var code = saveProductDetails();
        return code;
    })



});

btnUpdate.addEventListener("click", function () {

    if (validateFormDetails() == false) {
        return;
    }

    update = true;
    divProgress.style.display = "block";
    divContent.style.display = "none";

    var tmpTags = [];
    tags = [];

    tmpTags = txtTags.value.split(',');
    for (var i = 0; i < tmpTags.length; i++) {
        var tag = tmpTags[i].trim().toLowerCase();
        tags.push(tag);
        if (!globalTagList.includes(tag)) {
            localTagList.push(tag);
            newTagsAdded = true;
        }

    }

    addTags().then(() => {
        var code = saveProductDetails();
        return code;
    })

});


//image operations
//1. Cover image
setImage(inpFielCover, previewImageCover, previewImageDefaultTextCover, "cover");


//2. Img1
setImage(inpFielImage1, previewImageImage1, previewImageDefaultTextImage1, "img1");

//3. Img2,
setImage(inpFielImage2, previewImageImage2, previewImageDefaultTextImage2, "img2");

//3. Img3
setImage(inpFielImage3, previewImageImage3, previewImageDefaultTextImage3, "img3");

//4. Img4
setImage(inpFielImage4, previewImageImage4, previewImageDefaultTextImage4, "img4");

//5. Img5
setImage(inpFielImage5, previewImageImage5, previewImageDefaultTextImage5, "img5");

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
                case "cover":
                    fileCover = file;
                    break;

                case "img1":
                    fileImg1 = file;
                    break;

                case "img2":
                    fileImg2 = file;
                    break;

                case "img3":
                    fileImg3 = file;
                    break;

                case "img4":
                    fileImg4 = file;
                    break;

                case "img5":
                    fileImg5 = file;
                    break;
            }

        }
        else {
            previewImage.style.display = null;
            previewImageDeraultText.style.display = null;

        }
    });


}

function addBullets(data) {
    if (data === "") {
        alert("bullet point cannot be empty");
        txtBulletPoints.focus();
        return;
    }
    var elementId = "bullet_" + bulletCounts;
    bulletCounts++;

    addElement("ulBulletPoints", "li", elementId, data, bulletMap, false);

    txtBulletPoints.value = "";
}

btnAddQtyDiscount.addEventListener("click", function () {
    if (txtQtyDiscountQty.value == "") {
        alert("Please specify Quantity");
        txtQtyDiscountQty.focus();
        return;
    }

    if (txtQtyDiscountPrice.value == "") {
        alert("Please specify discount price");
        txtQtyDiscountPrice.focus();
        return;
    }

    if (txtQtyDiscountQty.value == "1") {
        alert("Value of discount quantity should be greater than 1");
        txtQtyDiscountQty.focus();
        return;
    }

    var value = qtyDiscountMap.get(txtQtyDiscountQty.value);
    if (value != null) {
        alert("Discount has already been defined on this quantity");
        return;
    }

    addQtyDiscount(txtQtyDiscountQty.value, txtQtyDiscountPrice.value);
    txtQtyDiscountQty.value = "";
    txtQtyDiscountPrice.value = "";
})

function addQtyDiscount(quantity, price) {
    if (quantity === "" || price == "") {
        return;
    }

    var elementId = quantity;

    qtyDiscountMap.set(quantity, price);
    addElement("ulQtyDiscount", "li", elementId, price, qtyDiscountMap, true);
}


function addfeatures(featureName, featureValue) {
    if (featureName === "" || featureValue == "") {
        return;
    }

    var elementId = featureName;

    featureMap.set(featureName, featureValue);
    addElement("ulfeatures", "li", elementId, featureValue, featureMap, true);
}


function addVariant(variantName, variantValue) {
    if (variantName === "" || variantValue == "") {
        return;
    }

    var elementId = variantName;

    variantMap.set(variantName, variantValue);
    addElement("ulVariants", "li", elementId, variantValue, variantMap, true);
}


btnBulletPoints.style.display = "none";
btnBulletPoints.addEventListener("click", function () {
    var data = txtBulletPoints.value;
    addBullets(data);
    txtBulletPoints.focus();

});


btnFeature.addEventListener("click", function () {
    var featureName = txtFeatureName.value;
    if (featureName === "") {
        alert("feature name cannot be empty");
        txtFeatureName.focus();
        return;
    }

    var featureValue = txtFeatureValue.value;
    if (featureValue === "") {
        alert("feature value cannot be empty");
        txtFeatureValue.focus();
        return;
    }

    addfeatures(featureName, featureValue);
    txtFeatureName.value = "";
    txtFeatureValue.value = "";
    txtFeatureName.focus();

});



function addElement(parentId, elementTag, mapKey, mapVal, map, isFeature) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', mapKey);
    if (isFeature) {
        var data = "<b>" + mapKey + "</b>" + " : " + mapVal;
        newElement.innerHTML = data;
        console.log("inner html = " + newElement);
    }
    else
        newElement.innerHTML = mapVal;
    newElement.title = "click to remove";
    p.appendChild(newElement);
    //console.log("data in map =" + html);
    map.set(mapKey, mapVal);



    newElement.addEventListener("click", function () {

        var eid = this.getAttribute("id");
        removeElement(eid);
        map.delete(eid);

        if (variantMap.size == 0) {
            divVariantPricing.style.display = "none";
            divVariantSelection.style.display = "none";

        }

    });

    newElement.addEventListener("mouseover", function () {
        newElement.classList.add("handCursor");
    });
}

txtBulletPoints.addEventListener("keyup", function () {
    if (isEmpty(this.value)) {
        btnBulletPoints.style.display = "none";
    }
    else {
        btnBulletPoints.style.display = "block";
    }

});

function isEmpty(str) {
    return !str.trim().length;
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}



// Saves a new message on the Firebase DB.
function saveProductDetails() {

    if (productCategory.value == "null") {
        alert("Please select product category");
        productCategory.focus();
        divContent.style.display = "block";
        divProgress.style.display = "none";
        return false;
    }

    if (coverImageUrl == null) {
        alert("Cover image needs to be selected.");
        divContent.style.display = "block";
        divProgress.style.display = "none";
        return false;
    }


    //while update listing there will be a product id
    // if (productId == null) {
    //     productId = generateUUID();
    // }

    // TODO 7: Push a new message to Firebase.
    // Add a new message entry to the database.
    productFeatures = new Object();
    for (let [key, value] of featureMap) {
        productFeatures[key] = value;
    }

    productVariants = null;
    if (rbVariantYes.checked && variantMap.size > 0) {
        var productVariants = new Object();
        for (let [key, value] of variantMap) {
            productVariants[key] = value;
        }
    }

    qtyDiscounts = null;
    if (qtyDiscountMap.size > 0) {
        qtyDiscounts = new Object();
        for (let [key, value] of qtyDiscountMap) {
            qtyDiscounts[key] = parseInt(value);
        }
    }


    arrBullets = [];
    for (let [key, value] of bulletMap) {
        arrBullets.push(value);
    }


    if (bUpdate == false) {
        txtTags.value += "," + productCategory.value + "," + txtBrand.value;

    }


    expiryDate = null;
    if (txtExpiryDate.value != "") {
        expiryDate = formatDate();
    }

    if (bUpdate) {
        updateProductDetails();
        return;
    }


    var variant_pricing = false;
    if (rbYesVariantPricing.checked) {
        variant_pricing = true;
    }

    var variant_pricing_attribute = null;
    if (variant_pricing) {
        variant_pricing_attribute = selectVariant.value;
    }

    var vp = null;
    if (variant_pricing && variantPriceMap.size > 0) {
        vp = new Object();
        for (let [key, value] of variantPriceMap) {
            vp[key] = parseFloat(value);
        }
    }

    firebase.firestore().collection('products').doc(productId).set({
        Avg_Rating: parseFloat(txtProductRating.value),
        Active: true,
        Brand: txtBrand.value,
        COD: rbYes.checked,
        Description: txtProductDescription.value,
        Features: productFeatures,
        GST: parseFloat(txtGST.value),
        MRP: parseFloat(txtMRP.value),
        Offer_Price: parseFloat(txtOfferPrice.value),
        qty_discount_in_percent: qtyDiscounts,
        Product_Id: productId,
        Tags: tags,
        Title: txtProductTitle.value,
        Total_Ratings: 0,
        bullet_points: arrBullets,
        stock_qty: parseInt(txtStockQty.value),
        seller_id: sellerId,
        SoldBy: sellerName,
        CountryOfOrigin: txtCountryOfOrigin.value,
        ExpiryDate: expiryDate,
        Category: productCategory.value,
        SubCategory: cmbSubCategory.value,
        ImageUrlCover: coverImageUrl,
        VariantsAvailable: rbVariantYes.checked,
        Variants: productVariants,
        ImageUrlImage1: Img1Url,
        ImageUrlImage2: Img2Url,
        ImageUrlImage3: Img3Url,
        ImageUrlImage4: Img4Url,
        ImageUrlImage5: Img5Url,
        returning_window: parseInt(txtReturnWindow.value),
        seller_city: mSeller.city,
        seller_area_pin: mSeller.seller_area_pin,
        selling_offline: false,
        shop_price: 0,
        status: "pending",
        variant_pricing: variant_pricing,
        variant_pricing_attribute: variant_pricing_attribute,
        variant_price_map: vp,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()

    }).then(function () {

        divProgress.style.display = "none";
        divContent.style.display = "block";
        window.location.href = "showListing.html";
        // setSuccessHeader("Product Saved Successfully");
    })
        .catch(function (error) {
            divProgress.style.display = "none";
            divContent.style.display = "block   ";
            console.error('Error writing new message to database', error);
            return false;
        });

    return true;

}

function saveImageAtFirebase(file, productId) {
    imgUrl = null;
    var imagePath = "products" + '/' + productId + '/' + file.name;
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




function updateProductDetails() {
    var washingtonRef = firebase.firestore().collection('products').doc(productId);
    console.log(tags);

    productVariants = null;
    if (rbVariantYes.checked && variantMap.size > 0) {
        var productVariants = new Object();
        for (let [key, value] of variantMap) {
            productVariants[key] = value;
        }
    }

    qtyDiscounts = null;
    if (qtyDiscountMap.size > 0) {
        qtyDiscounts = new Object();
        for (let [key, value] of qtyDiscountMap) {
            qtyDiscounts[key] = parseInt(value);
        }
    }

    console.log(qtyDiscountMap);

    var variant_pricing = false;
    if (rbYesVariantPricing.checked) {
        variant_pricing = true;
    }

    var variant_pricing_attribute = null;
    if (variant_pricing) {
        variant_pricing_attribute = selectVariant.value;
    }

    var vp = null;
    if (variant_pricing && variantPriceMap.size > 0) {
        vp = new Object();
        for (let [key, value] of variantPriceMap) {
            vp[key] = parseFloat(value);
        }
    }




    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        Avg_Rating: parseFloat(txtProductRating.value),
        Brand: txtBrand.value,
        COD: rbYes.checked,
        Description: txtProductDescription.value,
        Features: productFeatures,
        GST: parseFloat(txtGST.value),
        MRP: parseFloat(txtMRP.value),
        Offer_Price: parseFloat(txtOfferPrice.value),
        qty_discount_in_percent: qtyDiscounts,
        Product_Id: productId,
        Tags: tags,
        Title: txtProductTitle.value,
        Total_Ratings: 0,
        bullet_points: arrBullets,
        stock_qty: parseInt(txtStockQty.value),
        CountryOfOrigin: txtCountryOfOrigin.value,
        ExpiryDate: expiryDate,
        Category: productCategory.value,
        SubCategory: cmbSubCategory.value,
        ImageUrlCover: coverImageUrl,
        VariantsAvailable: rbVariantYes.checked,
        Variants: productVariants,
        ImageUrlImage1: Img1Url,
        ImageUrlImage2: Img2Url,
        ImageUrlImage3: Img3Url,
        ImageUrlImage4: Img4Url,
        ImageUrlImage5: Img5Url,
        returning_window: parseInt(txtReturnWindow.value),
        variant_pricing: variant_pricing,
        variant_pricing_attribute: variant_pricing_attribute,
        variant_price_map: vp,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            divProgress.style.display = "none";
            divContent.style.display = "block";
            alert("Listing updated successfully");
            window.close();

            // if(bUpdate){

            //     window.close();
            //     return;
            // }

            // if(admin){
            //     window.location.href = "admin_show_listing.html";
            // }
            // else{
            // window.location.href = "showListing.html";
            // }
        })
        .catch(function (error) {
            divProgress.style.display = "none";
            divContent.style.display = "block   ";
            console.error('Error writing new message to database', error);
            return false;

        });

}

function reset() {
    bulletMap.clear();
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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

function isNumber(searchValue) {
    var found = searchValue.search(/^(\d*\.?\d*)$/);
    //Change to ^(\d*\.?\d+)$ if you don't want the number to end with a . such as 2.
    //Currently validates .2, 0.2, 2.0 and 2.
    if (found > -1) {
        return true;
    }
    else {
        return false;
    }
}

function getSellerDetails() {



    var docRef = firebase.firestore().collection("seller").doc(sellerId);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            mSeller = doc.data();
        } else {
            seller = null;
            // doc.data() will be undefined in this case
            console.log("No such document!");

        }
    }).catch(function (error) {
        seller = null;
        console.log("Error getting document:", error);
    });



}

function deleteAllElementsFromVariantDropDown() {
    //e.firstElementChild can be used. 
    var child = selectVariant.lastElementChild;
    while (child) {
        selectVariant.removeChild(child);
        child = selectVariant.lastElementChild;
    }
}

function deleteAllElementsFromSubCategoriesDropDown() {
    //e.firstElementChild can be used. 
    var child = cmbSubCategory.lastElementChild;
    while (child) {
        cmbSubCategory.removeChild(child);
        child = cmbSubCategory.lastElementChild;
    }
}

function addVariantsInDropDown() {

    deleteAllElementsFromVariantDropDown();
    variantPriceMap = new Map();
    var option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    option.value = null;
    option.textContent = "Select Variant";
    selectVariant.appendChild(option);

    for (let [key, value] of variantMap) {
        // console.log(key + " = " + value);
        var option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        selectVariant.appendChild(option);
    }

    //  var tdProductName = document.createElement("td");


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


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thType = document.createElement("th");
    thType.textContent = "Type";
    var thPrice = document.createElement("th");
    thPrice.textContent = "Price";
    var thAction = document.createElement("th");
    thAction.textContent = "Action";

    tr.appendChild(thType);
    tr.appendChild(thPrice);
    tr.appendChild(thAction);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {
    deleteTableRows();
    createTableHeaders();

    // console.log(variantPriceMap);

    for (let [key, value] of variantPriceMap) {


        var tr = document.createElement("tr");
        var tdVariant = document.createElement("td");
        var tdPrice = document.createElement('td');
        var tdAction = document.createElement('td');

        var divVariant = document.createElement('div');
        var spanVariant = document.createElement('span');
        spanVariant.textContent = key;
        divVariant.appendChild(spanVariant);

        var divPrice = document.createElement('div');
        var spanPrice = document.createElement('span');
        spanPrice.textContent = value;
        divPrice.appendChild(spanPrice);

        var divAction = document.createElement('div');
        var btnChangePrice = document.createElement('button');
        btnChangePrice.textContent = "Change Price";
        btnChangePrice.setAttribute("type", "button");
        btnChangePrice.setAttribute("id", key);
        divAction.appendChild(btnChangePrice);

        tdVariant.appendChild(divVariant);
        tdPrice.appendChild(divPrice);
        tdAction.appendChild(divAction);

        tr.appendChild(tdVariant);
        tr.appendChild(tdPrice);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnChangePrice.addEventListener("click", function () {
            alert(this.id);

            var price = prompt("Please enter price for the variant: " + this.id, "");
            if (price == null || price == "") {
                return;
            }

            variantPriceMap.set(this.id, price);
            createTable();
        })
    }


}


function loadTags() {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection("product_tags")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var product_tags = doc.data();
                    if (product_tags.active == true) {
                        activeTagDocId = product_tags.tag_id;
                    }

                    var tags = product_tags.tags;
                    for (var i = 0; i < tags.length; i++) {
                        var tag = tags[i].toLowerCase();
                        if (product_tags.active == true) {
                            localTagList.push(tag);
                        }
                        globalTagList.push(tag);

                    }
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

function addTags() {

    return new Promise((resolve, reject) => {

        var tagId = null;
        if (activeTagDocId == null) {
            tagId = generateUUID();
        }
        else {
            tagId = activeTagDocId;
        }
        var active = true;
        if (localTagList.length >= 2000) {
            active = false;
        }

        // Add a new document in collection "cities"
        firebase.firestore().collection("product_tags").doc(tagId).set({
            tag_id: tagId,
            active: active,
            tags: localTagList
        })
            .then(function () {
                resolve();
            })
            .catch(function (error) {
                reject();
            });

    })


}

function loadSubCategories(){
    return new Promise((resolve, reject) => {
        firebase.firestore().collection("categories")
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    var objCategory = doc.data();
                    subCategoryMap.set(objCategory.Category, objCategory.sub_categories);
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

function addSubCategoryInDropDown() {

    deleteAllElementsFromSubCategoriesDropDown();
    var category = productCategory.value;
    var sc = subCategoryMap.get(category);
    
    var option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    option.value = null;
    option.textContent = "Select Sub-Category";
    cmbSubCategory.appendChild(option);

    for (var i = 0 ; i < sc.length; i++) {
        var option = document.createElement("option");
        var subC = sc[i];
        if(subC.toUpperCase().trim() == "ALL"){
            continue;
        }
        option.value = subC;
        option.textContent = subC;
        cmbSubCategory.appendChild(option);
    }

    //  var tdProductName = document.createElement("td");


}





