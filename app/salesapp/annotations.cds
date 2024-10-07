using MyService as service from '../../srv/service';
annotate service.PurchaseEnquiry with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Purchase Enquiry ID',
                Value : purchaseEnquiryID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Company Name',
                Value : companyName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'VAN Number',
                Value : van,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Division',
                Value : division,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Distribution Chanells',
                Value : distributionchanells,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Delivery Location',
                Value : deliveryLocation,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Qoutation',
            ID : 'Qoutation',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails',
                    Target : 'enquiryToVehicle/@UI.LineItem#VehicleDetails1',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price2',
                },
            ],
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'purchaseEnquiryID',
            Value : purchaseEnquiryID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'companyName',
            Value : companyName,
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Request',
    },
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryLocation,
            Label : 'deliveryLocation',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'In Process',
    },
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryLocation,
            Label : 'deliveryLocation',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Nego',
                        },
                    ],
                },
            ],
        },
        Text : 'Negositation',
    },
    UI.LineItem #tableView2 : [
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
        {
            $Type : 'UI.DataField',
            Value : deliveryLocation,
            Label : 'deliveryLocation',
        },
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Approved',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.HeaderInfo : {
        TypeName : 'Company Details ',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : companyName,
        },
    },
    UI.DeleteHidden : true,
    UI.FieldGroup #TotalAmount : {
        $Type : 'UI.FieldGroupType',
        Data : [
            // {
            //     $Type : 'UI.DataField',
            //     Value : purchaseEnquiryToQvehical.totalPrice,
            //     Label : 'Total Price',
            // },
            // {
            //     $Type : 'UI.DataField',
            //     Value : purchaseEnquiryToQvehical.tax,
            //     Label : 'Tax',
            // },
            // {
            //     $Type : 'UI.DataField',
            //     Value : purchaseEnquiryToQvehical.grandTotal,
            //     Label : 'Grand Total',
            // },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.tax,
                Label : 'tax',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.totalPrice,
                Label : 'totalPrice',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.grandTotal,
                Label : 'grandTotal',
            },
        ],
    },
    UI.FieldGroup #Price1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.grandTotal,
                Label : 'grandTotal',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.tax,
                Label : 'tax',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.totalPrice,
                Label : 'totalPrice',
            },
        ],
    },
    UI.FieldGroup #Price2 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.totalPrice,
                Label : 'Total Price',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.tax,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToQuotation.grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
);

annotate service.PurchaseEnquiry with {
    purchaseEnquiryID @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    // customerID @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    companyName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    van @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    division @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    distributionchanells @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    deliveryLocation @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with @(
    UI.LineItem #Quotation : [
        {
            $Type : 'UI.DataField',
            Value : vehicleCode,
            Label : 'vehicleCode',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'vehicleName',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'vehicleColor',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        // {
        //     $Type : 'UI.DataField',
        //     Value : price,
        //     Label : 'price',
        // },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'actualPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'discount',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'discountedPrice',
        },
    ],
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : vehicleCode,
            Label : 'Vehicle Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        // {
        //     $Type : 'UI.DataField',
        //     Value : price,
        //     Label : 'Price',
        // },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'ActualPrice',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
    ],
    UI.LineItem #VehicleDetails1 : [
        {
            $Type : 'UI.DataField',
            Value : vehicleCode,
            Label : 'Vehicle Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount in Persent',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
    ],
);

annotate service.QuotationVehicle with {
    discountedPrice @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    // price @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    vehicleName @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    vehicleCode @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    grandTotal @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    tax @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.QuotationVehicle with {
    pricePerUnit @Common.FieldControl : #ReadOnly
};

