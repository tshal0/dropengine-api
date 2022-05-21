import { ICatalogVariant } from "@catalog/services";
import { Address, IAddress } from "@shared/domain";
import {
  EventSchemaVersion,
  SalesOrderEvent,
  SalesOrderEventName,
} from "./SalesOrderEvent";

export interface ILineItemProperty {
  name: string;
  value: string;
}

export interface ILineItemGeneratedDetails {
  lineNumber: number;
  quantity: number;
  variant: ICatalogVariant;
  properties: ILineItemProperty[];
}

export interface ICustomerCreatedDetails {
  name: string;
  email: string;
}
export interface IOrderPlacedDetails {
  accountId: string;
  orderName: string;
  orderDate: Date;
  orderNumber: number;
  customer: ICustomerCreatedDetails;
  lineItems: ILineItemGeneratedDetails[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
}
export class OrderPlacedDetails {
  constructor(props?: IOrderPlacedDetails) {
    if (props) {
      this.accountId = props.accountId;
      this.orderName = props.orderName;
      this.orderDate = props.orderDate;
      this.orderNumber = props.orderNumber;
      this.customer = props.customer;
      this.lineItems = props.lineItems;
      this.shippingAddress = props.shippingAddress;
      this.billingAddress = props.billingAddress;
    }
  }
  accountId: string = null;
  orderName: string = "";
  orderDate: Date = new Date("2021-01-01T00:00:00.000Z");
  orderNumber: number = 0;
  customer: ICustomerCreatedDetails = { email: "", name: "" };
  lineItems: ILineItemGeneratedDetails[] = [];
  shippingAddress: IAddress = new Address().raw();
  billingAddress: IAddress = new Address().raw();
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
