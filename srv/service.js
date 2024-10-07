const { update } = require('@sap/cds');
const cds = require('@sap/cds');
const { select } = require('@sap/cds/libx/_runtime/hana/execute');

module.exports = async function (params, srv) {
    let { PurchaseEnquiry, QuotationVehicle, Stocks, Quotation, PurchareVehicle } = this.entities;

    this.before('READ', [PurchareVehicle, QuotationVehicle], async (req) => {
        debugger
        const { purchaseEnquiryUuid } = req.data;

        const purchaseVehicles = await SELECT.from(PurchareVehicle)
            .where({ purchaseEnquiryUuid: purchaseEnquiryUuid });

        let quotationVehicles = [];

        let existingQuotation = await SELECT.one.from(Quotation)
            .where({ purchaseEnquiryUuid: purchaseEnquiryUuid });

        let quotationID = '';

        if (!existingQuotation) {
            const lastQuotation = await SELECT.one.from(Quotation).orderBy('quotationID desc');

            if (lastQuotation && lastQuotation.quotationID) {
                const lastIDNumber = parseInt(lastQuotation.quotationID.replace(/[^\d]/g, ''));
                quotationID = 'Q' + (lastIDNumber + 1).toString().padStart(3, '0');
            } else {
                quotationID = 'Q001';
            }

            // Insert the new Quotation record
            await INSERT.into(Quotation).entries({
                quotatationUuid: cds.utils.uuid(),
                quotationID: quotationID,
                purchaseEnquiryUuid: purchaseEnquiryUuid,
                totalPrice: '0',
                tax: '0',
                grandTotal: '0',
                deliveryLeadTime: '',
                validity: ''
            });
        } else {
            quotationID = existingQuotation.quotationID;
        }

        // Iterate over each purchaseVehicle and either insert or fetch QuotationVehicle
        for (let pv of purchaseVehicles) {
            let stockData = await SELECT.one.from(Stocks).where({ vehicleCode: pv.vehicleCode });

            if (stockData) {
                const pricePerUnit = parseFloat(stockData.pricePerUnit);
                const quantity = parseInt(pv.quantity);
                const actualPrice = pricePerUnit * quantity;

                // Check if QuotationVehicle already exists
                let existingQuotationVehicle = await SELECT.from(QuotationVehicle)
                    .where({
                        vehicleID: pv.vehicleID,
                        purchaseEnquiryUuid: purchaseEnquiryUuid
                    });

                if (existingQuotationVehicle.length === 0) {
                    const newQuotationVehicle = {
                        vehicleID: pv.vehicleID,
                        quotationID: quotationID,
                        vehicleCode: pv.vehicleCode,
                        purchaseEnquiryUuid: pv.purchaseEnquiryUuid,
                        vehicleName: pv.vehicleName,
                        vehicleColor: pv.vehicleColor,
                        quantity: pv.quantity,
                        pricePerUnit: pricePerUnit.toString(),
                        actualPrice: actualPrice.toString(),
                        discount: '0',
                        discountedPrice: actualPrice.toString(),
                        totalPrice: '',
                        tax: stockData.tax || '',
                        grandTotal: ''
                    };

                    await INSERT.into(QuotationVehicle).entries(newQuotationVehicle);
                    quotationVehicles.push(newQuotationVehicle);

                } else {

                    quotationVehicles.push(existingQuotationVehicle[0]);
                }
            }
        }
    });


    this.on('UPDATE', QuotationVehicle.draft, async (req) => {
        debugger;

        const { vehicleID, discount } = req.data;
        if (discount) {

            let quotationVehicle = await SELECT.one.from(QuotationVehicle.drafts).where({ vehicleID: vehicleID });

            if (!quotationVehicle) {
                return req.reject(404, 'Quotation Vehicle record not found');
            }

            const pricePerUnit = parseFloat(quotationVehicle.pricePerUnit);
            const quantity = parseInt(quotationVehicle.quantity);

            if (isNaN(pricePerUnit) || isNaN(quantity)) {
                return req.reject(400, 'Invalid pricePerUnit or quantity');
            }

            const discountValue = parseFloat(discount) || 0;
            var discountedPrice = pricePerUnit - (pricePerUnit * discountValue / 100);
            var discountedPrice = discountedPrice * quantity;


            await cds.update(QuotationVehicle.drafts).set({
                discountedPrice: discountedPrice.toString(),
                discount: discountValue.toString()
            }).where({ vehicleID: vehicleID });

            await cds.update(QuotationVehicle).set({
                discountedPrice: discountedPrice.toString(),
                discount: discountValue.toString()
            }).where({ vehicleID: vehicleID });

            const allQuotationVehicles = await SELECT.from(QuotationVehicle.drafts)
                .where({ purchaseEnquiryUuid: quotationVehicle.purchaseEnquiryUuid });

            let totalPrice = 0;
            let totalTax = 0;
            allQuotationVehicles.forEach(vehicle => {
                totalPrice += parseFloat(vehicle.discountedPrice || 0);
                totalTax += parseFloat(vehicle.tax);
            });

            var grandTotal = totalPrice + totalTax;

            await cds.update(Quotation.drafts).set({
                totalPrice: totalPrice.toString(),
                grandTotal: grandTotal.toString(),
                tax: totalTax.toString()
            }).where({ purchaseEnquiryUuid: quotationVehicle.purchaseEnquiryUuid });

            await cds.update(Quotation).set({
                totalPrice: totalPrice.toString(),
                grandTotal: grandTotal.toString(),
                tax: totalTax.toString()
            }).where({ purchaseEnquiryUuid: quotationVehicle.purchaseEnquiryUuid });
        }
    });

    this.on('postattach', async (req) => {
        debugger
        var editbut = 'false';
        if (req.data.p) {
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

        const vehicles = req.data.enquiryToVehicle;
        if (!vehicles || vehicles.length === 0) {
            return req.reject(400, 'No vehicles found in the Purchase Enquiry.');
        }

        let insufficientStockMessages = [];

        for (let vehicle of vehicles) {
            const { vehicleID, quantity } = vehicle;

            let quotationVehicle = await SELECT.one.from(QuotationVehicle).where({ vehicleID: vehicleID });

            if (!quotationVehicle) {
                insufficientStockMessages.push(`Quotation Vehicle record not found for Vehicle ID: ${vehicleID}`);
                continue;
            }

            let stockData = await SELECT.one.from(Stocks).where({ vehicleCode: quotationVehicle.vehicleCode });

            if (!stockData) {
                insufficientStockMessages.push(`Stock information not found for vehicle ${quotationVehicle.vehicleName}`);
                continue;
            }

            const stockQuantity = parseInt(stockData.quantity);
            const requestedQuantity = parseInt(quantity || quotationVehicle.quantity);  // Use provided quantity or existing one

            if (requestedQuantity > stockQuantity) {
                insufficientStockMessages.push(`Insufficient stock for vehicle ${quotationVehicle.vehicleName}. Available quantity: ${stockQuantity}, Requested quantity: ${requestedQuantity}`);
            } else {
                const pricePerUnit = parseFloat(quotationVehicle.pricePerUnit);
                const discountValue = parseFloat(quotationVehicle.discount) || 0;
                const discountedPrice = pricePerUnit * requestedQuantity * (1 - discountValue / 100);

                vehicle.discountedPrice = discountedPrice.toString();
                vehicle.quantity = requestedQuantity.toString();
            }
        }

        if (insufficientStockMessages.length > 0) {
            // return req.reject(400, insufficientStockMessages.join('<br>'));
            req.info(insufficientStockMessages.join('<br>'));
        }

    });
}