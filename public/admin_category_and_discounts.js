var commision_map = new Map();
var productCategories = [];
var table = document.getElementById("tbl");
var divProgress = document.getElementById("divProgress");
var divContent = document.getElementById("divContent");
var select = document.getElementById("productCategory");
var txtCommission = document.getElementById("txtCommission");
var btnSubmit = document.getElementById("btnSubmit");


btnSubmit.addEventListener("click", function(){
    divProgress.style.display = "block";
    divContent.style.display = "none";
    commision_map.set(select.value, txtCommission.value);
   updateCommission();
})

function updateCommission(){

    var commission = new Object();
    for (let [key, value] of commision_map) {
        commission[key] = value;
    }

    firebase.firestore().collection("commission").doc("35zAmgEt2EkrMGb0uzqs").set({
        commision_map: commission
    })
    .then(function() {
        window.location.href = "admin_category_and_discounts.html";
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

}



loadComissionMap().then(() => {
    console.log("commission map loaded");
    createTable();
    loadDropdown();
    console.log("table created");
    divProgress.style.display = "none";
    divContent.style.display = "block";
})

function loadDropdown() {

    for (const val of productCategories) {
        var option = document.createElement("option");

        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
    }

}

function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thCategory = document.createElement("th");
    thCategory.textContent = "Product Category";
    var thPrice = document.createElement("th");
    thPrice.textContent = "Commission (%)";


    tr.appendChild(thCategory);
    tr.appendChild(thPrice);

    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {


    createTableHeaders();
    for (var i = 0; i < productCategories.length; i++) {
        var categoryName = productCategories[i];
        var commission = commision_map.get(categoryName);

        var tr = document.createElement("tr");
        var tdCategory = document.createElement("td");
        var tdCommission = document.createElement("td");

        var categorySpan = document.createElement("span");
        categorySpan.textContent = categoryName;
        tdCategory.appendChild(categorySpan);

        var commissionSpan = document.createElement("span");
        commissionSpan.textContent = commission;
        tdCommission.appendChild(commissionSpan);

        tr.appendChild(tdCategory);
        tr.appendChild(tdCommission);

        table.appendChild(tr);
    }

}

function loadComissionMap() {
    return new Promise((resolve, reject) => {
        {

            console.log("going to load commission map");

            var docRef = firebase.firestore().collection("commission").doc("35zAmgEt2EkrMGb0uzqs");

            docRef.get().then(function (doc) {
                if (doc.exists) {
                    var commission = doc.data();
                    var pf = commission.commision_map;

                    for (const property in pf) {
                        var propertyName = `${property}`;
                        productCategories.push(propertyName);
                        var propertyValue = `${pf[property]}`;
                        commision_map.set(propertyName, propertyValue);
                    }
                    resolve();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    resolve();
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
                reject();
            });

        }
    })

}