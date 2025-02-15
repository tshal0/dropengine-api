export class CreateProductDto {
  id?: number | undefined;
  type: string;
  sku: string;
  tags: string;
  pricingTier: string;
  categories: string;
  image: string;
  svg: string;
  personalizationRules: PersonalizationRuleDto[];
}
export class PersonalizationRuleDto {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  maxLength: number;
  pattern: string;
  options: string;
}
