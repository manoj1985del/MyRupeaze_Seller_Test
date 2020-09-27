


var docLimit = 25;
var lastVisibleDoc;
var paginationFinished = false;

var queryList = [];
var pageIndex = 0;
var videoList = [];






var imgLoading = document.getElementById("loading");
var errMsg = document.getElementById("errorMsg");
var divErrorMsg = document.getElementById("divErrorMsg");

var btnNext = document.getElementById("next");
var btnPrevious = document.getElementById("previous");
var btnHome = document.getElementById("btnHome");

var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");

var nextQuery;


errMsg.textContent = "";

var table = document.getElementById("tblVideos");
var pageHeader = document.getElementById("pageHeader");

loadVideos();



btnNext.addEventListener("click", function () {
    divProgress.style.display = "block";
    divContent.style.display = "none";

    //clear the list
    videoList = [];

    //delete previous table
    deleteTableRows();
  
    var query = queryList[pageIndex + 1];

    // var query = firebase.firestore()
    // .collection('videos')
    // .orderBy("timestamp", "desc")
    // .limit(docLimit);


    fetchVideos(query).then(() => {
        nextQuery = firebase.firestore()
            .collection('videos')
        .orderBy("timestamp", "desc")
            .startAfter(lastVisibleDoc)
            .limit(docLimit);


        pageIndex++;
        queryList.push(nextQuery);
        if (paginationFinished) {
            btnNext.style.display = "none";
        } else {
            btnNext.style.display = "block";
        }
        btnPrevious.style.display = "block";

        ShowVidoesInTable();
    });

})

btnPrevious.addEventListener("click", function () {
    btnNext.style.display = "block";
    paginationFinished = false;
    divProgress.style.display = "block";
    divContent.style.display = "none";

    videoList = [];

    deleteTableRows();
    // table = document.getElementById("tblPendingOrders");

    var query = queryList[pageIndex - 1];

    fetchVideos(query).then(() => {

        pageIndex--;
        if (pageIndex == 0) {
            btnPrevious.style.display = "none";

        } else {
            btnPrevious.style.display = "block";
        }

        ShowVidoesInTable();
    });

})

function loadVideos() {

    pageHeader.textContent = "Videos";
    var query = firebase.firestore()
        .collection('videos')
        .orderBy("timestamp", "desc")
        .limit(docLimit);


    queryList.push(query);

    fetchVideos(query).then(() => {

        nextQuery = firebase.firestore()
            .collection('videos')
            .orderBy("timestamp", "desc")
            .startAfter(lastVisibleDoc)
            .limit(docLimit);


        queryList.push(nextQuery);
        ShowVidoesInTable();
    })

}


function deleteTableRows() {
    //e.firstElementChild can be used. 
    var child = table.lastElementChild;
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
}




function fetchVideos(query) {

    return new Promise((resolve, reject) => {
        console.log("inside fetch video");

        query.get()
            .then(function (snapshot) {
                imgLoading.style.display = "none";
                divProgress.style.display = "none";
                divContent.style.display = "block";


                if (snapshot.docs.length < docLimit) {
                    btnNext.style.display = "none";
                } else {
                    btnNext.style.display = "block";
                }

                if (queryList.length > 1 && snapshot.docs.length == 0) {
                    errMsg.textContent = "No further rows to display";
                    errMsg.style.display = "block";

                    paginationFinished = true;
                    pageIndex++;
                    btnNext.style.display = "none";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";
                    return;
                }

                if (snapshot.docs.length == 0) {
                    errMsg.textContent = "No Videos found";
                    errMsg.style.display = "block";
                    divContent.style.display = "none";
                    divProgress.style.display = "none";

                    return;
                }



                lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

                divProgress.style.display = "none";
                divContent.style.display = "block";

                snapshot.forEach(function (doc) {
                    var video = doc.data();
                    console.log(video);
                    videoList.push(video);
                })
            }).then(() => {
                console.log("videos fetched");
                resolve();
            })
    })
}





function ShowVidoesInTable() {

    console.log("showing videos");
    console.log(videoList);

    createTableHeaders();
   
    for(var i = 0; i < videoList.length; i++){

        var video = videoList[i];

        var tr = document.createElement("tr");
        var tdTitle = document.createElement("td");
        var tdAudience = document.createElement("td");
        var tdVideoUrl = document.createElement("td");
        var tdAction = document.createElement("td");

        var divTitle = document.createElement('div');
        var spanTitle = document.createElement("span");
        spanTitle.textContent = video.title;
        divTitle.appendChild(spanTitle);
        tdTitle.appendChild(divTitle);

        var divAudience = document.createElement('div');
        var spanAudience = document.createElement("span");
        spanAudience.textContent = video.available_for;
        divAudience.appendChild(spanAudience);
        tdAudience.appendChild(divAudience);

        var divURL = document.createElement('div');
        var anchor = document.createElement("a");
        anchor.textContent = video.video_url;
        anchor.setAttribute("href", video.video_url);
        divURL.appendChild(anchor);
        tdVideoUrl.appendChild(divURL);

      
        var divAction = document.createElement("div");
        var divEdit = document.createElement("divEdit");
        divEdit.style.marginBottom = "10px";
        var btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit Video";
        btnEdit.style.width = "150px";
        btnEdit.setAttribute("id", i.toString());
        divEdit.appendChild(btnEdit);
        divAction.appendChild(divEdit);

        var divDelete = document.createElement("divDelete");
        divDelete.style.marginBottom = "10px";
        var btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete Video";
        btnDelete.style.width = "150px";
        btnDelete.setAttribute("id", i.toString());
        divDelete.appendChild(btnDelete);
        divAction.appendChild(divDelete);

        
        tdTitle.appendChild(divTitle);
        tdAudience.appendChild(divAudience);
        tdVideoUrl.appendChild(divURL);
        tdAction.appendChild(divAction);

        tr.appendChild(tdTitle);
        tr.appendChild(tdAudience);
        tr.appendChild(tdVideoUrl);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnEdit.addEventListener("click", function(){
            var index = parseInt(this.id);
            var video  = videoList[index];
            window.location.href = "admin_add_videos.html?vid=" + video.id;
        })

        btnDelete.addEventListener("click", function(){

            divProgress.style.display = "block";
            divContent.style.display = "none";  

            var index = parseInt(this.id);
            var video  = videoList[index];
            deleteVideo(video.id);

        })

        

    

        

    }
  
}

function deleteVideo(docid) {
    firebase.firestore().collection("videos").doc(docid).delete().then(function () {
        window.location.href = "admin_view_videos.html";
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}






function createTableHeaders() {
    var tr = document.createElement('tr');

    var titleHeader = document.createElement("th");
    var audienceHeader = document.createElement("th");
    var urlHeader = document.createElement('th');
    var actionHeader = document.createElement('th');


    titleHeader.innerHTML = "Video Title";
    audienceHeader.innerHTML = "Video Audience";
    urlHeader.innerHTML = "Video URL";
    actionHeader.innerHTML = "Action";


    tr.appendChild(titleHeader);
    tr.appendChild(audienceHeader);
    tr.appendChild(urlHeader);
    tr.appendChild(actionHeader);


    table.appendChild(tr);

}