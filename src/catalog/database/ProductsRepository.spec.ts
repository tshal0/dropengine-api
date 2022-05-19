import {
  IPersonalizationRule,
  IProductProps,
  PersonalizationRule,
  Product,
} from "@catalog/domain";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { cloneDeep, update } from "lodash";
import { DbProduct, DbProductType } from "./entities";
import { ProductsRepository } from "./ProductsRepository";
import { when } from "jest-when";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { now, spyOnDate } from "@shared/mocks";
spyOnDate();
describe("ProductsRepository", () => {
  let module: TestingModule;
  let service: ProductsRepository;
  let props: IProductProps;
  let given: Product;
  let updated: DbProduct;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
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
    props = {
      id: undefined,
      sku: "MEM-001-01",
      type: "MockProductType",
      productTypeId: undefined,
      pricingTier: "2",
      tags: ["MOCK_TAG"],
      image: "MOCK_IMG",
      svg: "MOCK_SVG",
      personalizationRules: [mockNameRule],
      variants: [],
      updatedAt: new Date("2021-01-01T00:00:00.000Z"),
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
    };

    given = new Product(props);
    updated = new DbProduct();
    updated.id = mockUuid1;
    updated.sku = props.sku;
    updated.image = props.image;
    updated.type = props.type;
    updated.pricingTier = props.pricingTier;
    updated.svg = props.svg;
    updated.personalizationRules = props.personalizationRules;
    updated.tags = props.tags;
    updated.createdAt = props.createdAt;
    updated.updatedAt = props.updatedAt;
  });
  it("should exist", async () => {
    service = await module.resolve(ProductsRepository);
    expect(service).toBeDefined();
  });
  describe("update", () => {
    it("should copy properties over to DbProduct", async () => {
      // GIVEN

      module = await mockCatalogModule().compile();
      service = await module.resolve(ProductsRepository);
      const dbe = new DbProduct();
      // These props are handled by the database
      dbe.id = mockUuid1;
      dbe.updatedAt = props.updatedAt;
      dbe.createdAt = props.createdAt;
      // WHEN
      const result = await service.update(dbe, given);
      // THEN
      const expected = cloneDeep(props);
      expected.id = mockUuid1;
      expected.productTypeId = mockUuid1;
      expect(result.raw(mockUuid1)).toEqual(expected);
    });
  });
  describe("save", () => {
    it("should create a new DbProduct if lookupBySkuOrId returns null", async () => {
      // GIVEN
      const findOneFn = jest.fn();
      when(findOneFn).calledWith(given.id).mockResolvedValue(null);
      when(findOneFn).calledWith(given.sku).mockResolvedValue(null);
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProductType),
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      given.id = undefined;

      const result = await service.save(given);

      // THEN
      const expected = cloneDeep(props);
      expected.id = updated.id;
      expected.productTypeId = mockUuid1;
      expect(result.raw(mockUuid1)).toEqual(expected);
    });
    it("should update a DbProduct if lookupBySkuOrId returns an entity", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(updated);
      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(mockProductType),
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      given.id = undefined;

      const result = await service.save(given);

      // THEN
      const expected = cloneDeep(props);
      expected.id = updated.id;
      expected.productTypeId = mockUuid1;
      expect(result.raw(mockUuid1)).toEqual(expected);
    });
    it("should throw an exception if no ProductType is found", async () => {
      // GIVEN
      const findOneFn = jest.fn();

      const mockProductType = new DbProductType();
      mockProductType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: findOneFn,
          create: jest.fn().mockResolvedValue(updated),
          persistAndFlush: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductsRepository);

      // WHEN
      given.id = undefined;

      const result = await service.save(given);

      // THEN
      const expected = cloneDeep(props);
      expected.id = updated.id;
      expected.productTypeId = mockUuid1;
      expect(result.raw(mockUuid1)).toEqual(expected);
    });
  });
  describe("findById", () => {
    it("should return entity if exists", async () => {
      updated.productType = new DbProductType();
      updated.productType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.findById(mockUuid1);
      const expected: IProductProps = {
        ...props,
        id: mockUuid1,
      };
      expect(result.raw()).toEqual(expected);
    });
    it("should return null if not exists", async () => {
      updated.productType = new DbProductType();
      updated.productType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.findById(mockUuid1);

      expect(result).toEqual(null);
    });
  });
  describe("findBySku", () => {
    it("should return entity if exists", async () => {
      updated.productType = new DbProductType();
      updated.productType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.findBySku(mockUuid1);
      const expected: IProductProps = {
        ...props,
        id: mockUuid1,
      };
      expect(result.raw()).toEqual(expected);
    });
    it("should return null if not exists", async () => {
      updated.productType = new DbProductType();
      updated.productType.id = mockUuid1;
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      let result = await service.findBySku(mockUuid1);

      expect(result).toEqual(null);
    });
  });
  describe("query", () => {
    it("should return a list of entities", async () => {
      // GIVEN
      const findAllFn = jest.fn().mockResolvedValue([updated]);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findAll: findAllFn,
        })
        .compile();
      service = await module.resolve(ProductsRepository);
      // WHEN

      const result = await service.query();

      // THEN
      const raw = result.map((r) => r.raw());
      const expected = cloneDeep(props);
      expected.id = mockUuid1;
      expect(raw).toEqual([expected]);
    });
  });
  describe("delete", () => {
    it("should delete entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(updated),
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
