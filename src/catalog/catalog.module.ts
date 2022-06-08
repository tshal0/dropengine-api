import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule } from "@shared/modules";
import { MyEasySuiteModule } from "@myeasysuite/myeasysuite.module";
import { ProductsController } from "./api/ProductsController";
import { ProductTypesController } from "./api/ProductTypesController";
import { ProductVariantsController } from "./api/VariantsController";
import { ProductsRepository } from "./database/ProductsRepository";
import { ProductTypesRepository } from "./database/ProductTypesRepository";
import { VariantsRepository } from "./database";
import { ProductTypeService } from "./services/ProductTypeService";
import { ProductService } from "./services/ProductService";
import { VariantService } from "./services/VariantService";
import { CatalogService } from "./services/CatalogService";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "./database/entities";
import { ProductTypeResolver } from "./graphql";
import { ProductResolver } from "./graphql/ProductResolver";
import { VariantResolver } from "./graphql/VariantResolver";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule,
    HttpModule,
    AzureTelemetryModule,
    CacheModule.register(),
    MyEasySuiteModule,
    MikroOrmModule.forFeature([DbProductType, DbProduct, DbProductVariant]),
  ],
  controllers: [
    ProductTypesController,
    ProductsController,
    ProductVariantsController,
  ],
  providers: [
    ProductTypesRepository,
    ProductsRepository,
    VariantsRepository,
    ProductTypeService,
    ProductService,
    VariantService,
    CatalogService,
    ProductTypeResolver,
    ProductResolver,
    VariantResolver,
  ],
  exports: [CatalogService],
})
export class CatalogModule {}
