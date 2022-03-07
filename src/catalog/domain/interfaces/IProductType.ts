import { NumberID, UUID } from "@shared/domain";
import { IProductProps } from ".";
import {
  ProductTypeName,
  ProductTypeManufacturing,
  ProductTypeOption,
  IProductTypeProductionData,
  IProductTypeOption,
  ProductTypeUUID,
  Product,
} from "..";

import {
  ProductTypeLivePreview,
  IProductTypeLivePreview,
} from "../valueObjects/ProductType/ProductTypeLivePreview";

export interface IProductType {
  uuid: ProductTypeUUID;
  name: ProductTypeName;
  productionData: ProductTypeManufacturing;
  option1: ProductTypeOption;
  option2: ProductTypeOption;
  option3: ProductTypeOption;
  livePreview: ProductTypeLivePreview;
  products: Product[];
  updatedAt: Date;
  createdAt: Date;
}

export interface IProductTypeProps {
  uuid: string;
  name: string;
  productionData: IProductTypeProductionData;
  option1: IProductTypeOption;
  option2: IProductTypeOption;
  option3: IProductTypeOption;
  livePreview: IProductTypeLivePreview;
  products: IProductProps[];
  updatedAt: Date;
  createdAt: Date;
}
