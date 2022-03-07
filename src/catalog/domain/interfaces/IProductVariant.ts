import {
  UUID,
  NumberID,
  Dimension,
  Money,
  Weight,
  IDimension,
  IWeight,
  IMoney,
} from "@shared/domain";
import { IProductProps } from ".";
import { ProductImage, VariantSKU } from "..";
import { ProductVariantNID } from "../valueObjects/ProductVariant/VariantID";
import { VariantOption } from "../valueObjects/ProductVariant/VariantOption";
import { ProductVariantUUID } from "../valueObjects/ProductVariant/VariantUUID";

export interface IProductVariant {
  uuid: ProductVariantUUID;
  sku: VariantSKU;
  image?: ProductImage;

  height: Dimension;
  width: Dimension;
  weight: Weight;

  option1: VariantOption;
  option2: VariantOption;
  option3: VariantOption;

  manufacturingCost: Money;
  shippingCost: Money;

  createdAt: Date;
  updatedAt: Date;
}
export interface IProductVariantProps {
  uuid: string;
  sku: string;
  image: string;
  height: IDimension;
  width: IDimension;
  weight: IWeight;
  option1?: IVariantOption;
  option2?: IVariantOption;
  option3?: IVariantOption;
  manufacturingCost?: IMoney;
  shippingCost?: IMoney;

  createdAt: Date;
  updatedAt: Date;

  product?: IProductProps | undefined;
}

export interface IVariantOption {
  name: string;
  option: string;
  enabled: boolean;
}
