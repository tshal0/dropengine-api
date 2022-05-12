import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateLineItemDto, CustomerDto } from ".";
import { AddressDto } from "./AddressDto";
import { IsArrayOfObjects } from "./IsArrayOfObjects";

export class CreateOrderDto {
  constructor() {}

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
  @ValidateNested({
    message: `customer should contain both 'name' and 'email'.`,
  })
  customer: CustomerDto;

  @IsNotEmpty()
  @IsArrayOfObjects()
  @ValidateNested({ each: true })
  lineItems: CreateLineItemDto[];
  @IsNotEmpty()
  @ValidateNested()
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
