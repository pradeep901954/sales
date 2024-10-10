namespace db;
using {managed} from '@sap/cds/common';

entity PurchaseEnquiry {
key purchaseEnquiryUuid  : UUID;
  purchaseEnquiryID : String;
  contactPerson : String;
  address : String;
  phone : String;
  email : String;
  salesOrder : String;
  documentType : String;
  deliveryLocation : String;
  companyName : String;
  van : String;
  division : String;
  distributionchanells : String;
  totalPrice : String;
  tax : String;
  grandTotal : String;
  quotationID : String;
  status : String;
  enquiryToFile : Composition of many Files on enquiryToFile.fileToEnquiry = $self;
  enquiryToPVehicle : Composition of many PurchareVehicle on enquiryToPVehicle.vehicleTopurchaseEnquiry = $self;
  enquiryToVehicle : Composition of many QuotationVehicle on enquiryToVehicle.vehicleToEnquiry = $self;
  enquiryToQuotation : Composition of  many Quotation on enquiryToQuotation.quototionToEnquiry = $self;
  }

entity PurchareVehicle { 
    key vehicleID : UUID;
    vehicleCode : String;
    purchaseEnquiryUuid  : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : String;
    deliveryLocation : String;
    discountedPrice : String;
    price : String;
    tax : String;
    actualPrice : String;
    discount : String default '0';
    vehicleTopurchaseEnquiry : Association to one PurchaseEnquiry on vehicleTopurchaseEnquiry.purchaseEnquiryUuid= purchaseEnquiryUuid;
  }


entity Quotation {
key quotatationUuid : UUID; 
  quotationID : String;
  qID : String @readonly;
  purchaseEnquiryUuid  : String;
  totalPrice : String @readonly;
  tax : String @readonly;
  grandTotal : String @readonly;
  deliveryLeadTime : String;
  validity : String;
  quotationTOPO : Composition of one PurchaseOrder on quotationTOPO.pOToQuotation = $self;
  quotationToVehicle : Composition of many QuotationVehicle on quotationToVehicle.vehicleToQuotation = $self;
  quototionToEnquiry : Association to one PurchaseEnquiry on quototionToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity QuotationVehicle { 
    key vehicleID : UUID;
    qID : String;
    vehicleCode : String;
    purchaseEnquiryUuid  : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : String;
    discountedPrice : String;
    discount : String default 0;
    pricePerUnit : String;
    actualPrice : String;
    totalPrice  : String;
    tax : String;
    grandTotal : String;
    vehicleToQuotation : Association to one Quotation on vehicleToQuotation.qID = qID;
    vehicleToEnquiry : Association to one PurchaseEnquiry on vehicleToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity PurchaseOrder {
  key pUuid : UUID;
  poID : String;
  qID : String;
  contactPerson : String;
  address : String;
  phone : String;
  email : String;
  salesOrder : String;
  documentType : String;
  companyName : String;
  van : String;
  division : String;
  distributionchanells : String;
  status : String;
  totalPrice : String;
  tax : String;
  grandTotal : String;
  deliveryLocation : String;
  pOToPOVehicle : Composition of many PurchaseOrderVehicle on pOToPOVehicle.pOVehicleTopO = $self;
  pOToQuotation : Association to  many Quotation on pOToQuotation.qID = qID;
}

entity PurchaseOrderVehicle { 
    key vehicleUuidP : UUID;
    poID : String;
    vehicleCode : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : String;
    price : String;
    actualPrice : String;
    discount : String;
    discountedPrice : String;
    pOVehicleTopO: Association to one PurchaseOrder on pOVehicleTopO.poID = poID;
  }


entity SalesOrder {
  key soID : String;
  dealerCode : String;
  price : String;
  taxes : String;
  discount : String;
}

entity PaymentDetails{
  key paymentUuid : UUID;
  paymentId : String;
  transactionId: String;
  accountNo : String;
  amount : String;
  paymentMethod : String;
  status : String;
  soID : String;
 }

entity Stocks{
     key vehicleCode : String;
    vehicleName : String;
    vehicleColor : String;
    quantity : String;
    pricePerUnit : String;
    tax : String;
}

entity Files : managed {
    key id        : UUID;
        fkey      : UUID;

        @Core.MediaType  : mediaType
        content   : LargeBinary;

        @Core.IsMediaType: true
        mediaType : String;
        fileName  : String;
        size      : Integer;
        url       : String;
        fileToEnquiry  : Association to one PurchaseEnquiry on fileToEnquiry.purchaseEnquiryUuid = fkey;
        
}

