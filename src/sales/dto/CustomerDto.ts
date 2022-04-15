import { IsNotEmpty, IsString } from "class-validator";

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
}
