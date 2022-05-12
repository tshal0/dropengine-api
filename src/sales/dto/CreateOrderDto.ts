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
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsNotEmpty()
  @IsArrayOfObjects()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  lineItems: CreateLineItemDto[];
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
}
