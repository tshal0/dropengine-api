import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
import { MongoSalesOrder, MongoSalesOrderSchema } from "./database/mongo";
import {
  MongoDomainEvent,
  MongoDomainEventSchema,
} from "./database/mongo/schemas/MongoDomainEvent";
import { MongoDomainEventRepository } from "./database/mongo/repositories/MongoDomainEventRepository";
import { LoadEvents } from "./useCases/LoadEvents";
import { UpdateCustomerInfo } from "./useCases/UpdateCustomerInfo";
import { HandleMyEasySuiteOrderPlaced } from "./useCases/HandleMyEasySuiteOrderPlaced";
import { AuthModule } from "@auth/auth.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: MongoDomainEvent.name, schema: MongoDomainEventSchema },
    ]),
    MongooseModule.forFeature([
      { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
    ]),
    HttpModule,
    AzureTelemetryModule,
    ConfigModule,
    CacheModule.register(),
    CatalogModule,
    AuthModule
  ],
  controllers: [OrdersController],
  providers: [
    MongoDomainEventRepository,
    MongoOrdersRepository,
    SalesOrderRepository,
    SalesOrderQuery,
    CreateSalesOrder,
    GetSalesOrder,
    QuerySalesOrders,
    DeleteSalesOrder,
    UpdatePersonalization,
    UpdateShippingAddress,
    LoadEvents,
    UpdateCustomerInfo,
    HandleMyEasySuiteOrderPlaced,
  ],
})
export class SalesModule {}
