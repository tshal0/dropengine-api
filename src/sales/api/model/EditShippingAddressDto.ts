import { IAddress } from "@shared/domain";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class EditShippingAddressDto {
  @IsNotEmpty()
  @ValidateNested()
  shippingAddress: IAddress;
}
