import { CreateOrderApiDto } from "@sales/api";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";
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
  @IsString()
  @IsNotEmpty()
  accountId: string;
  @IsString()
  @IsNotEmpty()
  orderName: string;
  @IsDate()
  @IsNotEmpty()
  orderDate: Date;
  @IsString()
  @IsNotEmpty()
  orderNumber: string;
  @Type(() => CustomerDto)
  @IsNotEmpty()
  @ValidateNested()
  customer: CustomerDto;
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  lineItems: CreateLineItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
