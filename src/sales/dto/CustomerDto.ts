import { IsNotEmpty, IsString } from "class-validator";

export class CustomerDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
}
