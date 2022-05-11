import {
  IsArray,
  IsNotEmpty
} from "class-validator";
import { LineItemPropertyDto } from "@sales/dto";

export class CreateSalesOrderLineItemDto {
  sku?: string | undefined;
  variantId?: string | undefined;
  @IsNotEmpty()
  quantity: number;
  @IsArray()
  lineItemProperties: LineItemPropertyDto[];
}
