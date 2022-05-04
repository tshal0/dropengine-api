import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule, AzureStorageModule } from "@shared/modules";
import {
  MongoOrdersRepository,
  MongoSalesOrder,
  MongoSalesOrderSchema,
  SalesOrderQuery,
  SalesOrderRepository,
} from "./database";
import { OrdersController } from "./api";

import {
  DeleteSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
  CreateSalesOrder,
} from "./useCases";
import { CatalogModule } from "@catalog/catalog.module";
import { AuthModule } from "@auth/auth.module";
import { UpdatePersonalization } from "./useCases/UpdatePersonalization";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
    ]),
    HttpModule,
    AzureTelemetryModule,
    ConfigModule,
    CacheModule.register(),
    CatalogModule,
  ],
  controllers: [OrdersController],
  providers: [
    MongoOrdersRepository,
    SalesOrderRepository,
    SalesOrderQuery,
    CreateSalesOrder,
    GetSalesOrder,
    QuerySalesOrders,
    DeleteSalesOrder,
    UpdatePersonalization,
  ],
})
export class SalesModule {}
