var divVideos = document.getElementById("divVideos");
var videoList = [];

loadVideos();

function loadVideos(){
    getVideoList().then(()=>{
      showVideos();
    })
  }
  function getVideoList(){
  
    return new Promise((resolve, reject)=>{
  
      firebase.firestore().collection("videos").where("available_for", "==", "Sellers")
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
    
  
      //one row will have three videos
      var numRows = Math.ceil( videoList.length / 3);
      if(numRows < 1){
         numRows = 0;
      }
      
      console.log(numRows);
  
      for(var iRow = 0; iRow < numRows; iRow++){
        // <div class="row mt-2">
        var divRow = document.createElement("div");
        divRow.classList.add("row-mt-2");
  
        //each row will have just three videos columns
        for(var iCol = 0; iCol < 3; iCol++){
  
          if(videoIndex >= videoList.length){
            break;
          }
  
          var video = videoList[videoIndex];
  
          var divCol = document.createElement("div");
          divCol.classList.add("col-md-6");

          var divTitle = document.createElement("div");
          var spanVideoTitle = document.createElement("span");
          spanVideoTitle.innerHTML = "<b>" +  video.title + "</b>";
          divTitle.appendChild(spanVideoTitle);
          
  
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
          divCol.appendChild(divTitle);
          divCol.appendChild(span);
        
          divRow.appendChild(divCol);
  
          videoIndex++;
  
        }
        console.log("showing videos");
        divVideos.appendChild(divRow);
      }
  
  }