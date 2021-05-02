var table = document.getElementById("tblDisplayUsers");
var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');

var mUserList = [];
var couponCode = localStorage.getItem('coupon_code');



divProgress.style.display = "block";
divContent.style.display = "none";

getUserData().then(()=>{
    createTable();
})


function createTableHeaders() {

    var tr = document.createElement('tr');

    var sNo = document.createElement('th');
    var name = document.createElement("th");
    var customerId = document.createElement('th');
    var phone = document.createElement('th');
    var address = document.createElement('th');
    var action = document.createElement("th");

    sNo.innerHTML = "S.No.";
    name.innerHTML = "Name";
    customerId.innerHTML = "Customer ID";
    phone.innerHTML = "Phone";
    address.innerHTML = "Address";
    action.innerHTML = "Action";


    tr.appendChild(sNo);
    tr.appendChild(name);
    tr.appendChild(customerId);
    tr.appendChild(phone);
    tr.appendChild(address);
    tr.appendChild(action);
    table.appendChild(tr);

}

function createTable(){

    createTableHeaders();

    for(var i = 0; i < mUserList.length; i++){
        
        var tr = document.createElement('tr');

        var tdSNo = document.createElement('td');
        var tdName = document.createElement("td");
        var tdCustomerId = document.createElement('td');
        var tdPhone = document.createElement("td");
        var tdAddress = document.createElement("td");
        var tdAction = document.createElement('td');
       
        var user = mUserList[i];

        var userName = user.Name;
        var customerID = user.customer_id;
        var userPhone = user.Phone;
     
        var userAddress = user.AddressLine1 + "," + user.AddressLine2 + 
        "," + user.AddressLine3 + ",City: " + user.City + ",State: " + user.State;


        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.innerHTML = (i+1).toString();
        divSNo.appendChild(spanSNo);
        tdSNo.appendChild(divSNo);

        var divName = document.createElement('div');
        var spanName = document.createElement('span');
        spanName.innerHTML = userName;
        divName.appendChild(spanName);
        tdName.appendChild(divName);

        var divCustomerId = document.createElement('div');
        var spanCustomerId = document.createElement('span');
        spanCustomerId.innerHTML = customerID;
        divCustomerId.appendChild(spanCustomerId);
        tdCustomerId.appendChild(divCustomerId);

        var divPhone = document.createElement('div');
        var spanPhone = document.createElement('span');
        spanPhone.innerHTML = userPhone;
        divPhone.appendChild(spanPhone);
        tdPhone.appendChild(divPhone);
        

        var divAddress = document.createElement('div');
        var spanAddress = document.createElement('span');
        spanAddress.innerHTML = userAddress;
        divAddress.appendChild(spanAddress);
        tdAddress.appendChild(divAddress);


        // var divAction = document.createElement('div');

        // var btnAddUser = document.createElement('button');
        // btnAddUser.style.width = "150px";
        // btnAddUser.style.margin = "10px";
        // btnAddUser.textContent = "Add User";
        // //btnAddUser.setAttribute("id", customerID);
        // divAction.appendChild(btnAddUser);

        // tdAction.appendChild(divAction);

        var divAction = document.createElement("div");
        var btnAddUser = document.createElement("button");
        btnAddUser.style.width = "150px";
        btnAddUser.style.margin = "10px";
        btnAddUser.textContent = "Add User";
        btnAddUser.setAttribute("id", customerID);
        btnAddUser.setAttribute("type", "button");
       
        divAction.appendChild(btnAddUser);

        tdAction.appendChild(divAction);
        

        

        tr.appendChild(tdSNo);
        tr.appendChild(tdName);
        tr.appendChild(tdCustomerId);
        tr.appendChild(tdPhone);
        tr.appendChild(tdAddress);
        tr.appendChild(tdAction);
        table.appendChild(tr);

        btnAddUser.addEventListener("click", function () {
            console.log(this.id);
            addUserToDiscountList(this.id);
            this.disabled = "true";
        })
    }
  
}

function addUserToDiscountList(id){
    

    var couponRef = firebase.firestore().collection("coupons").doc(couponCode);

    var arrUnion = couponRef.update({
        customersDiscountList: firebase.firestore.FieldValue.arrayUnion(id)
      });

      alert("User added to Discount List!!");
      //window.location.href = "select_users.html";    
}

function getUserData() {

    return new Promise((resolve, reject)=>{
        firebase.firestore().collection('users').get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var user = doc.data();
            mUserList.push(user);

        });
    })
    .then(()=>{
        console.log("users fetched");
        console.log(mUserList);
        divProgress.style.display = "none";
        divContent.style.display = "block";
        resolve();
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
        reject();
    });

    })

    
}
