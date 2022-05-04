import { CatalogService } from "@catalog/services";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  MongoSalesOrderDocument,
  MongoSalesOrder,
  MongoOrdersRepository,
  SalesOrderRepository,
  MongoSalesLineItem,
  MongoLineItemsRepository,
} from "@sales/database";
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
  let lineItemsRepo: MongoLineItemsRepository;
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

  describe("given valid SalesOrder, Address", () => {
    const mockUid = "000000000000000000000001";
    const mockVariant = mockCatalogVariant();
    let mockLineItem: MongoSalesLineItem = {
      orderId: mockUid,
      lineNumber: 1,
      quantity: 1,
      variant: cloneDeep(mockVariant),
      personalization: [
        { name: mockTopText, value: "ValidText" },
        { name: mockBottomText, value: "ValidText" },
      ],
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
    it("should update the shippingAddress and save the SalesOrder", async () => {
      // GIVEN
      const mockAddressDto = cloneDeep(mockAddress);
      mockAddressDto.province = "Alabama";
      mockAddressDto.provinceCode = "AL";
      const mockDto = {
        orderId: mockOrder.id,
        shippingAddress: mockAddressDto,
      };

      // WHEN

      const result = await service.execute(mockDto);
      const expected = {
        id: mockOrder.id,
        accountId: "000000000000000000000001",
        orderNumber: 1001,
        orderDate: now,
        orderName: "SLI-1001",
        orderStatus: "OPEN",
        lineItems: [
          {
            ...mockLineItem,
          },
        ],
        customer: {
          email: "mock.customer@email.com",
          name: "Mock Customer",
        },
        shippingAddress: { ...mockAddressDto },
        billingAddress: mockAddress,
        createdAt: now,
        updatedAt: now,
      };

      // THEN
      const props = result.props();

      expect(props).toMatchObject(expected);
    });
  });
  // GIVEN
  // WHEN
  // THEN
});
