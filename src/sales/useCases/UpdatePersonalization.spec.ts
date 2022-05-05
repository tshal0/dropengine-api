import { CatalogService } from "@catalog/services";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import { MongoLineItemsRepository } from "@sales/database/mongo/MongoLineItemRepository";
import { MongoSalesLineItem } from "@sales/database/mongo/MongoSalesLineItem";
import {
  MongoSalesOrderDocument,
  MongoSalesOrder,
} from "@sales/database/mongo/MongoSalesOrder";
import { MongoOrdersRepository } from "@sales/database/mongo/MongoSalesOrderRepository";
import { SalesOrderRepository } from "@sales/database/SalesOrderRepository";

import {
  mockAddress,
  mockBottomText,
  mockCatalogVariant,
  mockCustomer,
  mockSalesModule,
  mockTopText,
} from "@sales/mocks";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import { UpdatePersonalization } from "./UpdatePersonalization";
spyOnDate();
class NoErrorThrownError extends Error {}

const getAsyncError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

describe("UpdatePersonalization", () => {
  let module: TestingModule;
  let service: UpdatePersonalization;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);
  let catalogService: CatalogService;
  let ordersRepo: MongoOrdersRepository;
  let lineItemsRepo: MongoLineItemsRepository;

  let salesRepo: SalesOrderRepository;
  beforeAll(() => {});

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    service = await module.resolve<UpdatePersonalization>(
      UpdatePersonalization
    );
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
    catalogService = await module.resolve<CatalogService>(CatalogService);

    // Set up Repo
    lineItemsRepo = await module.resolve<MongoLineItemsRepository>(
      MongoLineItemsRepository
    );
    ordersRepo = await module.resolve<MongoOrdersRepository>(
      MongoOrdersRepository
    );
    salesRepo = await module.resolve<SalesOrderRepository>(
      SalesOrderRepository
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("given valid SalesOrder, SalesLineItem, and personalization", () => {
    const mockUid = "000000000000000000000001";
    const mockVariant = mockCatalogVariant();
    let mockLineItem: MongoSalesLineItem = {
      lineNumber: 1,
      quantity: 1,
      variant: cloneDeep(mockVariant),
      personalization: [],
      flags: [],
      updatedAt: now,
      createdAt: now,
    };
    let mockOrder: MongoSalesOrder = {
      accountId: mockUid,
      orderStatus: "OPEN",
      orderDate: now,
      orderName: "SLI-1001",
      orderNumber: 1001,
      lineItems: [mockLineItem],
      customer: mockCustomer,
      shippingAddress: mockAddress,
      billingAddress: mockAddress,
      updatedAt: now,
      createdAt: now,
    };
    beforeEach(async () => {
      mockLineItem = await lineItemsRepo.create(mockLineItem);
      mockOrder.lineItems = [mockLineItem.id] as any;
      mockOrder = await ordersRepo.create(mockOrder);
      mockLineItem.id = mockOrder.lineItems[0].id;
    });
    it("should update the personalization and save the SalesOrder", async () => {
      // GIVEN
      const mockDto = {
        lineItemId: mockLineItem.id,
        orderId: mockOrder.id,
        personalization: [
          { name: mockTopText, value: "ValidText" },
          { name: mockBottomText, value: "ValidText" },
        ],
      };

      // WHEN

      const result = await service.execute(mockDto);
      const expected = {
        id: mockLineItem.id,
        lineNumber: 1,
        quantity: 1,
        variant: mockVariant,
        personalization: mockDto.personalization,
        flags: [],
        createdAt: now,
        updatedAt: now,
      };

      // THEN
      const props = result.props();

      expect(props).toEqual(expected);
    });
  });
  // GIVEN
  // WHEN
  // THEN
});
