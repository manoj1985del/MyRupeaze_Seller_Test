const express = require('express');
const app = express();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });



const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

admin.initializeApp(functions.config().firebase);

let instance = new Razorpay({
    key_id: "rzp_live_dANcm3iqiuijPN",
    key_secret: "jGi7L1YUE5VRBFtlfTIF6Ahp"

})



/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: 'texpediscia@gmail.com',
        pass: 'shivyan@123'
    }
});


app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});
//exports.app = functions.https.onRequest(app);


app.post('/sendMail/:to/:subject', (req, res) => {
    //response.send('This is a test message');

    
    const mailOptions = {
        from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
        to: req.params.to, //Getting recipient's email by query string
        subject: req.params.subject,
        html: req.body

    };

    //Returning result
    return transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.send(err.toString());
        }
        return res.send('Email sent succesfully');
    });


});



app.post("/api/payment/order", (req, res) => {
    console.log(req.body);
    params = req.body;
    instance.orders.create(params).then((data) => {
        res.send({ "sub": data, "status": "success" });
        return null;
    }).catch((error) => {
        console.log("failed");
        res.send({ "sub": error, "status": "failed" });
        return null;
    })
});



app.post("/api/createpayment/:orderid/:amount/:name/:email/:mobile", (req, res) => {

    console.log("orderid = " + req.params.orderid);

    // console.log(req.params.orderid);
    // console.log(req);

    var options = {
        "key_id": "rzp_live_dANcm3iqiuijPN", // Enter the Key ID generated from the Dashboard
        "key_secret": "jGi7L1YUE5VRBFtlfTIF6Ahp",
        "amount": req.params.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "My Rupeaze",
        "description": "Subscription Transaction",
        "order_id": req.params.orderid, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            res.send(response);
        },
        "prefill": {
            "name": req.params.name,
            "email": req.params.email,
            "contact": req.params.mobile
        },
        "theme": {
            "color": "#F37254"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
});
//issue refund
app.post("/payments/:id/refund", (req, res) => {
    params = req.body;
    var id = req.params.id;
    console.log("payid = " + id);


    instance.payments.refund(id, params).then((data) => {
        res.send({ "sub": data, "status": "success" });
        return null;
    }).catch((err)=>{
        console.log("Error occured", err)
        return null;
    });

});

exports.app = functions.https.onRequest(app);

exports.createOrder = functions.firestore
    .document('orders/{order_id}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const order = snap.data();
        console.log("order id=" + order.order_id);
        var sellerid = order.seller_id;
        console.log("seller id=" + sellerid);
        var fcm = order.fcm;

        // let payload = {
        //     notification: {
        //         title: "My Rupeaze",
        //         body: "Order Placed Successfully."
        //     }
        // };

        // let options = {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24
        // };

        // admin.messaging().sendToDevice(fcm, payload, options)
        //     .then(function (response) {
        //         console.log("Successfully sent message: ", response);
        //         return null;
        //     })
        //     .catch(function (err) {
        //         console.log("Error occured", err)
        //         return null;
        //     })




        //db.doc('some/otherdoc')

        const db = admin.firestore();
        let documentRef = db.doc('seller/' + sellerid);

        documentRef.get().then((documentSnapshot) => {
            if (documentSnapshot.exists) {
                var seller = documentSnapshot.data();
                console.log(seller.email);

                var msg = "<h3>Hello " + seller.company_name + "</h3>"
                    + "<p>Greetings from My Rupeaze!!</p>"
                    + "<p> This is to inform you that you have received an order with order id: " + order.order_id + ". You are requested to confirm the order from your seller portal as soon as possible and dispatch it.</p>"
                    + "<p>In case of any questions please feel free to revert us back. </p>"
                    + "<p>Keep Selling with us!!</p>"
                    + "<p>With Kind Regards,<br/>"
                    + "My Rupeaze Team </p>";

                const mailOptions = {
                    from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
                    to: seller.email, //Getting recipient's email by query string
                    subject: "My Rupeaze: New Order Received (Order Id: " + order.order_id + ")",
                    html: msg

                };

                //Returning result
                return transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.send(err.toString());
                    }
                    return res.send('Email sent succesfully');
                });


            }
            return null;
        }).catch((err)=>{
            console.log("Error occured", err)
            return null;
        });



        return null;

    });


    exports.sendFcmForNewOrder = functions.firestore
    .document('orders/{order_id}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const order = snap.data();
        var status = order.Status;
        console.log("sending status - " + status);
       
        const fcm = order.fcm;

        let payload = {
            notification: {
                title: "My Rupeaze",
                body: status
            }
        };

        let options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        admin.messaging().sendToDevice(fcm, payload, options)
            .then(function (response) {
                console.log("Successfully sent message: ", response);
                return null;
            })
            .catch((err)=>{
                console.log("Error occured", err)
                return null;
            });


        return null;

    });

    exports.sendFcmWhenOrderStatusChanges = functions.firestore
    .document('orders/{order_id}')
    .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const order = change.after.data();
        var status = order.Status;
        console.log("sending status - " + status);
       
        const fcm = order.fcm;

        let payload = {
            notification: {
                title: "My Rupeaze",
                body: status
            }
        };

        let options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        admin.messaging().sendToDevice(fcm, payload, options)
            .then(function (response) {
                console.log("Successfully sent message: ", response);
                return null;
            })
            .catch((err)=>{
                console.log("Error occured", err)
                return null;
            });

        return null;

    });

