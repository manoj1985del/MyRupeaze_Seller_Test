function createPharmacyTable(sellerList) {
    deleteTableRows();
    createTableHeaders();

    for (var i = 0; i < sellerList.length; i++) {

        var tr = document.createElement("tr");

        var tdSellerDetails = document.createElement("td");
        var tdSellerAddress = document.createElement("td");
        var tdBankDetails = document.createElement("td");
        var tdFreezedAmount = document.createElement('td');
        var tdDisbursableAmount = document.createElement('td');
        var tdFreezedCommission = document.createElement("td");
        var tdAvailableCommission = document.createElement("td");
        var tdStatus = document.createElement("td");
        var tdAction = document.createElement("td");

        var seller = sellerList[i];
        if (seller.sellerType == "admin") {
            continue;
        }


        //ADD SELLER DETAILS
        var divSellerDetails = document.createElement("div");
        var spanSellerDetails = document.createElement("span");

        var subscriptionStatus = "<b>Subscription Status:</b> Not Subscribed";

        if (seller.subscription_end_date != null) {
            var ord = seller.subscription_end_date.toDate();
            var dd = ord.getDate();
            var mm = ord.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            var yyyy = ord.getFullYear();
            var formattedDay = dd + "-" + getMonthNmae(mm) + "-" + yyyy;

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setMilliseconds(0);
            today.setSeconds(0);

            if (today > seller.subscription_end_date.toDate()) {
                subscriptionStatus = "<b>Subscription Status:</b> Expired <br/> <b>Subscription Expired On:</b>" + formattedDay
            }

            else {
                subscriptionStatus = "<b>Subscription Status:</b> Active <br/> <b>Subscription Valid Till:</b>" + formattedDay
            }
        }



        var details = "<b> Company Name: " + seller.company_name + "</b><br />"
            + "Name: " + seller.seller_name + "<br/> <br />"

            + "<b>Contact No. </b>" + seller.mobile + "<br />"
            + "Email: " + seller.email + "<br />"
            + "Merchant id: " + seller.merchant_id + "<br/>"
            + "Seller id: " + seller.seller_id + "<br/>"
            + "GST: " + seller.gstin + "<br /><br />" + subscriptionStatus;


        spanSellerDetails.innerHTML = details;
        divSellerDetails.appendChild(spanSellerDetails);

        //SELLER ADDRESS
        var divSellerAddress = document.createElement("div");
        var sellerAddressSpan = document.createElement("span");
        var address = seller.address_line1 + "<br/>"
            + seller.address_line2 + "<br />"
            + seller.address_line3 + "<br /> <br />"
            + seller.city + " - " + seller.state + "<br />"
            + "Pincode: " + seller.pincode;

        sellerAddressSpan.innerHTML = address;
        divSellerAddress.appendChild(sellerAddressSpan);

        //BANK DETAILS
        var divBankDetails = document.createElement("div");
        var bankDetailsSpan = document.createElement("span");
        var bankdetails = "Account Holder Name: " + seller.account_holder_name + "<br/><br/>"
            + "<b>Account Number: " + seller.account_no + "</b><br/>"

            + "Bank Name: " + seller.bank_name + "<br />"
            + "IFSC Code: " + seller.ifsc + "<br />"
            + "PAN No." + seller.pan_no;

        bankDetailsSpan.innerHTML = bankdetails;
        divBankDetails.appendChild(bankDetailsSpan);

        //SELLER STATUS
        var divStatus = document.createElement("div");
        var statusSpan = document.createElement("span");
        statusSpan.innerHTML = seller.status;
        divStatus.appendChild(statusSpan);

        //create divs for amount fields
        var divFreezedAmount = document.createElement("div");
        var divDisbursableAmount = document.createElement("div");
        var divFreezedCommission = document.createElement("div");
        var divAvailableCommission = document.createElement("div");

        var freezedAmount = 0;
        var disbursableAmount = 0;
        var freezedCommission = 0;
        var availableCommission = 0;
        var arrOrders = [];

        var orderList = pharmacyOrdersMap.get(seller.seller_id);
        for (var orderNumber = 0; orderNumber < orderList.length; orderNumber++) {

            var order = orderList[orderNumber];
            //if order was a cancelled one.. no need to process it
            if (order.cancelled == true) {
                // ordersTobeSettled.set(seller.seller_id, order);
                continue;
            }
            var deliveryDate = order.delivery_date;
            var productList = order.product_names;

            var freezedAmountTemp = 0;
            var freezedCommissionTemp = 0;
            var disbursableAmountTemp = 0;
            var availableCommissionTemp = 0;
            for (var productNumber = 0; productNumber < productList.length; productNumber++) {
                var product = productList[productNumber];
                var amtToReduce = 0;
                var status = order.available_status[productNumber];

                if (status != "Available") {
                   continue;
                }

              
                var commission = mAppInfo.pharma_commission;

                var offer_price =  order.product_prices_total[productNumber];
                offer_price = offer_price - amtToReduce;
                var commission_value = (offer_price * commission) / 100;

                //If product is not delivered yet.. it will fall in freezed category
                if (deliveryDate == null) {
                    freezedAmountTemp += offer_price;
                    freezedCommissionTemp += commission_value;
                }
                else {
                    var dtDelivery = deliveryDate.toDate();

                    var dtCurrent = new Date();
                    var day = dtCurrent.getDate();
                    var month = dtCurrent.getMonth();
                    var year = dtCurrent.getFullYear();
                    if (month == 12) {
                        year = dtCurrent.getFullYear() - 1;
                    }

                    //var dtFreezeWindowStart;
                    if (day < 16) {
                        month = dtCurrent.getMonth() - 1;

                        dtFreezeWindowStart = new Date(year, month, 16);
                        //   dtFreezeWindowEnd = new Date(year, month, numberofDays);
                    }
                    else {
                        month = dtCurrent.getMonth();
                        year = dtCurrent.getFullYear();
                        //jaise hi 16 tarikh aayegi freezing window current month ki 1 tarikh se start ho jayegi
                        //aur ussey pehle ke sabhi orders available me aa jayege
                        dtFreezeWindowStart = new Date(year, month, 1);
                        var numberofDays = getDaysInMonth(month, year);
                        //if this is last day of the month move the orders from 1 to 15 in available range
                        if (day == numberofDays) {
                            dtFreezeWindowStart = new Date(year, month, 16);
                        }
                    }

                    //All the orders that were delivered before freezing window started will be available for disbursement
                    if (dtDelivery < dtFreezeWindowStart) {
                        disbursableAmountTemp += offer_price;
                        availableCommissionTemp += commission_value;
                        arrOrders.push(order);

                    }
                    else {
                        freezedAmountTemp += offer_price;
                        freezedCommissionTemp += commission_value;
                    }


                }

            }

            // var tradeChargesFreezed = 28;
            // var tradeChargesAvailable = 28;

            var tradeChargesFreezed = 0;
            var tradeChargesAvailable = 0;

            if (freezedAmountTemp == 0) {
                tradeChargesFreezed = 0;
            }

            if (disbursableAmountTemp == 0) {
                tradeChargesAvailable = 0;
            }

            var freezedDeductionsTaxable = freezedCommissionTemp + tradeChargesFreezed;
            var freezedTaxes = freezedDeductionsTaxable * 18 / 100;
            var freezedDeductions = freezedDeductionsTaxable + freezedTaxes;
            freezedAmount += freezedAmountTemp - freezedDeductions;
            freezedCommission += freezedDeductions;

            var disbursableDeductionsTaxable = availableCommissionTemp + tradeChargesAvailable;
            var disbursableTaxes = disbursableDeductionsTaxable * 18 / 100;
            var disbursableDeductions = disbursableDeductionsTaxable + disbursableTaxes;
            disbursableAmount += disbursableAmountTemp - disbursableDeductions;
            availableCommission += disbursableDeductions;


        }



        ordersTobeSettled.set(seller.seller_id, arrOrders);
        amountTobeSettled.set(seller.seller_id, disbursableAmount);

        var divAction = document.createElement("div");
        //Disable account button
        var divSuspendAccount = document.createElement("div");
        var btnSuspendAccount = document.createElement("button");
        btnSuspendAccount.textContent = "Suspend Account";
        btnSuspendAccount.setAttribute("id", i.toString());
        btnSuspendAccount.style.marginBottom = "10px";
        btnSuspendAccount.style.width = "150px";
        divSuspendAccount.appendChild(btnSuspendAccount);
        divAction.appendChild(divSuspendAccount);

        //Approve button
        var divApprove = document.createElement("div");
        var btnApprove = document.createElement("button");
        btnApprove.textContent = "Approve";
        btnApprove.style.width = "150px";
        btnApprove.setAttribute("id", i.toString());
        btnApprove.style.marginBottom = "10px";
        divApprove.appendChild(btnApprove);

        var divDownloadGSt = document.createElement("div");
        var btnDownloadGST = document.createElement("button");
        btnDownloadGST.textContent = "Download GST";
        btnDownloadGST.style.width = "150px";
        btnDownloadGST.setAttribute("id", i.toString());
        btnDownloadGST.style.marginBottom = "10px";
        divDownloadGSt.appendChild(btnDownloadGST);
        divApprove.appendChild(divDownloadGSt);

        var divDownloadCheque = document.createElement("div");
        var btnDownloadCheque = document.createElement("button");
        btnDownloadCheque.textContent = "Download Cheque";
        btnDownloadCheque.style.width = "150px";
        btnDownloadCheque.setAttribute("id", i.toString());
        btnDownloadCheque.style.marginBottom = "10px";
        divDownloadCheque.appendChild(btnDownloadCheque);
        divApprove.appendChild(divDownloadCheque);

        var divReject = document.createElement("div");
        var btnReject = document.createElement("button");
        btnReject.textContent = "Reject Application";
        btnReject.style.width = "150px";
        btnReject.setAttribute("id", i.toString());
        btnReject.style.marginBottom = "10px";
        divReject.appendChild(btnReject);
        divApprove.appendChild(divReject);

        var divDoctorDegrees = document.createElement('div');
        var btnViewDocDegree = document.createElement("button");
        btnViewDocDegree.textContent = "View Degree";
        btnViewDocDegree.style.width = "150px";
        btnViewDocDegree.setAttribute("id", i.toString());
        btnViewDocDegree.style.marginBottom = "10px";
        divDoctorDegrees.appendChild(btnViewDocDegree);
        divDoctorDegrees.style.display = "none";
        divApprove.appendChild(divDoctorDegrees);

        if (mSellerType == "doctor") {
            divDoctorDegrees.style.display = "block";
        }

        divAction.appendChild(divApprove);

        //Unsettled orders button button
        var divUnsettledOrders = document.createElement("div");
        var btnUnsettledOrders = document.createElement("button");
        btnUnsettledOrders.textContent = "Unsettled Orders";
        btnUnsettledOrders.style.width = "150px";
        btnUnsettledOrders.setAttribute("id", i.toString());
        btnUnsettledOrders.style.marginBottom = "10px";
        divUnsettledOrders.appendChild(btnUnsettledOrders);
        if (mSellerType == "doctor") {
            btnUnsettledOrders.textContent = "Unsettled Appointments";
        }

        var divSettleAccount = document.createElement("div");
        var btnSettleAccount = document.createElement("button");
        btnSettleAccount.textContent = "Settle Accounts";
        btnSettleAccount.style.width = "150px";
        btnSettleAccount.setAttribute("id", i.toString());
        btnSettleAccount.style.marginBottom = "10px";
        divSettleAccount.appendChild(btnSettleAccount);
        divUnsettledOrders.appendChild(divSettleAccount);
        divAction.appendChild(divUnsettledOrders);

        var divOfflineOrders = document.createElement("div");
        var btnOfflineInvoices = document.createElement("button");
        btnOfflineInvoices.textContent = "Offline Orders";
        btnOfflineInvoices.style.width = "150px";
        btnOfflineInvoices.setAttribute("id", i.toString());
        btnOfflineInvoices.style.marginBottom = "10px";
        divOfflineOrders.appendChild(btnOfflineInvoices);
        divUnsettledOrders.appendChild(divOfflineOrders);
        divAction.appendChild(divUnsettledOrders);

        var divOnlineOrders = document.createElement("div");
        var btnOnlineOrders = document.createElement("button");
        btnOnlineOrders.textContent = "Online Orders";
        btnOnlineOrders.style.width = "150px";
        btnOnlineOrders.setAttribute("id", i.toString());
        btnOnlineOrders.style.marginBottom = "10px";
        divOnlineOrders.appendChild(btnOnlineOrders);
        divUnsettledOrders.appendChild(divOnlineOrders);
        divAction.appendChild(divUnsettledOrders);


        if (seller.status == "pending" || seller.status == "suspended" || seller.status == "rejected") {
            divApprove.style.display = "block";
            divSuspendAccount.style.display = "none";
            divUnsettledOrders.style.display = "none";

            if (seller.status == "suspended") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Suspension Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);


            }

            if (seller.status == "rejected") {
                var divReason = document.createElement("div");
                var reasonSpan = document.createElement("span");
                reasonSpan.innerHTML = "Rejection Reason: " + seller.suspension_reason;
                reasonSpan.style.color = "#ff0000";
                divReason.appendChild(reasonSpan);
                divStatus.appendChild(divReason);
            }
        }

        else {
            divApprove.style.display = "none";
            divSuspendAccount.style.display = "block";
            divUnsettledOrders.style.display = "block";
        }

        if (disbursableAmount == 0) {
            btnSettleAccount.disabled = true;
        }




        var spanFreezeAmount = document.createElement("span");
        spanFreezeAmount.innerHTML = freezedAmount.toFixed(2);
        divFreezedAmount.appendChild(spanFreezeAmount);

        var spanDisbursableAmount = document.createElement("span");
        spanDisbursableAmount.innerHTML = disbursableAmount.toFixed(2);
        divDisbursableAmount.appendChild(spanDisbursableAmount);

        var spanFreezedCommission = document.createElement("span");
        spanFreezedCommission.innerHTML = freezedCommission.toFixed(2);
        divFreezedCommission.appendChild(spanFreezedCommission);

        var spanAvailablecommission = document.createElement("span");
        spanAvailablecommission.innerHTML = availableCommission.toFixed(2);
        divAvailableCommission.appendChild(spanAvailablecommission);

        tdSellerDetails.appendChild(divSellerDetails);
        tdSellerAddress.appendChild(divSellerAddress);
        tdBankDetails.appendChild(divBankDetails);
        tdFreezedAmount.appendChild(divFreezedAmount);
        tdFreezedCommission.appendChild(divFreezedCommission);
        tdDisbursableAmount.appendChild(divDisbursableAmount);
        tdAvailableCommission.appendChild(divAvailableCommission);
        tdStatus.appendChild(divStatus);
        tdAction.appendChild(divAction);

        if (mSellerType == "doctor") {
            tr.appendChild(tdDocImage);
        }
        tr.appendChild(tdSellerDetails);
        tr.appendChild(tdSellerAddress);
        tr.appendChild(tdBankDetails);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedAmount);
        }

        tr.appendChild(tdDisbursableAmount);
        if (mSellerType != "doctor") {
            tr.appendChild(tdFreezedCommission);
        }

        tr.appendChild(tdAvailableCommission);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAction);

        table.appendChild(tr);

        //Click Handlers

        btnOfflineInvoices.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_view_offline_invoice.html?sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnOnlineOrders.addEventListener("click", function () {
            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "admin_orders.html?type=all&sellerid=" + seller.seller_id;
            window.open(href, "_blank");
            //window.location.href = href;
        })

        btnSuspendAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            if (!confirm("Are you sure you want to suspend this account?\nAll the products of this seller will not be shown to buyers for purchase.")) {
                return;
            }

            var reason = prompt("Please enter suspension Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "suspended",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendAccountDisableMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })

        btnReject.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];


            var reason = prompt("Please enter rejection Reason:", "");
            if (reason == null || reason == "") {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, false));
                }

                Promise.all(promiseList).then(() => {

                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "rejected",
                        suspension_reason: reason
                    })
                        .then(function () {
                            sendApplicationRejectionMail(seller, reason);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });

                })
            })

        })


        btnApprove.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            divProgress.style.display = "block";
            divContent.style.display = "none";

            getSellerProducts(seller).then(() => {
                var promiseList = [];
                var productList = sellerProductMap.get(seller.seller_id);
                for (var i = 0; i < productList.length; i++) {
                    var product = productList[i];
                    promiseList.push(enableProducts(product.Product_Id, true));
                }

                Promise.all(promiseList).then(() => {
                    var washingtonRef = firebase.firestore().collection("seller").doc(seller.seller_id);
                    washingtonRef.update({
                        status: "approved"
                    })
                        .then(function () {
                            sendWelcomeEmail(seller);
                            window.location.href = "admin_seller_listing.html?type=all";


                        })
                        .catch(function (error) {
                            // The document probably doesn't exist.

                        });


                })

            })

        })

        btnDownloadGST.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.gst_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })

        btnViewDocDegree.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");

            if (link.download !== undefined) {
                link.setAttribute("href", seller.degree_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


        })


        btnDownloadCheque.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];

            var link = document.createElement("a");
            if (link.download !== undefined) {
                link.setAttribute("href", seller.cheque_url);
                link.setAttribute("target", "_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        })

        btnUnsettledOrders.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var href = "medicine_enquiries.html?type=unsettled&sellerid=" + seller.seller_id;
            if (mSellerType == "doctor") {
                href = "pending_appointments.html?type=unsettled&sellerType=admin";
            }

            window.open(href, "_blank");
        })

        btnSettleAccount.addEventListener("click", function () {

            var index = parseInt(this.id);
            var seller = sellerList[index];
            var amount = amountTobeSettled.get(seller.seller_id);
            var amt = amount.toFixed(2);

            var msg = "You are about to settle the amount of - " + amt + " with seller - " + seller.company_name + ".\nDo you wish to continue?";

            if (!confirm(msg)) {
                return;
            }

            divProgress.style.display = "block";
            divContent.style.display = "none";

            //var orderList = map
            var orderList = ordersTobeSettled.get(seller.seller_id);
            var promiseList = [];
            for (var i = 0; i < orderList.length; i++) {
                var order = orderList[i];
                promiseList.push(settleOrders(order));
            }
            Promise.all(promiseList).then(() => {
                var formattedDate = formatDate(dtFreezeWindowStart);
                sendAccountSettlementEmail(seller, formattedDate, amt);
                window.location.href = "admin_seller_listing.html?type=all";

            })


        })
    }
}
