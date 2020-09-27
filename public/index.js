var slideIndex = 0;
var divVideos = document.getElementById("divVideos");
var videoList = [];

showSlides();
loadVideos();


var btnStartSelling  = document.getElementById("btnStartSelling");

btnStartSelling.addEventListener("click", function(){
  window.location.href = "seller_login.html";
})


function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 4000); // Change image every 2 seconds
}


function loadVideos(){
  getVideoList().then(()=>{
    showVideos();
  })
}
function getVideoList(){

  return new Promise((resolve, reject)=>{

    firebase.firestore().collection("videos").where("available_for", "==", "All")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
           videoList.push(doc.data());
      
        });
    }).then(function(){
      console.log("now resolving");
       resolve();
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        reject();
    });

  })

  

}

function showVideos(){
  if(videoList.length == 0){
    return;
  }

    var videoIndex = 0;
    var h3 = document.createElement("h3");
    h3.textContent = "Videos";
    divVideos.appendChild(h3);

    //one row will have two videos
    var numRows = Math.ceil( videoList.length / 2);
    if(numRows < 1){
       numRows = 0;
    }
    
    console.log(numRows);

    for(var iRow = 0; iRow < numRows; iRow++){
      // <div class="row mt-2">
      var divRow = document.createElement("div");
      divRow.classList.add("row-mt-2");

      //each row will have just two columns
      for(var iCol = 0; iCol < 2; iCol++){

        if(videoIndex >= videoList.length){
          break;
        }

        var video = videoList[videoIndex];

        var divCol = document.createElement("div");
        divCol.classList.add("col-md-6");

        // var iFrame = document.createElement("iframe");
        // iFrame.setAttribute("width", '560');
        // iFrame.setAttribute("width", '315');
        // iFrame.setAttribute("src",  video.video_url);
        // iFrame.setAttribute("frameborder", '0');
        // iFrame.setAttribute("allow", 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        // iFrame.allowFullscreen = true;


        var span = document.createElement("span");
        span.innerHTML = video.embed_code;

        // console.log(span.innerHTML);
        divCol.appendChild(span);
        divRow.appendChild(divCol);

        videoIndex++;

      }
      console.log("showing videos");
      divVideos.appendChild(divRow);
    }

}