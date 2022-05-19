import { IVariantProps, Variant } from "@catalog/domain";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { mockUuid1, mockUuid2 } from "@sales/mocks";
import { EntityNotFoundException } from "@shared/exceptions";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { DbProduct, DbProductType, DbProductVariant } from "./entities";
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
  let props: IVariantProps;
  let given: Variant;
  let updated: DbProductVariant;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    props = {
      id: mockUuid1,
      sku: "MEM-001-01-18-Black",
      image: "MOCK_IMG",
      option1: { enabled: true, name: "Size", value: '12"' },
      option2: { enabled: true, name: "Color", value: "Black" },
      option3: { enabled: false, name: "", value: "" },
      height: { dimension: 100, units: "mm" },
      width: { dimension: 100, units: "mm" },
      weight: { dimension: 100, units: "g" },
      manufacturingCost: { total: 100, currency: "USD" },
      shippingCost: { total: 100, currency: "USD" },
      type: "2DMetalArt",
      productId: mockUuid1,
      productTypeId: mockUuid2,
    };
    given = new Variant(props);
    updated = new DbProductVariant();
    updated.id = props.id;
    updated.sku = props.sku;
    updated.sku = props.sku;
    updated.image = props.image;
    updated.option1 = props.option1;
    updated.option2 = props.option2;
    updated.option3 = props.option3;
    updated.height = props.height;
    updated.width = props.width;
    updated.weight = props.weight;
    updated.manufacturingCost = props.manufacturingCost;
    updated.shippingCost = props.shippingCost;
    updated.type = props.type;
    updated.product = new DbProduct();
    updated.product.id = props.productId;
    updated.productType = new DbProductType();
    updated.productType.id = props.productTypeId;
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
      const result = await service.update(dbe, given);
      // THEN
      const expected = cloneDeep(props);
      expected.id = mockUuid1;
      expected.productId = undefined;
      expected.productTypeId = undefined;
      expect(result.raw()).toEqual(expected);
    });
  });
  describe("save", () => {
    it("should create new entity if ID and SKU not found", async () => {
      // GIVEN
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid2;
      const mockProduct = new DbProduct();
      mockProduct.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProduct),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProductType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      given.id = undefined;

      const result = await service.save(given);

      // THEN
      const expected = cloneDeep(props);
      expect(result.raw()).toEqual(expected);
    });
    it("should update entity if entity found", async () => {
      // GIVEN
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid2;
      const mockProduct = new DbProduct();
      mockProduct.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProduct),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProductType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      given.image = "NEW_IMAGE";

      const result = await service.save(given);

      // THEN
      const expected = cloneDeep(props);
      expected.image = "NEW_IMAGE";
      expect(result.raw()).toEqual(expected);
    });
    it("should throw error if Product not found", async () => {
      // GIVEN
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid2;
      const mockProduct = new DbProduct();
      mockProduct.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProductType),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.save(given)
      );
      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(EntityNotFoundException);
      expect(error.getResponse()).toMatchObject({
        id: "00000000-0000-0000-0000-000000000001|MEM-001-01-18-Black",
        message: "ProductNotFound",
        error: "ENTITY_NOT_FOUND",
      });
    });
    it("should throw error if ProductType not found", async () => {
      // GIVEN
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid2;
      const mockProduct = new DbProduct();
      mockProduct.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProduct),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(VariantsRepository);

      // WHEN
      const error: any = await getAsyncError(
        async () => await service.save(given)
      );
      console.log(error);
      // THEN
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(EntityNotFoundException);
      expect(error.getResponse()).toMatchObject({
        id: "00000000-0000-0000-0000-000000000002|2DMetalArt",
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
          findOne: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.lookupBySkuOrId({
        id: mockUuid1,
        sku: updated.sku,
      });
      const expected = cloneDeep(props);
      expected.id = updated.id;
      // THEN
      expect(result.raw()).toEqual(expected);
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
        sku: updated.sku,
      });
      const expected = cloneDeep(props);
      expected.id = updated.id;
      // THEN
      expect(result).toEqual(null);
    });
  });
  describe("query", () => {
    it("should return a list of entities", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findAll: jest.fn().mockResolvedValue([updated]),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.query();
      const raw = result.map((r) => r.raw());
      // THEN
      expect(raw).toEqual([props]);
    });
  });
  describe("findById", () => {
    it("should return entity if found", async () => {
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findById("test");
      const expected = cloneDeep(props);
      expected.id = updated.id;
      // THEN
      expect(result.raw()).toEqual(expected);
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

      const expected = cloneDeep(props);
      expected.id = updated.id;
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
          findOne: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      // WHEN
      const result = await service.findBySku("test");
      const expected = cloneDeep(props);
      expected.id = updated.id;
      // THEN
      expect(result.raw()).toEqual(expected);
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

      const expected = cloneDeep(props);
      expected.id = updated.id;
      // THEN
      expect(result).toEqual(null);
    });
  });
  describe("delete", () => {
    it("should delete entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
          removeAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(VariantsRepository);
      let result = await service.delete("test");
      expect(result).toEqual({ result: "DELETED", timestamp: now });
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
      expect(result).toEqual({ result: "NOT_FOUND", timestamp: now });
    });
  });
});
