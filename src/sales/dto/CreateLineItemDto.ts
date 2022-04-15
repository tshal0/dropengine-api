import { CatalogVariant } from "@catalog/services";
import { LineItemPropertyDto } from "./LineItemPropertyDto";

export class CreateLineItemDto {
  id?: string;
  lineNumber: number;
  quantity: number;
  variant: CatalogVariant;
  properties: LineItemPropertyDto[];
}
