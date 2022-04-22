import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule } from "@shared/modules";
import { MyEasySuiteModule } from "@myeasysuite/MyEasySuiteModule";
import { ProductsController } from "./api/ProductsController";
import { ProductTypesController } from "./api/ProductTypesController";
import { ProductVariantsController } from "./api/ProductVariantsController";
import { ProductsRepository } from "./database/ProductsRepository";
import { ProductTypesRepository } from "./database/ProductTypesRepository";
import { ProductVariantsRepository } from "./database/ProductVariantsRepository";
import { CatalogService } from "./services";
import {
  GetProductType,
  GetAllProductTypes,
  DeleteProductType,
  CreateProductType,
  GetProduct,
  GetAllProducts,
  CreateProduct,
  DeleteProduct,
  ImportProductCsv,
} from "./useCases";
import { RenameProductType } from "./useCases/ProductType/RenameProductType";
import {
  CreateProductVariant,
  GetProductVariantById,
  GetProductVariantBySku,
  DeleteProductVariant,
  ImportProductVariantCsv,
  QueryProductVariants,
} from "./useCases/ProductVariant";
import { SyncVariant } from "./useCases/SyncVariant";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule,
    HttpModule,
    AzureLoggerModule,
    CacheModule.register(),
    MyEasySuiteModule,
  ],
  providers: [
    ProductTypesRepository,
    ProductsRepository,
    ProductVariantsRepository,
    CatalogService,
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
    SyncVariant,
  ],
  exports: [CatalogService],
  controllers: [
    ProductTypesController,
    ProductsController,
    ProductVariantsController,
  ],
})
export class CatalogModule {}
