const { update } = require('@sap/cds');
const cds = require('@sap/cds');
const { select } = require('@sap/cds/libx/_runtime/hana/execute');
const axios = require('axios');
const { nextTick } = require('process');

module.exports = async function (params, srv) {
    var UUid;
    let { PurchaseEnquiry, QuotationVehicle, Stocks, Quotation, PurchareVehicle, PurchaseOrder, PurchaseOrderVehicle } = this.entities;

    this.before('READ', [PurchareVehicle], async (req) => {
        debugger

        const vehicles = await SELECT.from(PurchareVehicle);
        for (const vehicle of vehicles) {
            const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });
            if (stockData) {
                // Calculate the actual price based on quantity and stock price
                const quantity = parseInt(vehicle.quantity, 10); // Ensure quantity is an integer
                const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;

                vehicle.actualPrice = actualPrice.toString(); // Set actual price
                vehicle.discountedPrice = actualPrice.toString(); // Initially, discounted price is the same as actual price

                await cds.update(PurchareVehicle).set({
                    actualPrice: vehicle.actualPrice,
                    price: stockData.pricePerUnit.toString(),
                }).where({ vehicleCode: vehicle.vehicleCode });

            } else {
                req.error(404, `Vehicle with code ${vehicle.vehicleCode} not found in stock.`);
            }
        }
    });


    this.on('UPDATE', PurchareVehicle.draft, async (req, next) => {
        debugger;
        if (!req.data.vehicleID && !req.data.discount) {
            return next();
        } else {
            const { vehicleID, discount } = req.data;

            // Validate discount if provided
            if (discount) {
                if (discount < 0) {
                    return req.reject(400, 'Discount cannot be negative');
                }
                if (discount > 100) {
                    return req.reject(400, 'Discount must be below 100');
                }
                if (/[a-zA-Z]/.test(discount)) {
                    return req.reject(400, 'No alphabetic characters are allowed in the discount');
                }
            }

            // Fetch the vehicle record
            let Vehicle = await SELECT.one.from(PurchareVehicle.drafts).where({ vehicleID: vehicleID });

            if (!Vehicle) {
                return req.reject(404, 'PurchareVehicle Vehicle record not found');
            }

            const pricePerUnit = parseFloat(Vehicle.price);
            const quantity = parseInt(Vehicle.quantity);

            if (isNaN(pricePerUnit) || isNaN(quantity)) {
                return req.reject(400, 'Invalid pricePerUnit or quantity');
            }

            const discountValue = parseFloat(discount) || 0;

            let discountedPrice = pricePerUnit;

            if (discountValue >= 0 && discountValue <= 100) {
                discountedPrice -= (pricePerUnit * discountValue / 100);
            }

            discountedPrice *= quantity;

            // Update the PurchareVehicle draft record
            await cds.update(PurchareVehicle.drafts).set({
                discountedPrice: discountedPrice.toString(),
                discount: discountValue.toString()
            }).where({ vehicleID: vehicleID });

            // Call Calculate function to update PurchaseEnquiry
            await Calculate(Vehicle.purchaseEnquiryUuid);
            return next();
        }
    });

    async function Calculate(purchaseEnquiryUuid) {
        const vehicles = await SELECT.from(PurchareVehicle.drafts).where({ purchaseEnquiryUuid: purchaseEnquiryUuid });

        let totalPrice = 0;
        let totalTax = 0;

        for (const vehicle of vehicles) {
            totalPrice += parseFloat(vehicle.discountedPrice || 0);
            const taxAmount = (parseFloat(vehicle.price) * (parseFloat(vehicle.tax) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
            totalTax += taxAmount;
        }

        const grandTotal = totalPrice + totalTax;

        await cds.update(PurchaseEnquiry.drafts)
            .set({
                totalPrice: totalPrice.toString(),
                grandTotal: grandTotal.toString(),
                tax: totalTax.toString()
            })
            .where({ purchaseEnquiryUuid: purchaseEnquiryUuid });
    }


    this.on('postattach', async (req) => {
        debugger
        var editbut = 'false';
        if (req.data.p) {
            UUid = req.data.p;
            var status = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.p });
            console.log("functionImport triggered");
            if (status[0].status == 'Pending' || status[0].status == 'Nego') {
                editbut = "true";
            }
            return editbut;
        }
    });

    this.before('UPDATE', PurchaseEnquiry, async (req) => {
        debugger;
        //bypass handling
        const vehicles1 = req.data.enquiryToPVehicle;
        if (vehicles1) {
            for (let vehicle of vehicles1) {
                const { vehicleID, discount, discountedPrice } = vehicle;

                const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });
                await cds.update(PurchareVehicle)
                    .set({
                        discount: discount,
                        discountedPrice: discountedPrice,
                        tax: stockData.tax.toString()
                    })
                    .where({ vehicleID: vehicleID });
            }
        }
        //totalprice and grand total and taxamount
        let totalPrice = 0;
        let totalTax = 0;
        vehicles1.forEach(vehicle => {
            if (vehicle.discount != '0' || vehicle.discount == null) {
                totalPrice += parseFloat(vehicle.discountedPrice || 0);
                const taxAmount = (parseFloat(vehicle.price) * (parseFloat(vehicle.tax) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
                totalTax += taxAmount;
            } else {
                totalPrice += parseFloat(vehicle.actualPrice || 0);
                const taxAmount = (parseFloat(vehicle.price) * (parseFloat(vehicle.tax) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
                totalTax += taxAmount;
            }

        });

        var grandTotal = totalPrice + totalTax;

        req.data.totalPrice = totalPrice.toString();
        req.data.tax = totalTax.toString();
        req.data.grandTotal = grandTotal.toString();

        if (req.data.status == 'Pending' || req.data.status == 'Nego') {
            const vehicles = req.data.enquiryToPVehicle;
            if (!vehicles || vehicles.length === 0) {
                return req.reject(400, 'No vehicles found in the Purchase Enquiry.');
            }

            let insufficientStockMessages = [];

            for (let vehicle of vehicles) {
                const { vehicleID, quantity,vehicleColor } = vehicle;

                let purchaseVehicle = await SELECT.one.from(PurchareVehicle).where({ vehicleID: vehicleID });
                if (!purchaseVehicle) {
                    insufficientStockMessages.push(`Quotation Vehicle record not found for Vehicle ID: ${vehicleID}`);
                    continue;
                }

                
                let stockData = await SELECT.one.from(Stocks).where({ vehicleCode: purchaseVehicle.vehicleCode });
        
                if (!stockData) {
                    insufficientStockMessages.push(`Stock information not found for vehicle ${purchaseVehicle.vehicleName}`);
                    continue;
                }

                const stockQuantity = parseInt(stockData.quantity);
                const requestedQuantity = parseInt(quantity || purchaseVehicle.quantity); // Use provided quantity or existing one
                if (stockData.vehicleColor !== vehicleColor) {
                    insufficientStockMessages.push(`Color ${vehicleColor} is not available for vehicle ${purchaseVehicle.vehicleName}.`);
                }
                if (requestedQuantity > stockQuantity) {
                    insufficientStockMessages.push(`Insufficient stock for vehicle ${purchaseVehicle.vehicleName}. Available quantity: ${stockQuantity}, Requested quantity: ${requestedQuantity}`);
                }
            }
            if (insufficientStockMessages.length > 0) {
                // Use req.info to show the warning messages
                // req.info(insufficientStockMessages.join('<br>'));
                const warningMessage = `⚠️ Warning: The following issues were found:<br>${insufficientStockMessages.join('<br>')}`;
                return req.info(400, warningMessage);
            }
        }
        if (req.data.status == 'Approved') {
            debugger
            var workflowContent = {
                "context": {
                    "DocType": "AG",
                    "SalesOrg": "1000",
                    "DistChan": "10",
                    "Division": "00",
                    "qt_itemSet": [
                        {
                            "ItemNumber": "000010",
                            "Material": "100-100",
                            "Quantity": "100"
                        }
                    ],
                    "qt_partnerSet": [
                        {
                            "PartRole": "AG",
                            "PartNumber": "0000001000"
                        }
                    ]
                }
            };
            var TEST_DEST2 = await cds.connect.to("TEST_DEST1");
            // var result1 = await TEST_DEST2.get(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet('0020000172')?$expand=qt_itemSet,qt_partnerSet&$format=json`);
            var result1 = await TEST_DEST2.post(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet`, workflowContent);
            console.log(result1);
        }

    });

    // this.before('UPDATE', PurchaseEnquiry, async (req) => {
    //     debugger;
    //     var workflowContent = {
    //         "context": {
    //             "DocType": "AG",
    //             "SalesOrg": "1000",
    //             "DistChan": "10",
    //             "Division": "00",
    //             "qt_itemSet": [
    //                 {
    //                     "ItemNumber": "000010",
    //                     "Material": "100-100",
    //                     "Quantity": "100"
    //                 }
    //             ],
    //             "qt_partnerSet": [
    //                 {
    //                     "PartRole": "AG",
    //                     "PartNumber": "0000001000"
    //                 }
    //             ]
    //         }
    //     };
    //     var TEST_DEST2 = await cds.connect.to("TEST_DEST1");
    //     // var result1 = await TEST_DEST2.get(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet('0020000172')?$expand=qt_itemSet,qt_partnerSet&$format=json`);
    //     var result1 = await TEST_DEST2.post(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet`,workflowContent);
    //     console.log(result1);
    // });

}