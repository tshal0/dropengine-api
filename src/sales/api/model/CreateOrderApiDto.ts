import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { AddressDto, CustomerDto, LineItemPropertyDto } from "@sales/dto";

export class CreateOrderLineItemApiDto {
  sku?: string | undefined;
  variantId?: string | undefined;
  @IsNotEmpty()
  quantity: number;
  @IsArray()
  lineItemProperties: LineItemPropertyDto[];
}

export class CreateOrderApiDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;
  @IsOptional()
  orderName: string;
  @IsNotEmpty()
  @IsDate()
  orderDate: Date;
  @IsNotEmpty()
  orderNumber: string;
  @IsNotEmptyObject()
  @Type(() => CustomerDto)
  @ValidateNested()
  customer: CustomerDto;
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateOrderLineItemApiDto)
  lineItems: CreateOrderLineItemApiDto[];
  @IsNotEmptyObject()
  @Type(() => AddressDto)
  @ValidateNested()
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  updatedAt: Date;
  createdAt: Date;
}
