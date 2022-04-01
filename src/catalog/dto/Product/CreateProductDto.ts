import { toLower } from "lodash";
import { CreateProductVariantDto } from "../ProductVariant/CreateProductVariantDto";

export class CreateProductDto {
  id?:          string | undefined;
  type:         string;
  productTypeId: string;
  sku:           string;
  tags:          string;
  pricingTier:   string;
  // categories:    string;
  image:         string;
  svg:           string;
  customOptions: CustomOptionDto[];
  // variants:      CreateProductVariantDto[];
}

export class CustomOptionDto {
  [key: string]:any
  name:        string;
  label:       string;
  placeholder: string;
  required:    boolean;
  type:        string;
  maxLength?:  number;
  pattern?:    string;
  options?:    string;
  font?:       string;
}


