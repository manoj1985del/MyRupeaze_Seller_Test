
var txtBulletPoints = document.getElementById("txtBulletPoints");
var btnBulletPoints = document.getElementById("btnBulletPoints");
var ulBulletpoints = document.getElementById("ulBulletPoints");
var btnFeature = document.getElementById("btnAddFeature");
var ulFeatures = document.getElementById("ulfeatures");
var txtFeatureName = document.getElementById("txtFeatureName");
var txtFeatureValue = document.getElementById("txtFeatureDetail");

//cover image variables
var inpFielCover = document.getElementById("inpFile_Cover");
var previewContainerCover = document.getElementById("imagePreview_Cover");
var previewImageCover = previewContainerCover.querySelector(".image-preview_image");
var previewImageDefaultTextCover = previewContainerCover.querySelector(".image-preview_default-text");

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


var bulletCounts = 1;
var bullets = [];

let bulletMap = new Map();

let featureMap = new Map();

//image operations
//1. Cover image
setImage(inpFielCover, previewImageCover, previewImageDefaultTextCover);

//2. Img1
setImage(inpFielImage1, previewImageImage1, previewImageDefaultTextImage1);

//3. Img2
setImage(inpFielImage2, previewImageImage2, previewImageDefaultTextImage2);

//3. Img3
setImage(inpFielImage3, previewImageImage3, previewImageDefaultTextImage3);

//4. Img4
setImage(inpFielImage4, previewImageImage4, previewImageDefaultTextImage4);

//5. Img5
setImage(inpFielImage5, previewImageImage5, previewImageDefaultTextImage5);

function setImage(inpFile, previewImage, previewImageDeraultText){

    inpFile.addEventListener("change", function(){
        var file = this.files[0];
        if(file){
            var reader = new FileReader();
            previewImage.style.display = "block";
            previewImageDeraultText.style.display = "none";
     
            reader.addEventListener("load",  function(){
                previewImage.setAttribute("src", this.result);
     
            });
            reader.readAsDataURL(file); 
        }
        else{
         previewImage.style.display = null;
         previewImageDeraultText.style.display = null;
     
        }
     });
     

}


btnBulletPoints.style.display = "none";
btnBulletPoints.addEventListener("click", function(){
    var data = txtBulletPoints.value;
    if(data === ""){
        alert("bullet point cannot be empty");
        txtBulletPoints.focus();
        return;
    }
    var elementId = "bullet_" + bulletCounts;
    bulletCounts++;

    console.log(data, elementId);
    addElement("ulBulletPoints", "li", elementId, data );

    txtBulletPoints.value = "";
    txtBulletPoints.focus();

});


btnFeature.addEventListener("click", function(){
    var featureName = txtFeatureName.value;
    console.log("feature name - " + featureName);
    if(featureName === ""){
        alert("feature name cannot be empty");
        txtFeatureName.focus();
        return;
    }

    var featureValue = txtFeatureValue.value;
    console.log("feature value - " + featureValue);
    if(featureValue === ""){
        alert("feature value cannot be empty");
        txtFeatureValue.focus();
        return;
    }



    var elementId = featureName;

    var data = featureName + ": " + featureValue;

    addElement("ulfeatures", "li", elementId, data);

    txtFeatureName.value = "";
    txtFeatureValue.value = "";
    txtFeatureName.focus();

});




function addElement(parentId, elementTag, elementId, html) {
    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    newElement.title = "click to remove";
    p.appendChild(newElement);
    bulletMap.set(elementId, html);
    
    

    newElement.addEventListener("click", function(){

        var eid = this.getAttribute("id");
        removeElement(eid);
        bulletMap.delete(eid);

    });

    newElement.addEventListener("mouseover", function(){
        newElement.classList.add("handCursor");
    });
}

txtBulletPoints.addEventListener("keyup" ,function(){
    console.log(this.value);
    if(isEmpty(this.value)){
        btnBulletPoints.style.display = "none";    
    }
    else{
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

