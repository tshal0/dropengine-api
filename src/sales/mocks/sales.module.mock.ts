import { AuthModule } from "@auth/auth.module";
import { CatalogModule } from "@catalog/catalog.module";
import { CatalogService } from "@catalog/services";
import { rootMongooseTestModule } from "@jestconfig/mongodb-memory-server";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { OrdersController } from "@sales/api";
import {
  MongoOrdersRepository,
  MongoSalesOrder,
  MongoSalesOrderSchema,
} from "@sales/database/mongo";
import { MongoDomainEventRepository } from "@sales/database/mongo/repositories/MongoDomainEventRepository";
import {
  MongoDomainEvent,
  MongoDomainEventSchema,
} from "@sales/database/mongo/schemas/MongoDomainEvent";
import { SalesOrderQuery } from "@sales/database/SalesOrderQueries";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";
import { PlaceOrder } from "@sales/features/PlaceOrder";
import {
  GetSalesOrder,
  QuerySalesOrders,
  DeleteSalesOrder,
  UpdatePersonalization,
  UpdateShippingAddress,
} from "@sales/useCases";
import { HandleMyEasySuiteOrderPlaced } from "@sales/useCases/HandleMyEasySuiteOrderPlaced";
import { LoadEvents } from "@sales/useCases/LoadEvents";
import { UpdateCustomerInfo } from "@sales/useCases/UpdateCustomerInfo";
import { AzureTelemetryModule } from "@shared/modules";

jest.mock("@shared/utils", () => {
  return {
    loadAccessToken: jest.fn().mockResolvedValue("MOCK_ACCESS_TOKEN"),
  };
});

export const mockSalesModule = (): TestingModuleBuilder => {
  return Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      rootMongooseTestModule(),
      MongooseModule.forFeature([
        { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
        { name: MongoDomainEvent.name, schema: MongoDomainEventSchema },
      ]),
      AzureTelemetryModule,
      EventEmitterModule.forRoot(),
      HttpModule,
      ConfigModule.forRoot(),
      CacheModule.register(),
      CatalogModule,
      AuthModule,
    ],
    controllers: [OrdersController],
    exports: [],
    providers: [
      { provide: CatalogService, useValue: {} },
      MongoDomainEventRepository,
      MongoOrdersRepository,
      SalesOrderRepository,
      SalesOrderQuery,
      PlaceOrder,
      GetSalesOrder,
      QuerySalesOrders,
      DeleteSalesOrder,
      UpdatePersonalization,
      UpdateShippingAddress,
      LoadEvents,
      UpdateCustomerInfo,
      HandleMyEasySuiteOrderPlaced,
    ],
  });
};
