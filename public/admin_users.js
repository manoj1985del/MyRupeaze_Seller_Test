var table = document.getElementById("tblShowUsers");
var divProgress = document.getElementById('divProgress');
var divContent = document.getElementById('divContent');
var btnExportToExcel = document.getElementById('btnExportToExcel')

var mUserList = [];

divProgress.style.display = "block";
divContent.style.display = "none";

getUserData().then(()=>{
    createTable();
})

btnExportToExcel.addEventListener("click", function () {
    exportToExcel();

})

function createTableHeaders() {
    var tr = document.createElement('tr');

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

    table.appendChild(tr);

}

function createTable(){

    createTableHeaders();

    for(var i = 0; i < mUserList.length; i++){
        var user = mUserList[i];

        var userName = user.Name;
        var customerID = user.customer_id;
        var userPhone = user.Phone;
        var userEmail = user.Email;
        var userFcm = user.fcm;
        var userGender = user.Gender;
        var userDob = user.dob;
        var userChildBirthday = user.child_birthday;
        var userAnniversary = user.anniversary;
        var userAddress = "Address Line 1: " + user.AddressLine1 + "\n Address Line 2: " + user.AddressLine2 + 
        "\nAdress Line 3: " + user.AddressLine3 + "\nCity: " + user.City + "\nState: " + user.State;

        var tr = document.createElement('tr');

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

        var divName = document.createElement('div');
        var spanName = document.createElement('span');
        spanName.innerHTML = userName;
        divName.appendChild(spanName);
        tdName.appendChild(divName);
        
        tdCustomerId.innerHTML = customerID;
        tdPhone.innerHTML = userPhone;
        tdEmail.innerHTML = userEmail;
        tdFcm.innerHTML = userFcm;
        tdAddress.innerHTML = userAddress;
        tdGender.innerHTML = userGender;
        tdDob.innerHTML = userDob;
        tdChildBirthday.innerHTML = userChildBirthday;
        tdAnniversary.innerHTML = userAnniversary;

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
        column5 = row.cells[3].innerText;
        column6 = row.cells[3].innerText;
        column7 = row.cells[3].innerText;
        column8 = row.cells[3].innerText;
        column9 = row.cells[3].innerText;
        column10 = row.cells[3].innerText;

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
