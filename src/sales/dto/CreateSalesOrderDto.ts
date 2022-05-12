import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { AddressDto, CustomerDto } from "@sales/dto";
import { CreateSalesOrderLineItemDto } from "./CreateSalesOrderLineItemDto";

export class CreateSalesOrderDto {
  constructor() {}
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
  @IsNotEmpty()
  @ValidateNested()
  customer: CustomerDto;
  @ValidateNested({ each: true })
  @IsArray()
  lineItems: CreateSalesOrderLineItemDto[];
  @IsNotEmpty()
  @ValidateNested()
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
