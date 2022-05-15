import {
  IMoney,
  IPersonalizationRule,
  IProductionData,
  IVariantOption,
  IWeight,
} from "@catalog/domain/model";

export interface ICatalogVariant {
  id: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: IVariantOption;
  option2: IVariantOption;
  option3: IVariantOption;
  productionData: IProductionData;
  personalizationRules: IPersonalizationRule[];
  manufacturingCost: IMoney;
  shippingCost: IMoney;
  weight: IWeight;
}
export class CatalogVariant implements ICatalogVariant {
  constructor(variant: ICatalogVariant) {
    this.id = variant.id;
    this.sku = variant.sku;
    this.image = variant.image;
    this.svg = variant.svg;
    this.type = variant.type;
    this.option1 = variant.option1;
    this.option2 = variant.option2;
    this.option3 = variant.option3;
    this.productionData = variant.productionData;
    this.personalizationRules = variant.personalizationRules;
    this.manufacturingCost = variant.manufacturingCost;
    this.shippingCost = variant.shippingCost;
    this.weight = variant.weight;
  }
  id: string;
  sku: string;
  image: string;
  svg: string;
  type: string;
  option1: IVariantOption;
  option2: IVariantOption;
  option3: IVariantOption;
  productionData: IProductionData;
  personalizationRules: IPersonalizationRule[];
  manufacturingCost: IMoney;
  shippingCost: IMoney;
  weight: IWeight;
}
