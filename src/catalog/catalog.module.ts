import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule } from "@shared/modules";
import { MyEasySuiteModule } from "@myeasysuite/myeasysuite.module";
import { ProductsController } from "./api/ProductsController";
import { ProductTypesController } from "./api/ProductTypesController";
import { ProductVariantsController } from "./api/ProductVariantsController";
import { ProductsRepository } from "./database/ProductsRepository";
import { ProductTypesRepository } from "./database/ProductTypesRepository";
import { VariantsRepository } from "./database";
import { ProductTypeService } from "./services/ProductTypeService";
import { ProductService } from "./services/ProductService";
import { VariantService } from "./services/VariantService";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule,
    HttpModule,
    AzureTelemetryModule,
    CacheModule.register(),
    MyEasySuiteModule,
  ],
  providers: [
    ProductTypesRepository,
    ProductsRepository,
    VariantsRepository,
    ProductTypeService,
    ProductService,
    VariantService,
  ],
  exports: [],
  controllers: [
    ProductTypesController,
    ProductsController,
    ProductVariantsController,
  ],
})
export class CatalogModule {}
