import { CatalogModule } from "@catalog/catalog.module";
import {
  ProductsRepository,
  ProductTypesRepository,
  ProductVariantsRepository,
} from "@catalog/database";
import { DbProductType } from "@catalog/domain";
import { CatalogService } from "@catalog/services";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { HttpModule, HttpService } from "@nestjs/axios";
import { CacheModule } from "@nestjs/common";
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
import {
  AzureLoggerModule,
  AzureLoggerService,
  AzureStorageModule,
} from "@shared/modules";
import {
  CreateSalesOrder,
  GetSalesOrder,
  QuerySalesOrders,
  DeleteSalesOrder,
} from "..";
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
  trace: jest.fn(),
  log: jest.fn(),
  debug: jest.fn(),
};
export const mockSalesModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
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
      {
        provide: ProductTypesRepository,
        useValue: {},
      },
      { provide: MongoOrdersRepository, useValue: {} },
      { provide: SalesOrderRepository, useValue: {} },
      { provide: SalesOrderQuery, useValue: {} },
      { provide: CreateSalesOrder, useValue: {} },
      { provide: GetSalesOrder, useValue: {} },
      { provide: QuerySalesOrders, useValue: {} },
      { provide: DeleteSalesOrder, useValue: {} },
    ],
  })
    .overrideProvider(AzureLoggerService)
    .useValue(mockLogger)
    .overrideProvider(MongoOrdersRepository)
    .useValue({})
    .overrideProvider(CatalogService)
    .useValue({})
    .overrideProvider(getModelToken(MongoSalesOrder.name))
    .useValue({})
    .overrideProvider(ProductTypesRepository)
    .useValue({})
    .overrideProvider(ProductsRepository)
    .useValue({})
    .overrideProvider(ProductVariantsRepository)
    .useValue({})
    .compile();
};
