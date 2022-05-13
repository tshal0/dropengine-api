import { SalesOrder } from "@sales/domain/SalesOrder";
import { AddressDto } from "@sales/dto";

export class OrderResponseDto {
  id: string;
  orderName: string;
  orderStatus: string;
  orderDate: Date;
  orderNumber: number;
  customer: { name: string; email: string };
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  lineItems: any[];

  constructor(agg: SalesOrder) {
    const props = agg.props();
    this.id = props.id;
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
