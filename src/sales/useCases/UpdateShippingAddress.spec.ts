import { CatalogService } from "@catalog/services";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  MongoSalesOrderDocument,
  MongoSalesOrder,
  MongoOrdersRepository,
  MongoSalesLineItem,
} from "@sales/database/mongo";
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
import { cloneDeep, rearg } from "lodash";
import { Model } from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import { UpdateShippingAddress } from "./UpdateShippingAddress";
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

describe("UpdateShippingAddress", () => {
  let module: TestingModule;
  let service: UpdateShippingAddress;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);
  let catalogService: CatalogService;
  let ordersRepo: MongoOrdersRepository;
  let salesRepo: SalesOrderRepository;
  beforeAll(() => {});

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    service = await module.resolve<UpdateShippingAddress>(
      UpdateShippingAddress
    );
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
    catalogService = await module.resolve<CatalogService>(CatalogService);

    // Set up Repo

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

  describe("given valid SalesOrder, Address", () => {
    const mockUid = "000000000000000000000001";
    const mockVariant = mockCatalogVariant();
    let mockLineItem: MongoSalesLineItem = {
      lineNumber: 1,
      quantity: 1,
      variant: cloneDeep(mockVariant),
      personalization: [
        { name: mockTopText, value: "ValidText" },
        { name: mockBottomText, value: "ValidText" },
      ],
      flags: [],
    };
    let mockOrder: MongoSalesOrder = {
      accountId: mockUid,
      orderStatus: "OPEN",
      orderDate: now,
      orderName: "SLI-1001",
      orderNumber: 1001,
      lineItems: [cloneDeep(mockLineItem)],
      customer: mockCustomer,
      shippingAddress: mockAddress,
      billingAddress: mockAddress,
      updatedAt: now,
      createdAt: now,
    };
    let realOrder: MongoSalesOrder;
    let realLineItem: MongoSalesLineItem;
    beforeEach(async () => {
      realOrder = await ordersRepo.create(mockOrder);
    });
    it("should update the shippingAddress and save the SalesOrder", async () => {
      // GIVEN
      const mockAddressDto = cloneDeep(mockAddress);
      mockAddressDto.province = "Alabama";
      mockAddressDto.provinceCode = "AL";
      const mockDto = {
        orderId: realOrder.id,
        shippingAddress: mockAddressDto,
      };

      // WHEN

      const result = await service.execute(mockDto);
      const expected = {
        shippingAddress: { ...mockAddressDto },
      };

      // THEN
      const props = result.raw();

      expect(props).toMatchObject(expected);
    });
  });
  // GIVEN
  // WHEN
  // THEN
});
