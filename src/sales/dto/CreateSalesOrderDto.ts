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
import { AddressDto, CustomerDto } from "@sales/dto";
import { CreateSalesOrderLineItemDto } from "./CreateSalesOrderLineItemDto";
import { AuthenticatedUser } from "@shared/decorators";
import { CreateOrderApiDto } from "@sales/api";

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
  @IsNotEmptyObject()
  @Type(() => CustomerDto)
  @ValidateNested()
  customer: CustomerDto;
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateSalesOrderLineItemDto)
  lineItems: CreateSalesOrderLineItemDto[];
  @IsNotEmptyObject()
  @Type(() => AddressDto)
  @ValidateNested()
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
