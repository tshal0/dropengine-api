import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule, AzureStorageModule } from "@shared/modules";
import { ProductsController } from "./api/ProductsController";
import { ProductTypesController } from "./api/ProductTypesController";
import { ProductVariantsController } from "./api/ProductVariantsController";
import { ProductsRepository } from "./database/ProductsRepository";
import { ProductTypesRepository } from "./database/ProductTypesRepository";
import { ProductVariantsRepository } from "./database/ProductVariantsRepository";
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
  GetProductVariantByUuid,
  GetProductVariantBySku,
  DeleteProductVariant,
  ImportProductVariantCsv,
  QueryProductVariants,
} from "./useCases/ProductVariant";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    HttpModule,
    AzureLoggerModule,
    ConfigModule,
    CacheModule.register(),
    AzureStorageModule,
  ],
  providers: [
    ProductTypesRepository,
    ProductsRepository,
    ProductVariantsRepository,
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
    GetProductVariantByUuid,
    GetProductVariantBySku,
    DeleteProductVariant,
    ImportProductCsv,
    ImportProductVariantCsv,
    QueryProductVariants,
  ],
  controllers: [
    ProductTypesController,
    ProductsController,
    ProductVariantsController,
  ],
})
export class CatalogModule {}
