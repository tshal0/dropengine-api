import { MongoMemoryServer } from "mongodb-memory-server";
import { CatalogModule } from "@catalog/catalog.module";
import {
  ProductsRepository,
  ProductTypesRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { CatalogService } from "@catalog/services";
import { HttpModule, HttpService } from "@nestjs/axios";
import { CacheModule, LogLevel } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { TestingModule, Test } from "@nestjs/testing";
import { OrdersController } from "@sales/api";

import {
  MongoOrdersRepository,
  MongoSalesOrder,
  MongoSalesOrderSchema,
  SalesOrderQuery,
  SalesOrderRepository,
} from "@sales/database";
import { AzureLoggerModule, AzureLoggerService } from "@shared/modules";
import {
  CreateSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
  DeleteSalesOrder,
} from "..";
import { rootMongooseTestModule } from "@jestconfig/mongodb-memory-server";
import {
  ExceptionTelemetry,
  RequestTelemetry,
  EventTelemetry,
  TraceTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
import NodeClient from "applicationinsights/out/Library/NodeClient";
import { MyEasySuiteClient } from "@myeasysuite/MyEasySuiteClient";

const configMock = {
  get: jest.fn((key: string) => {
    return key.toUpperCase();
  }),
};
const httpMock = {
  get: jest.fn((key: string) => {
    return key.toUpperCase();
  }),
};
const eventEmitterMock = {
  emit: jest.fn().mockReturnValue(true),
};
const mockLogger = {
  trace: function (telemetry: TraceTelemetry): void {
    console.debug(JSON.stringify(telemetry, null, 2));
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
export const mockSalesModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      rootMongooseTestModule(),
      MongooseModule.forFeature([
        { name: MongoSalesOrder.name, schema: MongoSalesOrderSchema },
      ]),
      HttpModule,
      ConfigModule.forRoot(),
      AzureLoggerModule,
      CacheModule.register(),
      CatalogModule,
    ],
    controllers: [OrdersController],
    exports: [],

    providers: [
      { provide: EventEmitter2, useValue: eventEmitterMock },
      { provide: ConfigService, useValue: configMock },
      { provide: HttpService, useValue: httpMock },

      MongoOrdersRepository,
      SalesOrderRepository,
      CreateSalesOrder,
      {
        provide: ProductTypesRepository,
        useValue: {},
      },
      { provide: SalesOrderQuery, useValue: {} },
      { provide: GetSalesOrder, useValue: {} },
      { provide: QuerySalesOrders, useValue: {} },
      { provide: DeleteSalesOrder, useValue: {} },
    ],
  })
    .overrideProvider(AzureLoggerService)
    .useValue(mockLogger)
    .overrideProvider(CatalogService)
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
