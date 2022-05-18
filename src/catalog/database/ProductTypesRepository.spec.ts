import { IProductTypeProps, LivePreview, ProductType } from "@catalog/domain";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { now, spyOnDate } from "@shared/mocks";
import { DbProductType } from "./entities";
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
    let props: IProductTypeProps;
    let given: ProductType;
    let updated: DbProductType;
    beforeEach(async () => {
      props = {
        id: mockUuid1,
        name: "2DMetalArt",
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
      given = new ProductType(props);
    });
    it("should copy properties over to ProductType", async () => {
      // GIVEN
      spyOnDate();
      const expected = cloneDeep(props);
      const findOneFn = jest.fn();

      module = await mockCatalogModule().compile();
      service = await module.resolve(ProductTypesRepository);
      const dbe = new DbProductType();
      // These props are handled by the database
      dbe.id = mockUuid1;
      dbe.updatedAt = expected.updatedAt;
      dbe.createdAt = expected.createdAt;

      // WHEN
      const result = await service.update(given, dbe);

      // THEN
      expect(result.raw()).toEqual(expected);
    });
  });

  //TODO: Test null entity, entity with no raw(), entity with name, with id, entity not exist, entity exist
  describe("save", () => {
    let props: IProductTypeProps;
    let given: ProductType;
    let created: DbProductType;
    beforeEach(async () => {
      props = {
        id: undefined,
        name: "2DMetalArt",
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
      given = new ProductType(props);
      created = new DbProductType();
      created.id = mockUuid1;
      created.image = props.image;
      created.name = props.name;
      created.productionData = props.productionData;
      created.option1 = props.option1;
      created.option2 = props.option2;
      created.option3 = props.option3;
      created.livePreview = props.livePreview;
      created.createdAt = props.createdAt;
      created.updatedAt = props.updatedAt;
    });
    it("should create entity if not exists", async () => {
      // GIVEN
      const findOneFn = jest.fn();
      when(findOneFn).calledWith(given.id).mockResolvedValue(null);
      when(findOneFn).calledWith(given.name).mockResolvedValue(null);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findOneFn,
          create: jest.fn().mockResolvedValue(created),
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);

      // WHEN

      const result = await service.save(given);
      const resultProps = await (await result.entity()).raw();
      // THEN
      const expected = cloneDeep(props);
      expected.id = created.id;
      expect(resultProps).toEqual(expected);
    });
    it("should update entity if ID or NAME exists", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue(created);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: findOneFn,
          persistAndFlush: jest.fn(),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      // WHEN

      const result = await service.save(given);
      const resultProps = await result.entity();
      // THEN
      const expected = cloneDeep(given);
      expected.id = created.id;
      expect(resultProps).toEqual(expected);
    });
  });
  describe("query", () => {
    let props: IProductTypeProps;
    let given: ProductType;
    let queried: DbProductType;
    beforeEach(async () => {
      props = {
        id: mockUuid1,
        name: "2DMetalArt",
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
      given = new ProductType(props);
      queried = new DbProductType();
      queried.id = mockUuid1;
      queried.image = props.image;
      queried.name = props.name;
      queried.productionData = props.productionData;
      queried.option1 = props.option1;
      queried.option2 = props.option2;
      queried.option3 = props.option3;
      queried.livePreview = props.livePreview;
      queried.createdAt = props.createdAt;
      queried.updatedAt = props.updatedAt;
    });
    it("should return list of entities", async () => {
      // GIVEN
      const findOneFn = jest.fn().mockResolvedValue([queried]);
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findAll: findOneFn,
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      // WHEN

      const result = await service.query();

      // THEN
      const raw = result.map((r) => r.raw());
      expect(raw).toEqual([props]);
    });
  });
  describe("findById", () => {
    let props: IProductTypeProps;
    let given: ProductType;
    let queried: DbProductType;
    beforeEach(async () => {
      props = {
        id: mockUuid1,
        name: "2DMetalArt",
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
      given = new ProductType(props);
      queried = new DbProductType();
      queried.id = mockUuid1;
      queried.image = props.image;
      queried.name = props.name;
      queried.productionData = props.productionData;
      queried.option1 = props.option1;
      queried.option2 = props.option2;
      queried.option3 = props.option3;
      queried.livePreview = props.livePreview;
      queried.createdAt = props.createdAt;
      queried.updatedAt = props.updatedAt;
    });
    it("should return entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(queried),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findById(mockUuid1);
      expect(result.raw()).toEqual(props);
    });
    it("should return null if not exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findById(mockUuid1);
      expect(result).toEqual(null);
    });
  });
  describe("findByName", () => {
    let props: IProductTypeProps;
    let given: ProductType;
    let queried: DbProductType;
    beforeEach(async () => {
      props = {
        id: mockUuid1,
        name: "2DMetalArt",
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
      given = new ProductType(props);
      queried = new DbProductType();
      queried.id = mockUuid1;
      queried.image = props.image;
      queried.name = props.name;
      queried.productionData = props.productionData;
      queried.option1 = props.option1;
      queried.option2 = props.option2;
      queried.option3 = props.option3;
      queried.livePreview = props.livePreview;
      queried.createdAt = props.createdAt;
      queried.updatedAt = props.updatedAt;
    });
    it("should return entity if exists", async () => {
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(queried),
        })
        .compile();
      service = await module.resolve(ProductTypesRepository);
      let result = await service.findByName("test");

      expect(result.raw()).toEqual(props);
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
      let result = await service.delete("test");
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
      let result = await service.delete("test");
      expect(result).toEqual({ result: "NOT_FOUND", timestamp: now });
    });
  });
});
