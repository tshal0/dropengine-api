import { IsNotEmpty, IsString } from "class-validator";

export class EditCustomerDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  name: string;
}
