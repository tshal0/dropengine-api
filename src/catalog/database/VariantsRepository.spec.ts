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
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { mockUuid1, mockUuid2 } from "@sales/mocks";
import { EntityNotFoundException } from "@shared/exceptions";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
import { ProductsRepository } from "./ProductsRepository";
import { ProductTypesRepository } from "./ProductTypesRepository";
import { VariantsRepository } from "./VariantsRepository";

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
describe("VariantsRepository", () => {
  let module: TestingModule;
  let service: VariantsRepository;
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
    dbVariant.productType = dbProdType;
    dbVariant.product = dbProd;
    module = await mockCatalogModule().compile();
  });
  it("should exist", async () => {
    service = await module.resolve(VariantsRepository);
    expect(service).toBeDefined();
  });
  describe("update", () => {
    it("should copy properties to given entity", async () => {
      // GIVEN

      module = await mockCatalogModule().compile();
      service = await module.resolve(VariantsRepository);
      const dbe = new DbProductVariant();
      // These props are handled by the database
      dbe.id = mockUuid1;
      // WHEN
      const result = await service.update(dbe, variant);
      // THEN
      const expected = cloneDeep(vprops);
      expected.id = mockUuid1;
      expected.productId = undefined;
      expected.productTypeId = undefined;
      expected.product = null;
      expected.productType = null;
      expect(result.raw()).toMatchObject(expected);
    });
  });
  describe("save", () => {
    it("should create new entity if ID and SKU not found", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(ProductsRepository)
        .useValue({
          lookupBySkuOrId: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: jest.fn().mockResolvedValue(dbProdType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN

      const result = await service.save(variant);

      // THEN
      const expected = cloneDeep(vprops);
      const raw = result.raw();
      expect(raw).toMatchObject(expected);
    });
    it("should update entity if entity found", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      variant.image = "NEW_IMAGE";

      const result = await service.save(variant);

      // THEN
      const expected = cloneDeep(vprops);
      expected.image = "NEW_IMAGE";
      expect(result.raw()).toMatchObject(expected);
    });
    it("should throw error if Product not found", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.save(variant)
      );
      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(EntityNotFoundException);
      expect(error.getResponse()).toMatchObject({
        id: "00000000-0000-0000-0000-000000000001|MEM-000-01-12-Black",
        message: "ProductNotFound",
        error: "ENTITY_NOT_FOUND",
      });
    });
    it("should throw error if ProductType not found", async () => {
      // GIVEN

      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.save(variant)
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
  describe("lookupBySkuOrId", () => {
    it("should return entity if found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.lookupBySkuOrId({
        id: mockUuid1,
        sku: dbVariant.sku,
      });
      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result.raw()).toMatchObject(expected);
    });
    it("should return null if NOT found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.lookupBySkuOrId({
        id: mockUuid1,
        sku: dbVariant.sku,
      });
      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result).toEqual(null);
    });
  });
  describe("query", () => {
    it("should return a list of entities", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findAll: jest.fn().mockResolvedValue([dbVariant]),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.query();
      const raw = result.map((r) => r.raw());
      // THEN
      expect(raw).toEqual([vprops]);
    });
  });
  describe("findById", () => {
    it("should return entity if found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findById("test");
      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result.raw()).toMatchObject(expected);
    });
    it("should return null if NOT found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findById("test");

      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result).toEqual(null);
    });
  });
  describe("findBySku", () => {
    it("should return entity if found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findBySku("test");
      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result.raw()).toMatchObject(expected);
    });
    it("should return null if NOT found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findBySku("test");

      const expected = cloneDeep(vprops);
      expected.id = dbVariant.id;
      // THEN
      expect(result).toEqual(null);
    });
  });
  describe("delete", () => {
    it("should delete entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      let result = await service.delete("test");
      expect(result).toMatchObject({ result: "DELETED", timestamp: now });
    });
    it("should return NOT_FOUND if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      let result = await service.delete("test");
      expect(result).toMatchObject({ result: "NOT_FOUND", timestamp: now });
    });
  });
});
