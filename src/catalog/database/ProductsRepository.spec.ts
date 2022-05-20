import {
  IPersonalizationRule,
  IProductProps,
  IProductTypeProps,
  IVariantProps,
  LivePreview,
  Product,
  ProductType,
  Variant,
} from "@catalog/domain";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { cloneDeep } from "lodash";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { ProductsRepository } from "./ProductsRepository";
import { when } from "jest-when";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { now, spyOnDate } from "@shared/mocks";
import { EntityNotFoundException } from "@shared/exceptions";

class NoErrorThrownError extends Error {}

const getAsyncError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

spyOnDate();
describe("ProductsRepository", () => {
  let module: TestingModule;
  let service: ProductsRepository;
  let prodTypeProps: IProductTypeProps;
  let prodType: ProductType;
  let dbProdType: DbProductType;

  let prodProps: IProductProps;
  let prod: Product;
  let dbProd: DbProduct;

  let vprops: IVariantProps;
  let variant: Variant;
  let dbVariant: DbProductVariant;

  const PROD_TYPE = `2DMetalArt`;
  const PSKU = `MEM-000-01`;
  const VSKU = `${PSKU}-12-Black`;
  beforeEach(async () => {
    prodTypeProps = {
      id: mockUuid1,
      name: PROD_TYPE,
      image: "MOCK_IMG",
      productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
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
      id: mockUuid1,
      sku: PSKU,
      type: PROD_TYPE,
      productTypeId: mockUuid1,
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
    dbProd.productType = dbProdType;
    vprops = {
      id: mockUuid1,
      image: "MOCK_IMG",
      sku: VSKU,
      type: PROD_TYPE,
      productId: mockUuid1,
      productTypeId: mockUuid1,

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
  it("should exist", async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(ProductsRepository);
    expect(service).toBeDefined();
  });
  describe("update", () => {
    it("should copy properties over to DbProduct", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({ findOne: jest.fn().mockResolvedValue(dbProdType) })
        .compile();

      service = await module.resolve(ProductsRepository);
      const dbe = new DbProduct();
      // These props are handled by the database
      dbe.id = mockUuid1;
      dbe.updatedAt = prodProps.updatedAt;
      dbe.createdAt = prodProps.createdAt;
      // WHEN
      const result = await service.update(dbe, prod);
      // THEN
      const raw = result.raw();
      expect(raw).toEqual({
        createdAt: now,
        id: mockUuid1,
        image: "MOCK_IMG",
        personalizationRules: [
          {
            label: "Name",
            maxLength: 20,
            name: "name",
            options: "",
            pattern: "^[a-zA-Z0-9\\s.,'/&]*",
            placeholder: "Enter up to 20 characters",
            required: true,
            type: "input",
          },
        ],
        pricingTier: "2",
        productType: null,
        productTypeId: null,
        sku: "MEM-000-01",
        svg: "MOCK_SVG",
        tags: ["MOCK_TAG"],
        type: "2DMetalArt",
        updatedAt: now,
        variants: [],
      });
    });
  });
  describe("save", () => {
    it("should create a new DbProduct if lookupBySkuOrId returns null", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(null);

      const createFn = jest.fn().mockResolvedValue(dbProd);
      const findProdTypeFn = jest.fn().mockResolvedValue(dbProdType);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: createFn,
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findProdTypeFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      const result = await service.save(prod);

      // THEN
      const expected = cloneDeep(prodProps);
      const raw = result.raw();
      expect(raw).toEqual(expected);
    });
    it("should update entity if entity found", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(dbProd);

      const createFn = jest.fn().mockResolvedValue(dbProd);
      const findProdTypeFn = jest.fn().mockResolvedValue(dbProdType);
      const persistFn = jest.fn();
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: createFn,
          persistAndFlush: persistFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findProdTypeFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      const result = await service.save(prod);

      // THEN
      const expected = cloneDeep(prodProps);

      const raw = result.raw();
      expect(raw).toEqual(expected);
    });
    it("should throw an exception if no ProductType is found", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(dbProd);

      const createFn = jest.fn().mockResolvedValue(dbProd);
      const findProdTypeFn = jest.fn().mockResolvedValue(null);
      const persistFn = jest.fn();
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: createFn,
          persistAndFlush: persistFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findProdTypeFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.save(prod)
      );
      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(EntityNotFoundException);
      expect(error.getResponse()).toMatchObject({
        id: "00000000-0000-0000-0000-000000000001|2DMetalArt",
        message: "ProductTypeNotFound",
        error: "ENTITY_NOT_FOUND",
      });
    });
  });
  describe("findById", () => {
    it("should return entity if exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(dbProd);

      const createFn = jest.fn().mockResolvedValue(dbProd);
      const findProdTypeFn = jest.fn().mockResolvedValue(null);
      const persistFn = jest.fn();
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: createFn,
          persistAndFlush: persistFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findProdTypeFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN
      let result = await service.findById(mockUuid1);

      const raw = result.raw();
      // THEN
      expect(raw).toEqual(prodProps);
    });
    it("should return null if not exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(null);

      const createFn = jest.fn().mockResolvedValue(dbProd);
      const findProdTypeFn = jest.fn().mockResolvedValue(null);
      const persistFn = jest.fn();
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: createFn,
          persistAndFlush: persistFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findProdTypeFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN
      let result = await service.findById(mockUuid1);
      // THEN
      expect(result).toBe(null);
    });
  });
  describe("findBySku", () => {
    it("should return entity if exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(dbProd);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN
      let result = await service.findBySku("test");
      const raw = result.raw();
      // THEN
      expect(raw).toEqual(prodProps);
    });
    it("should return null if not exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(null);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN
      let result = await service.findBySku("test");
      // THEN
      expect(result).toBe(null);
    });
  });
  describe("query", () => {
    it("should return a list of entities", async () => {
      // GIVEN
      const findAllFn = jest.fn().mockResolvedValue([dbProd]);

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findAll: findAllFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN
      let result = await service.query();

      const raw = result.map((r) => r.raw());
      // THEN
      expect(raw).toEqual([prodProps]);
    });
  });
  describe("delete", () => {
    it("should delete entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProd),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.delete("test");
      expect(result).toEqual({ result: "DELETED", timestamp: now });
    });
    it("should return NOT_FOUND if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.delete("test");
      expect(result).toEqual({ result: "NOT_FOUND", timestamp: now });
    });
  });
});
