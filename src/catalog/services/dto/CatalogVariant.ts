import {
  IPersonalizationRule,
  IProductionData,
  IVariantOption,
} from "@catalog/domain/model";
import { IDimension, IMoney, IWeight } from "@shared/domain";

export interface ICatalogVariant {
  id: string;
  productId: string;
  productTypeId: string;
  height: IDimension;
  width: IDimension;
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
  constructor(props?: ICatalogVariant | undefined) {
    if (props) {
      this.id = props.id;
      this.productId = props.productId;
      this.productTypeId = props.productTypeId;
      this.height = props.height;
      this.width = props.width;
      this.sku = props.sku;
      this.image = props.image;
      this.svg = props.svg;
      this.type = props.type;
      this.option1 = props.option1;
      this.option2 = props.option2;
      this.option3 = props.option3;
      this.productionData = props.productionData;
      this.personalizationRules = props.personalizationRules;
      this.manufacturingCost = props.manufacturingCost;
      this.shippingCost = props.shippingCost;
      this.weight = props.weight;
    }
  }
  productId: string;
  productTypeId: string;
  height: IDimension;
  width: IDimension;
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
