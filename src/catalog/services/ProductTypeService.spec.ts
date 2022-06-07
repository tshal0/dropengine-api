import { ProductTypesRepository } from "@catalog/database";
import { DbProductType } from "@catalog/database/entities";
import {
  IProductTypeProps,
  LivePreview,
  ProductType,
  ProductTypes,
  ProductTypeSlugs,
} from "@catalog/model";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { spyOnDate } from "@shared/mocks";
import { CreateProductTypeDto } from "..";
import { ProductTypeService } from "./ProductTypeService";

spyOnDate();
describe("ProductTypeService", () => {
  let module: TestingModule;
  let service: ProductTypeService;
  let prodTypeProps: IProductTypeProps;

  let prodType: ProductType;

  let dbProdType: DbProductType;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(ProductTypeService);
    prodTypeProps = {
      id: 1,
      name: ProductTypes.MetalArt,
      slug: ProductTypeSlugs.MetalArt,
      image: "MOCK_IMG",
      productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
      option1: {
        enabled: true,
        name: "Size",
        values: [{ enabled: true, value: '12"' }],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [{ enabled: true, value: "Black" }],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      livePreview: new LivePreview().raw(),
      products: [],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    };
    prodType = new ProductType(prodTypeProps);
    dbProdType = new DbProductType();
    dbProdType.id = 1;
    dbProdType.image = prodTypeProps.image;
    dbProdType.name = prodTypeProps.name;
    dbProdType.slug = prodTypeProps.slug;
    dbProdType.productionData = prodTypeProps.productionData;
    dbProdType.option1 = prodTypeProps.option1;
    dbProdType.option2 = prodTypeProps.option2;
    dbProdType.option3 = prodTypeProps.option3;
    dbProdType.livePreview = prodTypeProps.livePreview;
    dbProdType.createdAt = prodTypeProps.createdAt;
    dbProdType.updatedAt = prodTypeProps.updatedAt;
  });

  describe("create", () => {
    let dto: CreateProductTypeDto;
    beforeEach(async () => {
      dto = new CreateProductTypeDto();
      dto.id = prodTypeProps.id;
      dto.image = prodTypeProps.image;
      dto.name = prodTypeProps.name;
      dto.slug = prodTypeProps.slug;
      dto.productionData = prodTypeProps.productionData;
      dto.option1 = prodTypeProps.option1;
      dto.option2 = prodTypeProps.option2;
      dto.option3 = prodTypeProps.option3;
      dto.livePreview = prodTypeProps.livePreview;
    });

    it("should create a valid ProductType", async () => {
      const saveFn = jest.fn().mockResolvedValue(dbProdType);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductTypesRepository)
        .useValue({
          save: saveFn,
        })
        .compile();
      const repo = await module.resolve(ProductTypesRepository);
      const saveSpy = jest.spyOn(repo, "save");

      service = await module.resolve(ProductTypeService);
      // WHEN
      const result = await service.findAndUpdateOrCreate(dto);
      // THEN
      expect(result.raw()).toEqual(prodTypeProps);
      expect(saveSpy).toBeCalledWith(
        new ProductType({
          id: dto.id,
          name: dto.name,
          slug: dto.slug,
          image: dto.image,
          productionData: dto.productionData,
          option1: dto.option1,
          option2: dto.option2,
          option3: dto.option3,
          livePreview: dto.livePreview,
          products: [],
          updatedAt: undefined,
          createdAt: undefined,
        })
      );
    });
  });
  describe("query", () => {
    it("should return list of entities", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductTypesRepository)
        .useValue({
          query: jest.fn().mockResolvedValue([prodType]),
        })
        .compile();
      const repo = await module.resolve(ProductTypesRepository);
      const querySpy = jest.spyOn(repo, "query");
      service = await module.resolve(ProductTypeService);

      // WHEN
      const result = await service.query();
      // THEN
      expect(result).toEqual([prodType]);
      expect(querySpy).toBeCalled();
    });
  });
  describe("findById", () => {
    it("should call proper repository method", async () => {
      const findFn = jest.fn().mockResolvedValue(dbProdType);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductTypesRepository)
        .useValue({
          findById: findFn,
        })
        .compile();
      const repo = await module.resolve(ProductTypesRepository);
      const spy = jest.spyOn(repo, "findById");

      service = await module.resolve(ProductTypeService);

      // WHEN
      const result = await service.findById(1);
      // THEN
      expect(result.raw()).toEqual(prodTypeProps);
      expect(spy).toBeCalledWith(1);
    });
  });
  describe("findByName", () => {
    it("should call proper repository method", async () => {
      const findFn = jest.fn().mockResolvedValue(dbProdType);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductTypesRepository)
        .useValue({
          findByName: findFn,
        })
        .compile();
      const repo = await module.resolve(ProductTypesRepository);
      const spy = jest.spyOn(repo, "findByName");

      service = await module.resolve(ProductTypeService);

      // WHEN
      const result = await service.findByName("test");
      // THEN
      expect(result.raw()).toEqual(prodTypeProps);
      expect(spy).toBeCalledWith("test");
    });
  });

  describe("delete", () => {
    it("should call proper DELETE repository method", async () => {
      const findFn = jest.fn().mockResolvedValue(dbProdType);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductTypesRepository)
        .useValue({
          delete: findFn,
        })
        .compile();
      const repo = await module.resolve(ProductTypesRepository);
      const spy = jest.spyOn(repo, "delete");

      service = await module.resolve(ProductTypeService);

      // WHEN
      const result = await service.delete(1);
      // THEN

      expect(spy).toBeCalledWith(1);
    });
  });
});
