import { ShippingAddressDto } from "./ShippingAddressDto";
import { CustomerDto } from "./CustomerDto";
import { LineItemPropertyDto } from "./LineItemPropertyDto";

export class CreateOrderLineItemDto {
  sku: string;
  variantId: string;
  quantity: number;
  lineItemProperties: LineItemPropertyDto[];
}

export class CreateOrderDto {
  orderDate: Date;
  orderNumber: string;
  customer: CustomerDto;
  lineItems: CreateOrderLineItemDto[];
  shippingAddress: ShippingAddressDto;
}
