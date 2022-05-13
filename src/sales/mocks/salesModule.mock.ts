import { CatalogModule } from "@catalog/catalog.module";
import {
  ProductsRepository,
  ProductTypesRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { CatalogService } from "@catalog/services";
import { HttpModule, HttpService } from "@nestjs/axios";
import { CacheModule, HttpStatus } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { TestingModule, Test } from "@nestjs/testing";
import { OrdersController } from "@sales/api";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

import { AzureTelemetryModule, AzureTelemetryService } from "@shared/modules";
import {
  CreateSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
  DeleteSalesOrder,
  UpdateShippingAddress,
} from "../useCases";
import { rootMongooseTestModule } from "@jestconfig/mongodb-memory-server";
import { TraceTelemetry } from "applicationinsights/out/Declarations/Contracts";

import safeJsonStringify from "safe-json-stringify";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { UpdatePersonalization } from "../useCases/UpdatePersonalization";
import { MongoOrdersRepository } from "@sales/database/mongo/repositories/MongoOrdersRepository";
import { SalesOrderQuery } from "@sales/database/SalesOrderQueries";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";
import {
  MongoSalesOrder,
  MongoSalesOrderSchema,
  MongoSalesLineItem,
  MongoSalesLineItemSchema,
} from "@sales/database/mongo";
import { MongoDomainEventRepository } from "@sales/database/mongo/repositories/MongoDomainEventRepository";
import {
  MongoDomainEvent,
  MongoDomainEventSchema,
} from "@sales/database/mongo/schemas/MongoDomainEvent";
import { AuthModule } from "@auth/auth.module";
import { HandleMyEasySuiteOrderPlaced } from "@sales/useCases/HandleMyEasySuiteOrderPlaced";
import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import { UpdateCustomerInfo } from "@sales/useCases/UpdateCustomerInfo";
import { LoadEvents } from "@sales/useCases/LoadEvents";
/** MOCK UTILS */
jest.mock("@shared/utils", () => {
  return {
    loadAccessToken: jest.fn().mockResolvedValue("MOCK_ACCESS_TOKEN"),
  };
});

/** MOCK SALES MODULE */
export const mockSalesModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      rootMongooseTestModule(),
      MongooseModule.forFeature([
        { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
        { name: MongoSalesLineItem.name, schema: MongoSalesLineItemSchema },
        { name: MongoDomainEvent.name, schema: MongoDomainEventSchema },
      ]),
      EventEmitterModule.forRoot(),
      HttpModule,
      ConfigModule.forRoot(),
      AzureTelemetryModule,
      CacheModule.register(),
      CatalogModule,
      AuthModule,
    ],
    controllers: [OrdersController],
    exports: [],

    providers: [
      { provide: EventEmitter2, useValue: eventEmitterMock },
      { provide: ConfigService, useValue: configMock },
      { provide: HttpService, useValue: httpMock },
      { provide: WINSTON_MODULE_PROVIDER, useValue: {} },
      MongoOrdersRepository,
      MongoDomainEventRepository,
      SalesOrderRepository,
      CreateSalesOrder,
      {
        provide: ProductTypesRepository,
        useValue: {},
      },
      {
        provide: StoresRepository,
        useValue: {},
      },
      {
        provide: AccountsRepository,
        useValue: {},
      },
      { provide: SalesOrderQuery, useValue: {} },
      { provide: GetSalesOrder, useValue: {} },
      { provide: QuerySalesOrders, useValue: {} },
      { provide: DeleteSalesOrder, useValue: {} },
      UpdatePersonalization,
      UpdateShippingAddress,
      UpdateCustomerInfo,
      LoadEvents,
      HandleMyEasySuiteOrderPlaced,
    ],
  })
    .overrideProvider(AzureTelemetryService)
    .useValue(mockLogger)
    .overrideProvider(CatalogService)
    .useValue({
      syncVariant: jest.fn(),
      loadVariantBySku: jest.fn(),
      loadVariantById: jest.fn(),
    })
    .overrideProvider(StoresRepository)
    .useValue({})
    .overrideProvider(AccountsRepository)
    .useValue({})
    .overrideProvider(ProductTypesRepository)
    .useValue({})
    .overrideProvider(ProductsRepository)
    .useValue({})
    .overrideProvider(ProductVariantsRepository)
    .useValue({})
    .overrideProvider(MyEasySuiteClient)
    .useValue({})
    .compile();
};
/** MOCK CONFIG */
const configMock = {
  get: jest.fn((key: string) => {
    return key.toUpperCase();
  }),
};
/** MOCK HTTP */
const httpMock = {
  get: jest.fn((key: string) => {
    return key.toUpperCase();
  }),
};
/** MOCK EVENT EMITTER */
const eventEmitterMock = {
  emit: jest.fn().mockReturnValue(true),
};
/** MOCK LOGGER */
const mockLogger = {
  trace: function (telemetry: TraceTelemetry): void {
    console.debug(safeJsonStringify(telemetry, null, 2));
  },
  error: function (message: string, stack?: string, context?: any): void {
    console.error(message, stack, context);
  },
  log: function (message: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  },
  debug: function (message: any, ...optionalParams: any[]): void {
    console.debug(message, ...optionalParams);
  },
};
