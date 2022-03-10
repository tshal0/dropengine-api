import { UUID } from "@shared/domain/valueObjects";
import { BaseDomainEvent } from "@shared/domain/events/BaseDomainEvents";
import moment from "moment";
import { IProductTypeProps } from "../interfaces";
import { ProductType } from "./ProductType";
import { CreateProductTypeDto } from "@catalog/dto/ProductType/CreateProductTypeDto";
import { DbProductType } from "../entities/ProductType.entity";
import { DbProduct } from "../entities/Product.entity";
import { Collection } from "@mikro-orm/core";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`ProductType`, () => {
  const mockProdTypeUuidStr = "00000000-0000-0000-0000-000000000001";
  const mockProdTypeUuid = UUID.from(mockProdTypeUuidStr).value();
  const mockGenerateProdTypeId = jest.fn().mockReturnValue(mockProdTypeUuid);

  const mockProdTypeId = 1;
  const now = moment().toDate();
  const dto: CreateProductTypeDto = {
    name: "MetalArt",
    productionData: {
      material: "Mild Steel",
      route: "1",
      thickness: "0.06",
    },
    livePreview: {
      enabled: false,
      link: null,
      name: null,
      version: null,
    },
    option1: {
      name: "Size",
      values: [
        { enabled: true, name: "Size", value: "12" },
        { enabled: true, name: "Size", value: "15" },
        { enabled: true, name: "Size", value: "18" },
        { enabled: true, name: "Size", value: "24" },
        { enabled: true, name: "Size", value: "30" },
      ],
    },
    option2: {
      name: "Color",
      values: [
        { enabled: true, name: "Color", value: "Black" },
        { enabled: true, name: "Color", value: "Gold" },
        { enabled: true, name: "Color", value: "Silver" },
        { enabled: false, name: "Color", value: "Red" },
      ],
    },
    option3: undefined,
  };
  const baseDbProdTypeProps: IProductTypeProps = {
    name: "MetalArt",
    uuid: mockProdTypeUuidStr,
    createdAt: now,
    updatedAt: now,
    livePreview: {
      enabled: false,
      link: null,
      name: null,
      version: null,
    },
    productionData: {
      material: "Mild Steel",
      route: "1",
      thickness: "0.06",
    },
    option1: {
      name: "Size",
      values: [
        { enabled: true, name: "Size", value: "12" },
        { enabled: true, name: "Size", value: "15" },
        { enabled: true, name: "Size", value: "18" },
        { enabled: true, name: "Size", value: "24" },
        { enabled: true, name: "Size", value: "30" },
      ],
    },
    option2: {
      name: "Color",
      values: [
        { enabled: true, name: "Color", value: "Black" },
        { enabled: true, name: "Color", value: "Gold" },
        { enabled: true, name: "Color", value: "Silver" },
        { enabled: false, name: "Color", value: "Red" },
      ],
    },
    option3: null,
    products: null,
  };
  const baseDbProdType: DbProductType = {
    ...baseDbProdTypeProps,
    products: new Collection<DbProduct>(this),
    props: function (): IProductTypeProps {
      return baseDbProdTypeProps;
    },
  };

  describe(`create`, () => {
    it(`should create a new ProductType`, () => {
      ProductType.generateUuid = mockGenerateProdTypeId;
      let result = ProductType.create(dto);
      expect(result.isFailure).toBe(false);
      let productType = result.value().props();
      expect(productType).toEqual(baseDbProdTypeProps);
    });
  });
  describe(`load`, () => {
    it(`should load the ProductType with the provided props`, () => {
      ProductType.generateUuid = mockGenerateProdTypeId;
      let result = ProductType.db(baseDbProdType);
      expect(result.isFailure).toBe(false);
      let productType = result.value();
      expect(productType.props()).toEqual(baseDbProdTypeProps);
    });
  });
});
