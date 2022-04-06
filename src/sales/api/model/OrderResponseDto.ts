import { ShippingAddressDto } from ".";

export class OrderResponseDto {
  status: string;
  orderDate: Date;
  orderNumber: string;

  customer: { name: string; email: string };
  shippingAddress: ShippingAddressDto;
  lineItems: any[];

  constructor(public id: string) {}
}
