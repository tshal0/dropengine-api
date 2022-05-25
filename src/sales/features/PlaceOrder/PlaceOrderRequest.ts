import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ILineItemProperty, OrderPlacedDetails } from "@sales/domain/events";
import { IAddress } from "@shared/domain";

export class PlaceOrderRequest {
  constructor(props?: OrderPlacedDetails | undefined) {
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
  @IsString()
  @IsNotEmpty()
  accountId: string;
  @IsOptional()
  orderName: string;
  @IsNotEmpty()
  @IsDate()
  orderDate: Date;
  @IsNotEmpty()
  @IsNumber()
  orderNumber: number;
  @IsNotEmpty()
  @ValidateNested()
  customer: { name: string; email: string };
  @ValidateNested({ each: true })
  @IsArray()
  lineItems: PlaceOrderRequestLineItem[];
  @IsNotEmpty()
  shippingAddress: IAddress;
  @IsOptional()
  billingAddress: IAddress;
}
export class LineItemProperty implements ILineItemProperty {
  constructor(props?: ILineItemProperty | undefined) {
    if (props) {
      this.name = props.name;
      this.value = props.value;
    }
  }
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  value: string;
}
export class PlaceOrderRequestLineItem {
  sku?: string | undefined;
  variantId?: string | undefined;
  @IsNotEmpty()
  quantity: number;
  @IsArray()
  properties: LineItemProperty[];
}
