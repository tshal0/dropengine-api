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
  constructor(
    dto?: CreateOrderApiDto | undefined,
    user?: AuthenticatedUser | undefined
  ) {
    this.accountId = dto?.accountId;
    this.orderName = dto?.orderName;
    this.orderDate = dto?.orderDate;
    this.orderNumber = dto?.orderNumber;
    this.customer = dto?.customer;
    this.lineItems = dto?.lineItems;
    this.shippingAddress = dto?.shippingAddress;
    this.billingAddress = dto?.billingAddress;
    this.user = user;
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
  @IsNotEmptyObject()
  @IsNotEmpty()
  @Type(() => AuthenticatedUser)
  @ValidateNested()
  user: AuthenticatedUser;
}
