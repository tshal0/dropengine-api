import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule, AzureStorageModule } from "@shared/modules";

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
import { MongoOrdersRepository } from "./database/mongo/repositories/MongoOrdersRepository";
import { SalesOrderQuery } from "./database/SalesOrderQueries";
import { SalesOrderRepository } from "./database/SalesOrderRepository";
import { SalesLineItemRepository } from "./database/SalesLineItemRepository";
import {
  MongoSalesLineItem,
  MongoSalesLineItemSchema,
  MongoSalesOrder,
  MongoSalesOrderSchema,
  MongoLineItemsRepository,
} from "./database/mongo";

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
    SalesLineItemRepository,
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
