
var divProgress = document.getElementById("divProgress");
var errorMsg = document.getElementById("errorMsg");
var divContent = document.getElementById("divContent");
var pageHeader = document.getElementById("pageHeader");
var hCustomerDetails = document.getElementById("hCustomerDeatils");
var table = document.getElementById("tblDeliveryAgents");

divProgress.style.display = "block";
divContent.style.display = "none";
pageHeader.textContent = "Available Delivery Agents";


var mOrder = null;
var mCustomer = null;
var deliveryAgents = [];

var orderid = getQueryVariable("orderid");
console.log(orderid);

loadUI();

function loadUI() {

    getOrderDetails(orderid).then(() => {
        getCustomerDetails(mOrder.customer_id).then(() => {
            var html = "Customer Name : " + mCustomer.Name + "<br/>"
                + "Address : " + mCustomer.AddressLine1 + "<br />"
                + mCustomer.AddressLine2 + "<br/>"
                + mCustomer.AddressLine3 + "<br />"

                + "Landmark: " + mCustomer.Landmark + "<br />"
                + "Pincode: " + mCustomer.Pincode + "<br/>"
                + "City: " + mCustomer.City + "<br />"
                + "State: " + mCustomer.State + " (INDIA) <br/>"
                + "Contact No. " + mCustomer.Phone;

            hCustomerDetails.innerHTML = html;
            divProgress.style.display = "none";
            divContent.style.display = "block";

            getDeliveryAgents().then(() => {
                if (deliveryAgents.length == 0) {
                    errorMsg.textContent = "No Delivery Agent Found in this area";
                }
                else {
                    createTable();
                }


            })
        })
    })
}

function getOrderDetails(orderid) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore().collection("orders").doc(orderid);

        docRef.get().then(function (doc) {
            if (doc.exists) {
                mOrder = doc.data();
                resolve();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            reject();
        });

    })

}

function getCustomerDetails(customerid) {

    return new Promise((resolve, reject) => {

        var docRef = firebase.firestore()
            .collection('users').doc(customerid);


        docRef.get().then(function (doc) {
            if (doc.exists) {
                mCustomer = doc.data();
                resolve();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                reject();
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
            reject();
        });

    })
}

function getDeliveryAgents() {
    return new Promise((resolve, reject) => {

        firebase.firestore().collection("delivery_agents").where("buyer_area_pin", "==", mCustomer.buyer_area_pin)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var deliveryAgent = doc.data();
                    deliveryAgents.push(deliveryAgent);
                })
            }).then(() => {
                resolve();
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                reject();
            })

    })

}

function createTableHeaders() {


    var tHead = document.createElement("thead");
    var tr = document.createElement("tr");
    var thAgentDetails = document.createElement("th");
    thAgentDetails.textContent = "Agent Details";
    var thAction = document.createElement("th");
    thAction.textContent = "Action";
    tr.appendChild(thAgentDetails);
    tr.appendChild(thAction);
    tHead.appendChild(tr);
    table.appendChild(tHead);

}

function createTable() {
    createTableHeaders();

    for (var i = 0; i < deliveryAgents.length; i++) {

        var agent = deliveryAgents[i];
        var tr = document.createElement("tr");
        var tdAgentDetails = document.createElement("td");
        var tdAction = document.createElement("td");

        var divAgentDetails = document.createElement("div");
        var spanAgentDetails = document.createElement("span");
        var html = "Agent Name : " + agent.Name + "<br/>"
            + "Address : " + agent.AddressLine1 + "<br />"
            + agent.AddressLine2 + "<br/>"
            + agent.AddressLine3 + "<br />"
            + "Landmark: " + agent.Landmark + "<br />"
            + "Pincode: " + agent.Pincode + "<br/>"
            + "City: " + agent.City + "<br />"
            + "State: " + agent.State + " (INDIA) <br/>"
            + "Contact No. " + agent.Phone;

        spanAgentDetails.innerHTML = html;
        divAgentDetails.appendChild(spanAgentDetails);

        var divAction = document.createElement("div");
        var btnAssign = document.createElement("button");
        btnAssign.textContent = "Assign Agent";
        btnAssign.style.width = "150px";
        btnAssign.setAttribute("id", i.toString());
        divAction.appendChild(btnAssign);

        tdAgentDetails.appendChild(divAgentDetails);
        tdAction.appendChild(divAction);

        tr.appendChild(tdAgentDetails);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        btnAssign.addEventListener("click", function () {
            var id = parseInt(this.id);
            var agent = deliveryAgents[id];
            var docref = firebase.firestore().collection("orders").doc(mOrder.order_id);

            // Set the "capital" field of the city 'DC'
            return docref.update({

                delivery_agent_id: agent.customer_id,
                Status: "Delivery Agent Assigned"
            })
                .then(function () {
                    alert("Delivery Agent Assigned");
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
        })

    }
}


