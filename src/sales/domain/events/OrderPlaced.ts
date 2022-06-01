import { ICatalogVariant } from "@catalog/services";
import { Address, IAddress } from "@shared/domain";
import { ISalesMerchant, SalesMerchant } from "../model/SalesMerchant";
import {
  EventSchemaVersion,
  SalesOrderEvent,
  SalesOrderEventName,
} from "./SalesOrderEvent";

export interface ILineItemProperty {
  name: string;
  value: string;
}

export class PlacedOrderLineItem {
  lineNumber: number;
  quantity: number;
  variant: ICatalogVariant;
  properties: ILineItemProperty[];
}

export interface IPlacedOrderCustomer {
  name: string;
  email: string;
}
export interface IOrderPlacedDetails {
  accountId: string;
  orderName: string;
  orderDate: Date;
  orderNumber: number;
  customer: IPlacedOrderCustomer;
  lineItems: PlacedOrderLineItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  merchant: ISalesMerchant;
}
export class OrderPlacedDetails {
  constructor(props?: IOrderPlacedDetails | undefined) {
    if (props) {
      this.accountId = props.accountId;
      this.orderName = props.orderName;
      this.orderDate = props.orderDate;
      this.orderNumber = props.orderNumber;
      this.customer = props.customer;
      this.lineItems = props.lineItems;
      this.shippingAddress = props.shippingAddress;
      this.billingAddress = props.billingAddress;
      this.merchant = new SalesMerchant(props.merchant).raw();
    }
  }
  accountId: string = null;
  orderName: string = "";
  orderDate: Date = new Date("2021-01-01T00:00:00.000Z");
  orderNumber: number = 0;
  customer: IPlacedOrderCustomer = { email: "", name: "" };
  lineItems: PlacedOrderLineItem[] = [];
  shippingAddress: IAddress = new Address().raw();
  billingAddress: IAddress = new Address().raw();
  merchant: ISalesMerchant = new SalesMerchant().raw();
}

export class SalesOrderPlaced extends SalesOrderEvent<OrderPlacedDetails> {
  constructor(id: string, details: OrderPlacedDetails) {
    super(
      id,
      SalesOrderPlaced.name,
      SalesOrderEventName.OrderPlaced,
      details,
      EventSchemaVersion.v1
    );
  }
}
