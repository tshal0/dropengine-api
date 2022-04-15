import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureLoggerModule, AzureStorageModule } from "@shared/modules";
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
import { AccountsModule } from "@accounts/accounts.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
    ]),
    HttpModule,
    AzureLoggerModule,
    ConfigModule,
    CacheModule.register(),
    AzureStorageModule,
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
  ],
})
export class SalesModule {}
