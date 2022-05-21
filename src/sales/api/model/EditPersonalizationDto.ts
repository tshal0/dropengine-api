import { LineItemProperty } from "@sales/features/PlaceOrder";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class EditPersonalizationDto {
  @IsNotEmpty()
  @Type(() => LineItemProperty)
  @ValidateNested({ each: true })
  personalization: LineItemProperty[];
}
