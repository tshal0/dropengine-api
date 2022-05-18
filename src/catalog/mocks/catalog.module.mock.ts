import { MyEasySuiteModule } from "@myeasysuite/myeasysuite.module";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { ProductsController } from "@catalog/api/ProductsController";
import { ProductTypesController } from "@catalog/api/ProductTypesController";
import { ProductVariantsController } from "@catalog/api/VariantsController";
import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { TestingModuleBuilder, Test } from "@nestjs/testing";
import {
  ProductTypesRepository,
  ProductsRepository,
  VariantsRepository,
} from "..";
import { HttpModule } from "@nestjs/axios";
import { CatalogService } from "@catalog/services/CatalogService";
import { ProductService } from "@catalog/services/ProductService";
import { ProductTypeService } from "@catalog/services/ProductTypeService";
import { VariantService } from "@catalog/services/VariantService";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";

jest.mock("@shared/utils", () => {
  return {
    loadAccessToken: jest.fn().mockResolvedValue("MOCK_ACCESS_TOKEN"),
  };
});
export const mockCatalogModule = (): TestingModuleBuilder => {
  return Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      EventEmitterModule.forRoot(),
      HttpModule,
      ConfigModule.forRoot(),
      CacheModule.register(),
      MyEasySuiteModule,
    ],
    providers: [
      {
        provide: getRepositoryToken(DbProductType),
        useValue: {},
      },
      {
        provide: getRepositoryToken(DbProduct),
        useValue: {},
      },
      {
        provide: getRepositoryToken(DbProductVariant),
        useValue: {},
      },
      ProductTypesRepository,
      ProductsRepository,
      VariantsRepository,
      ProductTypeService,
      ProductService,
      VariantService,
      CatalogService,
      { provide: MyEasySuiteClient, useValue: {} },
    ],
    exports: [],
    controllers: [
      ProductTypesController,
      ProductsController,
      ProductVariantsController,
    ],
  });
};