//  exports.app = functions.https.onRequest(app);


exports.orderCancelled = functions.firestore
    .document('orders/{order_id}')
    .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const order = change.after.data();
        let orderid = order.order_id;
        let status = order.Status;
        let pickup_status = order.pickup_status;
        var sellerid = order.seller_id;


        if (status === "Cancelled") {
            let reason = order.cancellation_reason;

            const db = admin.firestore();
            let documentRef = db.doc('seller/' + sellerid);

            documentRef.get().then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    var seller = documentSnapshot.data();
                    console.log(seller.email);

                    var msg = "<h3>Hello " + seller.company_name + "</h3>"
                        + "<p>Greetings from My Rupeaze!!</p>"
                        + "<p> This is to inform you that customer has cancelled the order with order id: " + order.order_id + ". Please don't dispatch this item.</p>"
                        + "<p>In case of any questions please feel free to revert us back. </p>"
                        + "<p>Keep Selling with us!!</p>"
                        + "<p>With Kind Regards,<br/>"
                        + "My Rupeaze Team </p>";

                    const mailOptions = {
                        from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
                        to: seller.email, //Getting recipient's email by query string
                        subject: "My Rupeaze: Order Cancelled (Order Id: " + order.order_id + ")",
                        html: msg
                    };

                    //Returning result
                    return transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            return res.send(err.toString());
                        }
                        console.log("EMail sent");
                        return res.send('Email sent succesfully');
                    });


                }
                return null;
            }).catch((error) => {
                console.error('Error writing new message to database', error);
                return null;
            });




        }

        if(pickup_status === "rejected"){

            let reason = order.pickup_rejection_reason;

            const db = admin.firestore();
            let documentRef = db.doc('seller/' + sellerid);

            documentRef.get().then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    var seller = documentSnapshot.data();
                    console.log(seller.email);

                    var msg = "<h3>Hello " + seller.company_name + "</h3>"
                        + "<p>Greetings from My Rupeaze!!</p>"
                        + "<p> This is to inform you that local delivery agent  has declined to pickup the order with order id: " + order.order_id + ". Please don't dispatch this item.</p>"
                        + "<p> Reason of decline: " + reason
                        + "<p>Please reschedule it with some other delivery agent id.</p>"
                        + "<p>Keep Selling with us!!</p>"
                        + "<p>With Kind Regards,<br/>"
                        + "My Rupeaze Team </p>";

                    const mailOptions = {
                        from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
                        to: seller.email, //Getting recipient's email by query string
                        subject: "My Rupeaze: Order declined for picke by delivery agent (Order Id: " + order.order_id + ")",
                        html: msg
                    };

                    //Returning result
                    return transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            return res.send(err.toString());
                        }
                        console.log("EMail sent");
                        return res.send('Email sent succesfully');
                    });


                }
                return null;
            }).catch((error) => {
                console.error('Error writing new message to database', error);
                return null;
            });




        }

        if(pickup_status === "attempted delivery failed"){

            let reason = order.cancellation_reason;

            const db = admin.firestore();
            let documentRef = db.doc('seller/' + sellerid);

            documentRef.get().then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    var seller = documentSnapshot.data();
                    console.log(seller.email);

                    var msg = "<h3>Hello " + seller.company_name + "</h3>"
                        + "<p>Greetings from My Rupeaze!!</p>"
                        + "<p> This is to inform you that local delivery agent attempted delivery for order with order id: " + order.order_id + ". However order could not be delivered.</p>"
                        + "<p> Hence, the order has been cancelled."
                        + "<p> Reason of order cancellation: " + reason
                        + "<p>Please reschedule it with some other delivery agent id.</p>"
                        + "<p>Keep Selling with us!!</p>"
                        + "<p>With Kind Regards,<br/>"
                        + "My Rupeaze Team </p>";

                    const mailOptions = {
                        from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
                        to: seller.email, //Getting recipient's email by query string
                        subject: "My Rupeaze: Order declined for picke by delivery agent (Order Id: " + order.order_id + ")",
                        html: msg
                    };

                    //Returning result
                    return transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            return res.send(err.toString());
                        }
                        console.log("EMail sent");
                        return res.send('Email sent succesfully');
                    });


                }
                return null;
            }).catch((error) => {
                console.error('Error writing new message to database', error);
                return null;
            });




        }
        




        // if (status.includes("Order Rejected by Local Delivery Agent")) {
        //     let reason = order.pickup_rejection_reason;

        //     const db = admin.firestore();
        //     let documentRef = db.doc('seller/' + sellerid);

        //     documentRef.get().then((documentSnapshot) => {
        //         if (documentSnapshot.exists) {
        //             var seller = documentSnapshot.data();
        //             console.log(seller.email);

        //             var msg = "<h3>Hello " + seller.company_name + "</h3>"
        //                 + "<p>Greetings from My Rupeaze!!</p>"
        //                 + "<p> This is to inform you that local delivery agent (id : " + order.delivery_agent_id + ")  has declined to pickup the order with order id: " + order.order_id + ". Please don't dispatch this item.</p>"
        //                 + "<p> Reason of decline: " + reason
        //                 + "<p>Please reschedule it with some other delivery agent id.</p>"
        //                 + "<p>Keep Selling with us!!</p>"
        //                 + "<p>With Kind Regards,<br/>"
        //                 + "My Rupeaze Team </p>";

        //             const mailOptions = {
        //                 from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
        //                 to: seller.email, //Getting recipient's email by query string
        //                 subject: "My Rupeaze: Order Cancelled (Order Id: " + order.order_id + ")",
        //                 html: msg
        //             };

        //             //Returning result
        //             return transporter.sendMail(mailOptions, (err, info) => {
        //                 if (err) {
        //                     return res.send(err.toString());
        //                 }
        //                 console.log("EMail sent");
        //                 return res.send('Email sent succesfully');
        //             });


        //         }
        //         return null;
        //     }).catch((error) => {
        //         console.error('Error writing new message to database', error);
        //         return null;
        //     });




        // }


        return null;
    });


