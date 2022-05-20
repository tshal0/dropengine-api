import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { TestingModule } from "@nestjs/testing";
import { cloneDeep } from "lodash";
import { CatalogService } from "./CatalogService";
import { MESMetalArtMocks } from "./fixtures/metalArt.variant.mock";
import { ProductTypeService } from "./ProductTypeService";
import { when } from "jest-when";
import { ProductTypesRepository } from "..";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import { now, spyOnDate } from "@shared/mocks";
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
describe("CatalogService", () => {
  let module: TestingModule;
  let service: CatalogService;

  beforeAll(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(CatalogService);
  });
  it("should exist", () => {
    expect(service).toBeDefined();
  });

  describe("lookupVariantBySkuOrId", () => {
    it("should exist", () => {
      expect(service.lookupVariantBySkuOrId).toBeDefined();
    });
    it("should return an existing variant", async () => {
      const mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);

      const getMesVariantFn = jest.fn();
      when(getMesVariantFn)
        .calledWith(MESMetalArtMocks.VSKU)
        .mockResolvedValue(mesVariant);

      const prodType = cloneDeep(MESMetalArtMocks.prodType);
      const getProdTypeFn = jest.fn().mockResolvedValue(prodType);

      const dbProd = cloneDeep(MESMetalArtMocks.dbProd);
      dbProd.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      const dbVariant = cloneDeep(MESMetalArtMocks.dbVariant);
      dbVariant.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      dbVariant.product = cloneDeep(MESMetalArtMocks.dbProd);

      const dbProdType = cloneDeep(MESMetalArtMocks.dbProdType);
      module = await mockCatalogModule()
        .overrideProvider(ProductTypeService)
        .useValue({
          findByName: getProdTypeFn,
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: getProdTypeFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbVariant),
        })
        .overrideProvider(MyEasySuiteClient)
        .useValue({ getVariantBySku: getMesVariantFn })
        .compile();
      service = await module.resolve(CatalogService);
      const syncSpy = jest.spyOn(service, "syncVariant");

      // WHEN
      let result = await service.lookupVariantBySkuOrId({
        sku: MESMetalArtMocks.VSKU,
        id: null,
      });
      const expectedRules = cloneDeep(
        MESMetalArtMocks.prodProps.personalizationRules
      );
      // THEN
      expect(syncSpy).not.toBeCalled();
      const expected = cloneDeep(MESMetalArtMocks.expectedCatalogVariant);
      expect(result).toEqual(expected);
    });
    it("should sync a variant that isn't found locally", async () => {
      const mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);

      const getMesVariantFn = jest.fn();
      when(getMesVariantFn)
        .calledWith(MESMetalArtMocks.VSKU)
        .mockResolvedValue(mesVariant);

      const prodType = cloneDeep(MESMetalArtMocks.prodType);
      const getProdTypeFn = jest.fn().mockResolvedValue(prodType);

      const dbProd = cloneDeep(MESMetalArtMocks.dbProd);
      dbProd.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      const dbVariant = cloneDeep(MESMetalArtMocks.dbVariant);
      dbVariant.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      dbVariant.product = cloneDeep(MESMetalArtMocks.dbProd);

      const dbProdType = cloneDeep(MESMetalArtMocks.dbProdType);
      module = await mockCatalogModule()
        .overrideProvider(ProductTypeService)
        .useValue({
          findByName: getProdTypeFn,
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: getProdTypeFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
          persistAndFlush: jest.fn().mockResolvedValue(dbProd),
          create: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest
            .fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValue(dbProd),
          persistAndFlush: jest.fn().mockResolvedValue(dbProd),
          create: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn().mockResolvedValueOnce(null),
          persistAndFlush: jest.fn(),
          create: jest.fn().mockResolvedValue(dbVariant),
        })
        .overrideProvider(MyEasySuiteClient)
        .useValue({ getVariantBySku: getMesVariantFn })
        .compile();
      service = await module.resolve(CatalogService);

      // WHEN
      let result = await service.lookupVariantBySkuOrId({
        sku: MESMetalArtMocks.VSKU,
        id: null,
      });
      // THEN

      expect(result).toEqual(
        cloneDeep(MESMetalArtMocks.expectedCatalogVariant)
      );
    });
  });
  describe("syncVariant", () => {
    beforeEach(async () => {});
    it("should exist", () => {
      expect(service.syncVariant).toBeDefined();
    });

    it("should sync a MetalArt product", async () => {
      // GIVEN
      /**
       * MES returns valid variant by SKU
       * ProductTypeService returns MetalArt ProductType
       * ProductTypeRepository returns MetalArt ProductType
       * ProductRepository has no Product matching ProductSKU
       */
      const mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);

      const getMesVariantFn = jest.fn();
      when(getMesVariantFn)
        .calledWith(MESMetalArtMocks.VSKU)
        .mockResolvedValue(mesVariant);

      const prodType = cloneDeep(MESMetalArtMocks.prodType);
      const getProdTypeFn = jest.fn().mockResolvedValue(prodType);

      const dbProd = cloneDeep(MESMetalArtMocks.dbProd);
      dbProd.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      const dbVariant = cloneDeep(MESMetalArtMocks.dbVariant);
      dbVariant.productType = cloneDeep(MESMetalArtMocks.dbProdType);
      dbVariant.product = cloneDeep(MESMetalArtMocks.dbProd);

      const dbProdType = cloneDeep(MESMetalArtMocks.dbProdType);
      module = await mockCatalogModule()
        .overrideProvider(ProductTypeService)
        .useValue({
          findByName: getProdTypeFn,
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: getProdTypeFn,
        })
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
          persistAndFlush: jest.fn().mockResolvedValue(dbProd),
          create: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest
            .fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValue(dbProd),
          persistAndFlush: jest.fn().mockResolvedValue(dbProd),
          create: jest.fn().mockResolvedValue(dbProd),
        })
        .overrideProvider(getRepositoryToken(DbProductVariant))
        .useValue({
          findOne: jest.fn(),
          persistAndFlush: jest.fn(),
          create: jest.fn().mockResolvedValue(dbVariant),
        })
        .overrideProvider(MyEasySuiteClient)
        .useValue({ getVariantBySku: getMesVariantFn })
        .compile();
      service = await module.resolve(CatalogService);

      // WHEN

      let result = await service.syncVariant(MESMetalArtMocks.VSKU);

      const raw = result.raw();
      // THEN
      expect(raw).toEqual(cloneDeep(MESMetalArtMocks.expected));
    });
    it("given ENTITY_NOT_FOUND, should throw 'FailedToLoadMyEasySuiteVariant'", async () => {
      // GIVEN
      /**
       * MES returns valid variant by SKU
       * ProductTypeService returns MetalArt ProductType
       * ProductTypeRepository returns MetalArt ProductType
       * ProductRepository has no Product matching ProductSKU
       */
      const mesVariant = cloneDeep(MESMetalArtMocks.metalArtVariant);

      const getMesVariantFn = jest.fn();
      when(getMesVariantFn)
        .calledWith(MESMetalArtMocks.VSKU)
        .mockRejectedValue("EntityNotFound");

      module = await mockCatalogModule()
        .overrideProvider(MyEasySuiteClient)
        .useValue({ getVariantBySku: getMesVariantFn })
        .compile();
      service = await module.resolve(CatalogService);

      const error: any = await getAsyncError(
        async () => await service.syncVariant(MESMetalArtMocks.VSKU)
      );
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error.getResponse()).toEqual({
        details: {
          id: "MU-C011-00-12-Black",
          inner: ["EntityNotFound"],
        },
        error: "FailedToLoadMyEasySuiteVariant",
        message:
          "Failed to load MyEasySuite Variant with SKU 'MU-C011-00-12-Black': EntityNotFound",
        statusCode: 500,
        timestamp: now,
      });
    });
    // it("should sync a Canvas product", async () => {
    //   const mesVariant = cloneDeep(canvasVariant);

    //   module = await mockCatalogModule()
    //     .overrideProvider(MyEasySuiteClient)
    //     .useValue({ getVariantBySku: jest.fn().mockResolvedValue(mesVariant) })
    //     .compile();
    //   service = await module.resolve(CatalogService);
    // });
    // it("should sync a Jewelry product", async () => {
    //   const mesVariant = cloneDeep(jewelryVariant);
    //   module = await mockCatalogModule()
    //     .overrideProvider(MyEasySuiteClient)
    //     .useValue({ getVariantBySku: jest.fn().mockResolvedValue(mesVariant) })
    //     .compile();
    //   service = await module.resolve(CatalogService);
    // });
    // it("should sync a Wood product", async () => {
    //   module = await mockCatalogModule().compile();
    //   service = await module.resolve(CatalogService);
    // });

    // it("should add to Uncategorized ProductType if ProductType not recognized", async () => {
    //   module = await mockCatalogModule().compile();
    //   service = await module.resolve(CatalogService);
    // });

    // it("should throw exception if not found in MyEasySuite", async () => {
    //   module = await mockCatalogModule().compile();
    //   service = await module.resolve(CatalogService);
    // });
  });
});
