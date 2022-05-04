import { LineItemPropertyDto } from "@sales/dto";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class EditPersonalizationDto {
  @IsNotEmpty()
  @Type(() => LineItemPropertyDto)
  @ValidateNested({ each: true })
  personalization: LineItemPropertyDto[];
}
