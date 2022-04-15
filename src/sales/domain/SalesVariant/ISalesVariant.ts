import { IMoney, IWeight, Money, Weight } from "@shared/domain";
import {
  ISalesPersonalizationRule,
  SalesPersonalizationRule,
} from "./SalesPersonalizationRule";
import { ISalesVariantOption, SalesVariantOption } from "./SalesVariantOption";

export interface ISalesVariantProductionData {
  material: string;
  thickness: string;
  route: string;
}

export interface ISalesVariantProps {
  id: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: ISalesVariantOption;
  option2: ISalesVariantOption;
  option3: ISalesVariantOption;
  manufacturingCost: IMoney;
  shippingCost: IMoney;
  weight: IWeight;
  productionData: ISalesVariantProductionData;
  personalizationRules: ISalesPersonalizationRule[];
}

export interface ISalesVariant {
  id: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: SalesVariantOption;
  option2: SalesVariantOption;
  option3: SalesVariantOption;
  manufacturingCost: Money;
  shippingCost: Money;
  weight: Weight;
  productionData: ISalesVariantProductionData;
  personalizationRules: SalesPersonalizationRule[];
}
