import { toLower } from "lodash";
import { CreateVariantDto } from "../Variant/CreateVariantDto";

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
  personalizationRules: PersonalizationRuleDto[];
  // variants:      CreateProductVariantDto[];
}

export class PersonalizationRuleDto {
  [key: string]:any
  name:        string;
  label:       string;
  placeholder: string;
  required:    boolean;
  type:        string;
  maxLength:  number;
  pattern:    string;
  options:    string;
  font:       string;
}


