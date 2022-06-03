import { SalesOrder } from "@sales/domain";
import { IAddress } from "@shared/domain";

export class OrderResponse {
  id: string;
  orderName: string;
  orderStatus: string;
  orderDate: Date;
  orderNumber: number;
  customer: { name: string; email: string };
  shippingAddress: IAddress;
  billingAddress: IAddress;
  lineItems: any[];
  accountId: string;
  constructor(order: SalesOrder) {
    const props = order.raw();
    this.id = props.id;
    this.accountId = props.seller;
    this.orderName = props.orderName;
    this.orderStatus = props.orderStatus;
    this.orderDate = props.createdAt;
    this.orderNumber = props.orderNumber;
    this.orderName = props.orderName;
    this.customer = props.customer;
    this.shippingAddress = props.shippingAddress;
    this.billingAddress = props.billingAddress;
    this.lineItems = props.lineItems;
  }
}
