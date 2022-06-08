import {
  IPersonalizationRule,
  IProductProps,
  IProductTypeProps,
  IVariantProps,
  LivePreview,
  Product,
  ProductType,
  ProductTypes,
  ProductTypeSlugs,
  Variant,
} from "@catalog/model";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { now, spyOnDate } from "@shared/mocks";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { ProductTypesRepository } from "./ProductTypesRepository";
import { when } from "jest-when";
import { cloneDeep, create } from "lodash";

spyOnDate();
describe("ProductTypesRepository", () => {
  let module: TestingModule;
  let service: ProductTypesRepository;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(ProductTypesRepository);
  });
  it("should exist", async () => {
    service = await module.resolve(ProductTypesRepository);
    expect(service).toBeDefined();
  });
  describe("update", () => {
    let prodTypeProps: IProductTypeProps;
    let prodType: ProductType;
    let dbProdType: DbProductType;

    let prodProps: IProductProps;
    let prod: Product;
    let dbProd: DbProduct;

    let vprops: IVariantProps;
    let variant: Variant;
    let dbVariant: DbProductVariant;

    const PROD_TYPE = `MetalArt`;
    const PSKU = `MEM-000-01`;
    const VSKU = `${PSKU}-12-Black`;
    beforeEach(async () => {
      prodTypeProps = {
        id: 1,
        name: PROD_TYPE,
        slug: ProductTypeSlugs.MetalArt,
        image: "MOCK_IMG",
        productionData: {
          material: "Mild Steel",
          route: "1",
          thickness: "0.06",
        },
        option1: {
          enabled: true,
          name: "Size",
          values: [
            { enabled: true, value: '12"' },
            { enabled: true, value: '15"' },
            { enabled: true, value: '18"' },
          ],
        },
        option2: {
          enabled: true,
          name: "Color",
          values: [
            { enabled: true, value: "Black" },
            { enabled: true, value: "Gold" },
            { enabled: true, value: "Copper" },
          ],
        },
        option3: {
          enabled: false,
          name: "",
          values: [],
        },
        livePreview: new LivePreview().raw(),
        products: [],
        updatedAt: now,
        createdAt: now,
      };
      prodType = new ProductType(prodTypeProps);
      dbProdType = new DbProductType(prodTypeProps);
      const mockNameRule: IPersonalizationRule = {
        name: "name",
        type: "input",
        label: "Name",
        options: "",
        pattern: "^[a-zA-Z0-9\\s.,'/&]*",
        required: true,
        maxLength: 20,
        placeholder: "Enter up to 20 characters",
      };
      prodProps = {
        id: 1,
        sku: PSKU,
        type: PROD_TYPE,
        pricingTier: "2",
        tags: ["MOCK_TAG"],
        image: "MOCK_IMG",
        svg: "MOCK_SVG",
        personalizationRules: [mockNameRule],
        variants: [],
        productType: prodTypeProps,
        updatedAt: now,
        createdAt: now,
      };

      prod = new Product(prodProps);
      dbProd = new DbProduct(prodProps);
      vprops = {
        id: 1,
        image: "MOCK_IMG",
        sku: VSKU,
        type: PROD_TYPE,

        option1: { name: "Size", value: '12"' },
        option2: { name: "Color", value: "Black" },
        option3: { name: "", value: undefined },
        height: { dimension: 100, units: "mm" },
        width: { dimension: 100, units: "mm" },
        weight: { dimension: 100, units: "g" },
        manufacturingCost: { total: 100, currency: "USD" },
        shippingCost: { total: 100, currency: "USD" },
        product: prodProps,
        productType: prodTypeProps,
      };
      variant = new Variant(vprops);
      dbVariant = new DbProductVariant(vprops);
    });
    it("should copy properties over to ProductType", async () => {
      // GIVEN
      spyOnDate();
      const expected = cloneDeep(prodTypeProps);
      const findOneFn = jest.fn();

      module = await mockCatalogModule().compile();
      service = await module.resolve(ProductTypesRepository);
      const dbe = new DbProductType();
      // These props are handled by the database
      dbe.id = 1;
      dbe.updatedAt = expected.updatedAt;
      dbe.createdAt = expected.createdAt;

      // WHEN
      const result = await service.update(prodType, dbe);

      // THEN
      expect(result.raw()).toEqual(expected);
    });
  });

  //TODO: Test null entity, entity with no raw(), entity with name, with id, entity not exist, entity exist
  describe("save", () => {
    let prodTypeProps: IProductTypeProps;
    let prodType: ProductType;
    let dbProdType: DbProductType;
    beforeEach(async () => {
      prodTypeProps = {
        id: null,
        name: ProductTypes.MetalArt,
        slug: ProductTypeSlugs.MetalArt,
        image: "",
        productionData: {
          material: "Galv Steel",
          route: "2",
          thickness: "0.12",
        },
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
      dbProdType = new DbProductType(prodTypeProps);
      dbProdType.id = 1;
    });
    it("should create entity if not exists", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn(),
          create: jest.fn().mockResolvedValue(dbProdType),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);

      // WHEN

      const result = await service.save(prodType);
      // THEN
      const expected = cloneDeep(prodTypeProps);
      expected.id = 1;
      expect(result.raw()).toEqual(expected);
    });
    it("should update entity if ID or NAME exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(dbProdType);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findOneFn,
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      // WHEN

      const result = await service.save(prodType);
      const resultProps = await result.raw();
      // THEN
      const expected = cloneDeep(prodType);
      expected.id = dbProdType.id;
      expect(result.raw()).toEqual(expected.raw());
    });
  });
  describe("query", () => {
    let prodTypeProps: IProductTypeProps;
    let prodType: ProductType;
    let dbProdType: DbProductType;
    beforeEach(async () => {
      prodTypeProps = {
        id: 1,
        name: ProductTypes.MetalArt,
        slug: ProductTypeSlugs.MetalArt,
        image: "",
        productionData: {
          material: "Galv Steel",
          route: "2",
          thickness: "0.12",
        },
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
      dbProdType = new DbProductType(prodTypeProps);
      dbProdType.id = 1;
    });
    it("should return list of entities", async () => {
      // GIVEN
      const findAllFn = jest.fn().mockResolvedValue([dbProdType]);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findAll: findAllFn,
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      // WHEN

      const result = await service.query();

      // THEN
      const raw = result.map((r) => r.raw());
      expect(raw).toEqual([prodTypeProps]);
    });
  });
  describe("findById", () => {
    let prodTypeProps: IProductTypeProps;
    let prodType: ProductType;
    let dbProdType: DbProductType;
    beforeEach(async () => {
      prodTypeProps = {
        id: 1,
        name: ProductTypes.MetalArt,
        slug: ProductTypeSlugs.MetalArt,
        image: "",
        productionData: {
          material: "Galv Steel",
          route: "2",
          thickness: "0.12",
        },
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
      dbProdType = new DbProductType(prodTypeProps);
      dbProdType.id = 1;
    });
    it("should return entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findById(1);
      expect(result.raw()).toEqual(prodTypeProps);
    });
    it("should return null if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findById(1);
      expect(result).toEqual(null);
    });
  });
  describe("findByName", () => {
    let prodTypeProps: IProductTypeProps;
    let prodType: ProductType;
    let dbProdType: DbProductType;
    beforeEach(async () => {
      prodTypeProps = {
        id: 1,
        name: ProductTypes.MetalArt,
        slug: ProductTypeSlugs.MetalArt,
        image: "",
        productionData: {
          material: "Galv Steel",
          route: "2",
          thickness: "0.12",
        },
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
      dbProdType = new DbProductType(prodTypeProps);
      dbProdType.id = 1;
    });
    it("should return entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findByName("test");

      expect(result.raw()).toEqual(prodTypeProps);
    });
    it("should return null if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findByName(mockUuid1);
      expect(result).toEqual(null);
    });
  });
  describe("delete", () => {
    it("should delete entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue({
            products: {
              isInitialized: jest.fn().mockReturnValue(false),
              init: jest.fn(),
              removeAll: jest.fn(),
            },
            variants: {
              isInitialized: jest.fn().mockReturnValue(false),
              init: jest.fn(),
              removeAll: jest.fn(),
            },
          }),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.delete(1);
      expect(result).toEqual({ result: "DELETED", timestamp: now });
    });
    it("should return NOT_FOUND if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.delete(1);
      expect(result).toEqual({ result: "NOT_FOUND", timestamp: now });
    });
  });
});
