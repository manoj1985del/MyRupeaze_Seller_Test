
var btnHome = document.getElementById("btnHome");
var sellerid = localStorage.getItem("sellerid");
var adminLogin = localStorage.getItem("adminLogin");
console.log(adminLogin);


if (btnHome != null) {
    btnHome.addEventListener("click", function () {
        if (adminLogin == null) {
            window.location.href = "home.html?sellerid=" + sellerid;
        }

        else {
            window.location.href = "admin_home.html?sellerid=" + sellerid;

        }
    })
}

if (btnLogout != null) {
    btnLogout.addEventListener("click", function () {
        logOut();
    })
}

function logOut() {
    firebase.auth().signOut().then(function () {
        window.location.href = "seller_login.html";
    }).catch(function (error) {
        // An error happened.
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

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getQueryVariableFromQueryString(query, variable) {
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
}