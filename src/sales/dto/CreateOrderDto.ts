import { CreateOrderApiDto } from "@sales/api";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { CreateLineItemDto, CustomerDto } from ".";
import { AddressDto } from "./AddressDto";
import { IsArrayOfObjects } from "./IsArrayOfObjects";

export class CreateOrderDto {
  constructor(dto?: CreateOrderApiDto | undefined) {
    this.orderName = dto?.orderName;
    this.orderDate = dto?.orderDate;
    this.orderNumber = dto?.orderNumber;
    this.customer = dto?.customer;
    this.shippingAddress = dto?.shippingAddress;
    this.billingAddress = dto?.billingAddress;
    this.accountId = dto?.accountId;
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

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
