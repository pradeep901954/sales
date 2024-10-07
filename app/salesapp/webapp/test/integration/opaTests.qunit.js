sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'salesapp/test/integration/FirstJourney',
		'salesapp/test/integration/pages/PurchaseEnquiryList',
		'salesapp/test/integration/pages/PurchaseEnquiryObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseEnquiryList, PurchaseEnquiryObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('salesapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseEnquiryList: PurchaseEnquiryList,
					onThePurchaseEnquiryObjectPage: PurchaseEnquiryObjectPage
                }
            },
            opaJourney.run
        );
    }
);