export interface Customer {
    id: number
    customerNo: string
    name: string
    invoiceType: string
    userDef2: string
    backgroundColor: number
    foregroundColor: number
    hold: boolean
  }
  
  export interface Phone {
    number: string
  }
  
  export interface Contact {
    name: string
    email?: string
    phone?: Phone
    cell?: Phone
    fax?: Phone
  }
  
  export interface Address {
    id: number
    name?: string
    country: string
    city: string
    provState: string
    postalCode: string
    line1?: string
    line2?: string
    line3?: string
    line4?: string
  }
  
  export interface ShippingAddress extends Address {
    shipCode?: string
    shipId?: string
    shipDescription: string
  }
  
  export interface EdiAssociation {
    id: number
    status: string
  }
  
  export interface Links {
    self: string
  }
  
  export interface Udf {
    [key: string]: any
  }
  
  export interface Order {
    id: number
    orderNo: string
    invoiceNo: string | null
    customer: Customer
    status: string
    type: string
    hold: boolean
    orderDate: string
    invoiceDate: string | null
    requiredDate: string
    customerPO: string | null
    batchNo: string | null
    division: string
    location: string
    profitCenter: string | null
    fob: string
    incoterms: string | null
    incotermsPlace: string | null
    salespersonNo: string
    territoryCode: string
    freight: string
    weight: string
    discount: string
    totalDiscount: string
    subtotal: string
    total: string
    baseTotal: string
    total2: string
    totalOrdered: string
    subtotalOrdered: string
    backordered: boolean
    totalBackorderQty: string
    grossProfit: string
    grossProfitMargin: string
    grossProfit2: string
    totalCostAverage: string
    totalCostAverage2: string
    totalCostCurrent: string
    totalCostCurrent2: string
    totalCostStandard: string
    totalCostStandard2: string
    phaseId: string
    termsCode: string
    termsText: string
    referenceNo: string | null
    currency: string
    shippingCarrier: string | null
    shipDate: string | null
    trackingNo: string | null
    jobNo: string | null
    jobAccountNo: string | null
    wasQuoteNo: string | null
    quoteExpires: string | null
    amountPaid: string
    amountUnpaid: string
    amountUnpaidOrdered: string
    percentPaid: string
    address: Address
    shippingAddress: ShippingAddress
    contact: Contact
    ediAssociation: EdiAssociation
    created: string
    createdBy: string
    modified: string
    modifiedBy: string
    deleted: string | null
    deletedBy: string | null
    udf: Udf
    links: Links
  }