using {  db}  from '../db/schema';

service MyService {

    @odata.draft.enabled
    entity PurchaseEnquiry as projection on db.PurchaseEnquiry;
    @odata.draft.bypass
     @Common.SideEffects  : {
        $Type : 'Common.SideEffectsType',
        SourceProperties : [
            'discount'
        ],
        TargetProperties : [
           'discountedPrice','actualPrice','price','tax'
        ],
    }
    entity PurchareVehicle as projection on db.PurchareVehicle;
    entity Quotation as projection on db.Quotation;
    @odata.draft.bypass
    entity QuotationVehicle as projection on db.QuotationVehicle;
    entity PurchaseOrder as projection on db.PurchaseOrder;
    entity PurchaseOrderVehicle as projection on db.PurchaseOrderVehicle;
    @odata.draft.enabled
    entity Sales as projection on db.SalesOrder;
    entity PaymentDetails as projection on db.PaymentDetails;
    entity Stocks as projection on db.Stocks;
    entity Files as projection on db.Files;
    function postattach(p : String) returns String;

}


