// import {
//   ProductsRepository,
//   ProductTypesRepository,
//   ProductVariantsRepository,
// } from "@catalog/database";
// import { ProductType } from "@catalog/domain";
// import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
// import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
// import { TestingModule } from "@nestjs/testing";
// import { Result } from "@shared/domain";
// import {
//   validMesVariant,
//   validProduct,
//   validProductType,
//   validProductVariant,
//   validVariantSku,
// } from "./mocks";
// import { SyncVariant } from "./SyncVariant";

// describe("SyncVariant", () => {
//   let module: TestingModule;
//   let service: SyncVariant;

//   beforeAll(() => {});

//   afterAll(async () => {});

//   beforeEach(async () => {
//     module = await mockCatalogModule()
//       .overrideProvider(ProductTypesRepository)
//       .useValue({})
//       .overrideProvider(ProductsRepository)
//       .useValue({})
//       .overrideProvider(ProductVariantsRepository)
//       .useValue({})
//       .compile();

//     service = await module.resolve<SyncVariant>(SyncVariant);
//   });

//   it("should exist", () => {
//     expect(service).toBeDefined();
//   });
//   /**
//    * TODO
//    * Invalid SKU
//    * MyEasySuite 404
//    * FailedToLoad2DMetalArt
//    * VariantPartFileNameNotValidProductSKU
//    * FailedToLoadProduct
//    * FailedToExtractSVG
//    * FailedToGenerateCustomOptions
//    * FailedToImportProduct
//    * FailedToSaveProduct
//    * FailedToConvertVariant
//    * FailedToImportVariant
//    * FailedToSaveVariant
//    */
//   describe("GIVEN", () => {
//     /**
//      * Given SKU
//      * And MES returns valid MESVariant
//      * And 2DMetalArt ProductType exists
//      * And PartFileName is valid ProductSKU
//      * And Product exists matching ProductSKU
//      * And Variant exists matching VariantSKU
//      * LoadVariant and return
//      */
//     describe("Everything works", () => {
//       it("should return valid ProductVariant", async () => {
//         // GIVEN
//         module = await mockCatalogModule()
//           .overrideProvider(ProductTypesRepository)
//           .useValue({})
//           .overrideProvider(ProductsRepository)
//           .useValue({})
//           .overrideProvider(ProductVariantsRepository)
//           .useValue({})
//           .overrideProvider(MyEasySuiteClient)
//           .useValue({
//             getVariantBySku: jest.fn().mockResolvedValue(validMesVariant),
//           })
//           .compile();

//         service = await module.resolve<SyncVariant>(SyncVariant);
//         const sku = validVariantSku;
//         const mesClient = await module.resolve<MyEasySuiteClient>(
//           MyEasySuiteClient
//         );
//         const typesRepo = await module.resolve<ProductTypesRepository>(
//           ProductTypesRepository
//         );
//         const productsRepo = await module.resolve<ProductsRepository>(
//           ProductsRepository
//         );
//         const variantsRepo = await module.resolve<ProductVariantsRepository>(
//           ProductVariantsRepository
//         );
//         const mesSpy = jest.spyOn(mesClient, "getVariantBySku");
//         // mesClient.getVariantBySku = jest
//         //   .fn()
//         //   .mockResolvedValue(validMesVariant);
//         typesRepo.load = jest
//           .fn()
//           .mockResolvedValue(
//             Result.ok({ props: jest.fn().mockReturnValue(validProductType) })
//           );
//         productsRepo.load = jest
//           .fn()
//           .mockResolvedValue(
//             Result.ok({ props: jest.fn().mockReturnValue(validProduct) })
//           );
//         variantsRepo.findBySku = jest
//           .fn()
//           .mockResolvedValue(
//             Result.ok({ props: jest.fn().mockReturnValue(validProductVariant) })
//           );
//         // WHEN
//         let result = await service.execute({ sku });
//         // THEN
//         if (result.isFailure) {
//           const err = result.error;
//           console.error(err);
//         }
//         expect(result.isFailure).toBe(false);
//         const variant = result.value();
//         expect(variant.props()).toEqual(validProductVariant);
//       });
//     });
//     describe("MyEasySuite returns 404", () => {});
//     describe("2DMetalArt ProductType does not exist", () => {});
//     describe("MyEasySuite PartFileName is not a valid ProductSKU (null)", () => {});
//     describe("Product does not exist matching ProductSKU", () => {});
//     describe("Product does not have any SVGs", () => {});
//     describe("Product has invalid CustomOptions", () => {});
//     describe("Product failed to import", () => {});
//     describe("Product failed to save", () => {});
//     describe("MyEasySuite Variant does not convert", () => {});
//     describe("Variant failed to import", () => {});
//     describe("Variant failed to save", () => {});
//   });
// });
