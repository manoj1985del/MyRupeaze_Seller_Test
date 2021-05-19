const functions = require("firebase-functions");



exports.uploadAudience = functions.firestore.document("/users/{id}")
    .onWrite((change, context) => {
      
      const https = require('https')
      const data = JSON.stringify({
        projectKey: "VW50aXRsZSBQcm9qZWN0MTYxNDcxMjExMzYzMA==",
        audienceId: context.params.id,
        name: change.after.data().Name,
        email: change.after.data().Email,
        mobile: change.after.data().Phone,
        os_fcm_token: "",
        web_fcm_token: "",
        android_fcm_token: change.after.data().fcm,
        profile_path: "",
        active: change.after.data().Active,
        paramList: [
          {
              paramKey: "gender",
              paramValue: change.after.data().Gender
          },
          {
              paramKey: "city",
              paramValue: change.after.data().City
          },
          {
              paramKey: "anniversary",
              paramValue: change.after.data().anniversary
          },
          {
              paramKey: "child_birthday",
              paramValue: change.after.data().child_birthday
          },
          {
              paramKey: "customer_id",
              paramValue: change.after.data().customer_id
          },
          {
              paramKey: "date_of_birth",
              paramValue: change.after.data().date_of_birth
          },
          {
              paramKey: "last_order_date",
              paramValue: change.after.data().last_order_date
          },
          {
              paramKey: "last_payment_status",
              paramValue: change.after.data().last_payment_status
          }
        ]
      })
      
      const options = {
        hostname: 'api.cronberry.com',
        port: 443,
        path: '/cronberry/api/campaign/register-audience-data',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      const req = https.request(options, res => {
        //console.log(`Status Code: ${res.statusCode}`);
        let dataR = '';
        res.on('data', (chunk) => {
            dataR += chunk;
        });

        res.on('end', () => {
            //console.log('Body: ', JSON.stringify(dataR));
        });
      })

      req.on('error', error => {
        console.error(error)
      })

      req.write(data)
      req.end()
      return null;
    });



exports.uploadGuestAudience = functions.firestore.document("/guests/{id}")
    .onWrite((change, context) => {
      

      const https = require('https')
      const data = JSON.stringify({
        projectKey: "VW50aXRsZSBQcm9qZWN0MTYxNDcxMjExMzYzMA==",
        audienceId: context.params.id.substring(0, 15),
        name: "Guest"+Math.floor(Math.random() * 10000),
        email: "",
        mobile: "",
        os_fcm_token: "",
        web_fcm_token: "",
        android_fcm_token: change.after.data().fcm,
        profile_path: "",
        active: "",
        paramList: []
      })

      const options = {
        hostname: 'api.cronberry.com',
        port: 443,
        path: '/cronberry/api/campaign/register-audience-data',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }

      const req = https.request(options, res => {
        //console.log(`Status Code: ${res.statusCode}`);
        let dataR = '';
        res.on('data', (chunk) => {
            dataR += chunk;
        });

        res.on('end', () => {
            //console.log('Body: ', JSON.stringify(dataR));
        });
      })

      req.on('error', error => {
        console.error(error)
      })

      req.write(data)
      req.end()
      return null;
    });