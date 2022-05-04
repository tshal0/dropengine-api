import { IsNotEmpty, IsString } from "class-validator";

export class LineItemPropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  value: string;
}
