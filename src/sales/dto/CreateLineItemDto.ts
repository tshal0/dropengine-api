import { CatalogVariant } from "@catalog/services";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { LineItemPropertyDto } from "./LineItemPropertyDto";

export class CreateLineItemDto {
  id?: string;
  @IsNumber()
  @IsNotEmpty()
  lineNumber: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  variant: CatalogVariant;
  @IsNotEmpty()
  @IsArray()
  properties: LineItemPropertyDto[];
}
