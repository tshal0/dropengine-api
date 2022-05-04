import { AddressDto } from "@sales/dto";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class EditShippingAddressDto {
  @IsNotEmpty()
  @Type(() => AddressDto)
  @ValidateNested()
  shippingAddress: AddressDto;
}
