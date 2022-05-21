import { HttpModule } from "@nestjs/axios";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AzureTelemetryModule } from "@shared/modules";

import { CatalogModule } from "@catalog/catalog.module";
import { MongoOrdersRepository } from "./database/mongo/repositories/MongoOrdersRepository";
import { SalesOrderRepository } from "./database/SalesOrderRepository";
import { MongoSalesOrder, MongoSalesOrderSchema } from "./database/mongo";
import {
  MongoDomainEvent,
  MongoDomainEventSchema,
} from "./database/mongo/schemas/MongoDomainEvent";
import { MongoDomainEventRepository } from "./database/mongo/repositories/MongoDomainEventRepository";
import { LoadEvents } from "./useCases/LoadEvents";
import { HandleMyEasySuiteOrderPlaced } from "./useCases/HandleMyEasySuiteOrderPlaced";
import { AuthModule } from "@auth/auth.module";
import {
  ChangeCustomerInfo,
  ChangePersonalization,
  ChangeShippingAddress,
  PlaceOrder,
} from "./features";
import { SalesService } from "./services/SalesService";
import { OrdersController } from "./api";
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
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [
    MongoDomainEventRepository,
    MongoOrdersRepository,
    SalesOrderRepository,
    PlaceOrder,
    ChangeCustomerInfo,
    ChangeShippingAddress,
    ChangePersonalization,
    LoadEvents,
    HandleMyEasySuiteOrderPlaced,
    SalesService,
  ],
})
export class SalesModule {}