exports.orderReturned = functions.firestore
    .document('orders/{order_id}/products/{Product_Id}')
    .onUpdate((change, context) => {


        const product = change.after.data();
        let returnRequested = product.return_requested;
        if (returnRequested === false) {
            return null;
        }
        let orderid = product.order_id;
        let productName = product.Title;
        let productPrice = product.Offer_Price;
        let qty = product.Qty;
        let finalPrice = productPrice * qty;

        var sellerid = product.seller_id;


        let reason = product.return_reason;

        const db = admin.firestore();
        let documentRef = db.doc('seller/' + sellerid);

        documentRef.get().then((documentSnapshot) => {
            if (documentSnapshot.exists) {
                var seller = documentSnapshot.data();
                console.log(seller.email);

                var msg = "<h3>Hello " + seller.company_name + "</h3>"
                    + "<p>Greetings from My Rupeaze!!</p>"
                    + "<p> This is to inform you that customer has raised a return request against the order id: " + orderid + ".</p>"
                    + "<p>Product Name: " + productName
                    + "<br/>Reason: " + reason
                    + "<br />Price: " + productPrice
                    + "<br />Quantity: " + qty
                    + "<br />Total Price: " + finalPrice + "</p>"
                    + "<p>We will initiate a refund to customer and this amount will be deducted from your settlements.</p>"
                    + "<p>In case of any questions please feel free to revert us back. </p>"
                    + "<p>Keep Selling with us!!</p>"
                    + "<p>With Kind Regards,<br/>"
                    + "My Rupeaze Team </p>";

                const mailOptions = {
                    from: 'My Rupeaze <texpediscia@gmail.com>', //sender email
                    to: seller.email, //Getting recipient's email by query string
                    subject: "My Rupeaze: Order Return Request Raised (Order Id: " + orderid + ")",
                    html: msg
                };

                //Returning result
                return transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.send(err.toString());
                    }
                    console.log("EMail sent");
                    return res.send('Email sent succesfully');
                });


            }
            return null;
        }).catch((error) => {
            console.error('Error writing new message to database', error);
            return null;
        });



        return null;
    });





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//Sending messages at certain firestore events
//https://firebase.google.com/docs/functions/firestore-events


//to be uncommented later on

// exports.sendNotificationToTopic = functions.firestore.document('puppies/{uid}').onWrite(async (event)=>{
//     //let docId = event.after.id;
//     let title = event.after.get('title');
//     let content = event.after.get('content');
//     var message = {
//         notification:{
//             title:title,
//             body:content,
//         },
//         topic:'manojkumar',
//     };

//     let response = await admin.messaging().send(message);
//     console.log(response);


// });

// exports.sendNotificationToFCMToken = functions.firestore.document('orders/{mUid}').onWrite(async (event)=>{
//     const customer_id = event.after.get('customer_id');
//     const content = event.after.get('Status');
//    // const content = event.after.get('content');
//    const title = "My-Rupeaze Shopping";

//     let userDoc = await admin.firestore().doc(`users/${customer_id}`).get();
//     let fcmToken = userDoc.get('fcm');

//     var message ={
//         notification:{
//             title: title,
//             body: content, 
//         },
//         token: fcmToken,
//     }

//     let response = await admin.messaging().send(message);
//     console.log(response);
// });