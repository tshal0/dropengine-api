import { ProductsController } from "@catalog/api/ProductsController";
import { ProductTypesController } from "@catalog/api/ProductTypesController";
import { ProductVariantsController } from "@catalog/api/ProductVariantsController";

import { SyncVariant } from "@catalog/useCases/SyncVariant";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { CatalogService } from "@catalog/services";
import {
  ProductsRepository,
  ProductTypesRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import {
  GetProductType,
  GetAllProductTypes,
  CreateProductType,
  DeleteProductType,
  RenameProductType,
  GetProduct,
  GetAllProducts,
  CreateProduct,
  DeleteProduct,
  CreateProductVariant,
  GetProductVariantById,
  GetProductVariantBySku,
  DeleteProductVariant,
  ImportProductCsv,
  ImportProductVariantCsv,
  QueryProductVariants,
} from "@catalog/useCases";
import { MyEasySuiteModule } from "@myeasysuite/myeasysuite.module";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";

jest.mock("@shared/utils", () => {
  return {
    loadAccessToken: jest.fn().mockResolvedValue("MOCK_ACCESS_TOKEN"),
  };
});
export const mockCatalogModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      EventEmitterModule.forRoot(),
      HttpModule,
      ConfigModule.forRoot(),
      CacheModule.register(),
      MyEasySuiteModule,
    ],
    providers: [
      { provide: ProductTypesRepository, useValue: {} },
      { provide: ProductsRepository, useValue: {} },
      { provide: ProductVariantsRepository, useValue: {} },
      { provide: CatalogService, useValue: {} },
      { provide: GetProductType, useValue: {} },
      { provide: GetAllProductTypes, useValue: {} },
      { provide: CreateProductType, useValue: {} },
      { provide: DeleteProductType, useValue: {} },
      { provide: RenameProductType, useValue: {} },
      { provide: GetProduct, useValue: {} },
      { provide: GetAllProducts, useValue: {} },
      { provide: CreateProduct, useValue: {} },
      { provide: DeleteProduct, useValue: {} },
      { provide: CreateProductVariant, useValue: {} },
      { provide: GetProductVariantById, useValue: {} },
      { provide: GetProductVariantBySku, useValue: {} },
      { provide: DeleteProductVariant, useValue: {} },
      { provide: ImportProductCsv, useValue: {} },
      { provide: ImportProductVariantCsv, useValue: {} },
      { provide: QueryProductVariants, useValue: {} },
      { provide: MyEasySuiteClient, useValue: {} },
      SyncVariant,
    ],
    exports: [CatalogService],
    controllers: [
      ProductTypesController,
      ProductsController,
      ProductVariantsController,
    ],
  })
    .overrideProvider(ProductTypesRepository)
    .useValue({})
    .overrideProvider(ProductsRepository)
    .useValue({})
    .overrideProvider(ProductVariantsRepository)
    .useValue({})
    .compile();
};
