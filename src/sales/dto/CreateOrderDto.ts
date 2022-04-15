import { CreateOrderApiDto } from "@sales/api";
import { CreateLineItemDto, CustomerDto } from ".";
import { AddressDto } from "./AddressDto";

export class CreateOrderDto {
  constructor(dto: CreateOrderApiDto, lineItems: CreateLineItemDto[]) {
    this.orderName = dto.orderName;
    this.orderDate = dto.orderDate;
    this.orderNumber = dto.orderNumber;
    this.customer = dto.customer;
    this.lineItems = lineItems;
    this.shippingAddress = dto.shippingAddress;
    this.billingAddress = dto.billingAddress;
    this.accountId = dto.accountId;
  }
  accountId: string;
  orderName: string;
  orderDate: Date;
  orderNumber: string;
  customer: CustomerDto;
  lineItems: CreateLineItemDto[];
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
