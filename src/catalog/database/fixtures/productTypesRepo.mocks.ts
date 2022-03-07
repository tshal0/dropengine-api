import { Collection, UuidType } from "@mikro-orm/core";
import moment from "moment";
import { IProductTypeProps } from "catalog/domain/interfaces";
import { CreateProductTypeDto } from "catalog/dto/CreateProductTypeDto";
import { DbProductType } from "../../domain/entities/ProductType.entity";
import { DbProduct } from "@catalog/domain/entities/Product.entity";
jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
const now = moment().toDate();

export const baseDbProdTypeProps: IProductTypeProps = {
  uuid: "00000000-0000-0000-0000-000000000001",
  name: "MetalArt",
  productionData: {
    material: "Mild Steel",
    thickness: "0.06",
    route: "1",
  },
  option1: {
    name: "Color",
    values: [
      { name: "Color", value: "Black", enabled: true },
      { name: "Color", value: "White", enabled: true },
      { name: "Color", value: "Gold", enabled: true },
      { name: "Color", value: "Copper", enabled: true },
      { name: "Color", value: "Silver", enabled: true },
    ],
  },
  option2: {
    name: "Size",
    values: [
      { name: "Size", value: "12", enabled: true },
      { name: "Size", value: "15", enabled: true },
      { name: "Size", value: "18", enabled: true },
      { name: "Size", value: "24", enabled: true },
      { name: "Size", value: "30", enabled: true },
    ],
  },
  option3: null,
  livePreview: {
    enabled: true,
    name: "Live Preview Script - MetalArt",
    link: "link",
    version: "1.0.8",
  },
  createdAt: now,
  updatedAt: now,
  products: [],
};
export const baseDbProductType: DbProductType = {
  ...baseDbProdTypeProps,
  products: new Collection<DbProduct>(this),
  props: function (): IProductTypeProps {
    return { ...baseDbProdTypeProps };
  },
};

export const baseCreateProductTypeDto: CreateProductTypeDto = {
  name: "MetalArt",
  productionData: {
    material: "Mild Steel",
    thickness: "0.06",
    route: "1",
  },
  option1: {
    name: "Color",
    values: [
      { name: "Color", value: "Black", enabled: true },
      { name: "Color", value: "White", enabled: true },
      { name: "Color", value: "Gold", enabled: true },
      { name: "Color", value: "Copper", enabled: true },
      { name: "Color", value: "Silver", enabled: true },
    ],
  },
  option2: {
    name: "Size",
    values: [
      { name: "Size", value: "12", enabled: true },
      { name: "Size", value: "15", enabled: true },
      { name: "Size", value: "18", enabled: true },
      { name: "Size", value: "24", enabled: true },
      { name: "Size", value: "30", enabled: true },
    ],
  },
  option3: null,
  livePreview: null,
};
export const baseDbProductType2Props: IProductTypeProps = {
  uuid: "00000000-0000-0000-0000-000000000001",
  name: "MetalArt",
  productionData: {
    material: "Mild Steel",
    thickness: "0.06",
    route: "1",
  },
  option1: {
    name: "Color",
    values: [
      { name: "Color", value: "Black", enabled: true },
      { name: "Color", value: "White", enabled: true },
      { name: "Color", value: "Gold", enabled: true },
      { name: "Color", value: "Copper", enabled: true },
      { name: "Color", value: "Silver", enabled: true },
    ],
  },
  option2: {
    name: "Size",
    values: [
      { name: "Size", value: "12", enabled: true },
      { name: "Size", value: "15", enabled: true },
      { name: "Size", value: "18", enabled: true },
      { name: "Size", value: "24", enabled: true },
      { name: "Size", value: "30", enabled: true },
    ],
  },
  option3: null,
  livePreview: {
    enabled: true,
    name: "Live Preview Script - MetalArt",
    link: "link",
    version: "1.0.8",
  },
  updatedAt: now,
  createdAt: now,
  products: [],
};
export const baseDbProductType2: DbProductType = {
  ...baseDbProductType2Props,
  products: new Collection<DbProduct>(this),
  props: function (): IProductTypeProps {
    return;
  },
};
