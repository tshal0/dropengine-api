import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule, AzureStorageModule } from "@shared/modules";
import {
  MongoSalesLineItemSchema,
  MongoOrdersRepository,
  MongoSalesLineItem,
  MongoSalesOrder,
  MongoSalesOrderSchema,
  SalesOrderQuery,
  SalesOrderRepository,
  MongoLineItemsRepository,
} from "./database";
import { OrdersController } from "./api";

import {
  CreateSalesOrder,
  DeleteSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
  UpdatePersonalization,
  UpdateShippingAddress,
} from "./useCases";
import { CatalogModule } from "@catalog/catalog.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: MongoSalesLineItem.name, schema: MongoSalesLineItemSchema },
    ]),
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
    MongoLineItemsRepository,
    SalesOrderRepository,
    SalesOrderQuery,
    CreateSalesOrder,
    GetSalesOrder,
    QuerySalesOrders,
    DeleteSalesOrder,
    UpdatePersonalization,
    UpdateShippingAddress,
  ],
})
export class SalesModule {}
