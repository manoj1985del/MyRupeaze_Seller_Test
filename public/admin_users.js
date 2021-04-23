var table = document.getElementById("tblShowUsers");
var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var btnExportToExcel = document.getElementById('btnExportToExcel')

var mUserList = [];

divProgress.style.display = "block";
divContent.style.display = "none";

//table.style.width = "200px";

getUserData().then(()=>{
    createTable();
})

btnExportToExcel.addEventListener("click", function () {
    exportToExcel();

})

function createTableHeaders() {
    var tr = document.createElement('tr');

    var sNo = document.createElement('th');
    var name = document.createElement("th");
    var customerId = document.createElement('th');
    var phone = document.createElement('th');
    var email = document.createElement('th');
    var fcm = document.createElement('th');
    var address = document.createElement('th');
    var gender = document.createElement('th');
    var dob = document.createElement('th');
    var childBirthday = document.createElement('th');
    var anniversary = document.createElement('th');
    var lastOrderDate = document.createElement('th');
    var lastPayStatus = document.createElement('th');

    sNo.innerHTML = "S.No.";
    name.innerHTML = "Name";
    customerId.innerHTML = "Customer ID";
    phone.innerHTML = "Phone"
    email.innerHTML = "Email";
    fcm.innerHTML = "FCM";
    address.innerHTML = "Address Details";
    gender.innerHTML = "Gender";
    dob.innerHTML = "Date Of Birth";
    childBirthday.innerHTML = "Child Birthday";
    anniversary.innerHTML = "Anniversary";
    lastOrderDate.innerHTML = "Last Order Date";
    lastPayStatus.innerHTML = "Last Payment Status";


    tr.appendChild(sNo);
    tr.appendChild(name);
    tr.appendChild(customerId);
    tr.appendChild(phone);
    tr.appendChild(email);
    tr.appendChild(fcm);
    tr.appendChild(address);
    tr.appendChild(gender);
    tr.appendChild(dob);
    tr.appendChild(childBirthday);
    tr.appendChild(anniversary);
    tr.appendChild(lastOrderDate);
    tr.appendChild(lastPayStatus);

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
        var tdEmail = document.createElement('td');
        var tdFcm = document.createElement('td');
        var tdAddress = document.createElement('td');
        var tdGender = document.createElement('td');
        var tdDob = document.createElement('td');
        var tdChildBirthday = document.createElement('td');
        var tdAnniversary = document.createElement('td');
        var tdLastOrderDate = document.createElement('td');
        var tdLastPayStatus = document.createElement('td');

        var user = mUserList[i];
        console.log(user.Name);

        var userName = user.Name;
        var customerID = user.customer_id;
        var userPhone = user.Phone;
        var userEmail = user.Email;
        var userFcm = user.fcm;
        var userGender = user.Gender;
        var userDob = 'Not Specified';
        if(user.dob != undefined || user.dob != null){
            userDob = user.dob;
        }

        var childBirthday = 'Not Specified';
        if(user.child_birthday != undefined || user.child_birthday != null){
            childBirthday = user.child_birthday;
        }

        var userAnniversary = 'Not Specified';
        if(user.anniversary != undefined || user.anniversary != null){
            userAnniversary = user.anniversary;
        }

        var lastOrderDate = "No Records Yet";
        if(user.last_order_date != undefined || user.last_order_date != null){
            lastOrderDate = formatFirebaseDate(user.last_order_date);
        }
       
        var userAddress = "Address Line 1: " + user.AddressLine1 + "\n Address Line 2: " + user.AddressLine2 + 
        "\nAdress Line 3: " + user.AddressLine3 + "\nCity: " + user.City + "\nState: " + user.State;

     

        var divSNo = document.createElement('div');
        var spanSNo = document.createElement('span');
        spanSNo.innerHTML = i.toString();
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
        
        var divEmail = document.createElement('div');
        var spanEmail = document.createElement('span');
        spanEmail.innerHTML = userEmail;
        divEmail.appendChild(spanEmail);
        tdEmail.appendChild(divEmail);

        var divFcm = document.createElement('div');
        var spanFcm = document.createElement('span');
        spanFcm.innerHTML = userFcm;
        divFcm.appendChild(spanFcm);
        tdFcm.appendChild(divFcm);

        var divAddress = document.createElement('div');
        var spanAddress = document.createElement('span');
        spanAddress.innerHTML = userAddress;
        divAddress.appendChild(spanAddress);
        tdAddress.appendChild(divAddress);

        var divGender = document.createElement('div');
        var spanGender = document.createElement('span');
        spanGender.innerHTML = userGender;
        divGender.appendChild(spanGender);
        tdGender.appendChild(divGender);

        var divDob = document.createElement('div');
        var spanDob = document.createElement('span');
        spanDob.innerHTML = userDob;
        divDob.appendChild(spanDob);
        tdDob.appendChild(divDob);

        var divChildBirthday = document.createElement('div');
        var spanChildBirthday = document.createElement('span');
        spanChildBirthday.innerHTML = childBirthday;
        divChildBirthday.appendChild(spanChildBirthday);
        tdChildBirthday.appendChild(divChildBirthday);

        var divAnniversary = document.createElement('div');
        var spanAnniversary = document.createElement('span');
        spanAnniversary.innerHTML = userAnniversary;
        divAnniversary.appendChild(spanAnniversary);
        tdAnniversary.appendChild(divAnniversary);

        var divLastOrderDate = document.createElement('div');
        var spanLastOrderDate = document.createElement('span');
        spanLastOrderDate.innerHTML = lastOrderDate;
        divLastOrderDate.appendChild(spanLastOrderDate);
        tdLastOrderDate.appendChild(divLastOrderDate);

        var divLastPayStatus = document.createElement('div');
        var spanLastPayStatus = document.createElement('span');
        var lastPayStatus = "";
        if(user.last_payment_status == null || user.last_payment_status == undefined){
            lastPayStatus = "No Records Yet";
        }
        spanLastPayStatus.innerHTML = lastPayStatus;
        divLastPayStatus.appendChild(spanLastPayStatus);
        tdLastPayStatus.appendChild(divLastPayStatus);

        

        

        tr.appendChild(tdSNo);
        tr.appendChild(tdName);
        tr.appendChild(tdCustomerId);
        tr.appendChild(tdPhone);
        tr.appendChild(tdEmail);
        tr.appendChild(tdFcm);
        tr.appendChild(tdAddress);
        tr.appendChild(tdGender);
        tr.appendChild(tdDob);
        tr.appendChild(tdChildBirthday);
        tr.appendChild(tdAnniversary);
        tr.appendChild(tdLastOrderDate);
        tr.appendChild(tdLastPayStatus);
        table.appendChild(tr);
    }
}

function getUserData() {

    console.log("control here");
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

function exportToExcel(){
    var rows = [];

    //iterating through rows of table
    for (var i = 0, row; row = table.rows[i]; i++) {
        column1 = row.cells[0].innerText;
        column2 = row.cells[1].innerText;
        column3 = row.cells[2].innerText;
        column4 = row.cells[3].innerText;
        column5 = row.cells[4].innerText;
        column6 = row.cells[5].innerText;
        column7 = row.cells[6].innerText;
        column8 = row.cells[7].innerText;
        column9 = row.cells[8].innerText;
        column10 = row.cells[9].innerText;

        //adding record to rows array
        rows.push(
            [
                column1,
                column2,
                column3,
                column4,
                column5,
                column6,
                column7,
                column8,
                column9,
                column10
            ]
        );

    }

    csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
        row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "User_list.csv");
    document.body.appendChild(link);
    link.click();
}


