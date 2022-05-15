import { MyEasySuiteModule } from "@myeasysuite/myeasysuite.module";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { ProductsController } from "@catalog/api/ProductsController";
import { ProductTypesController } from "@catalog/api/ProductTypesController";
import { ProductVariantsController } from "@catalog/api/ProductVariantsController";
import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { TestingModuleBuilder, Test } from "@nestjs/testing";
import { ProductTypesRepository, ProductsRepository } from "..";
import { HttpModule } from "@nestjs/axios";

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
      { provide: ProductTypesRepository, useValue: {} },
      { provide: ProductsRepository, useValue: {} },

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
