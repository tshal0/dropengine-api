import { CatalogService } from "@catalog/services";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  MongoSalesOrderDocument,
  MongoSalesOrder,
  MongoOrdersRepository,
  SalesOrderRepository,
  MongoLineItem,
} from "@sales/database";
import {
  mockAddress,
  mockBottomText,
  mockCatalogVariant,
  mockCustomer,
  mockSalesModule,
  mockTopText,
} from "@sales/mocks";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import { UpdatePersonalization } from "./UpdatePersonalization";

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
    const mockLineItem: MongoLineItem = {
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
      mockOrder = await ordersRepo.create(mockOrder);
      mockLineItem.id = mockOrder.lineItems[0].id;
      let test = await ordersRepo.findById(mockOrder.id);
    });
    it("should update the personalization and save the SalesOrder", async () => {
      const mockDto = {
        lineItemId: mockLineItem.id,
        orderId: mockOrder.id,
        personalization: [
          { name: mockTopText, value: "ValidText" },
          { name: mockBottomText, value: "ValidText" },
        ],
      };
      // GIVEN

      // WHEN
      // const error: any = await getAsyncError(
      //   async () =>
      //     await service.execute({
      //       lineItemId: mockLineItem.id,
      //       orderId: mockOrder.id,
      //       personalization: [{ name: mockTopText, value: "ValidText" }],
      //     })
      // );
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
            id: mockLineItem.id,
            lineNumber: 1,
            quantity: 1,
            variant: mockVariant,
            personalization: mockDto.personalization,
            flags: [],
            createdAt: now,
            updatedAt: now,
          },
        ],
        customer: {
          email: "mock.customer@email.com",
          name: "Mock Customer",
        },
        shippingAddress: mockAddress,
        billingAddress: mockAddress,
        createdAt: now,
        updatedAt: now,
      };

      // THEN
      const props = result.props();
      console.log(safeJsonStringify(props, null, 2));

      expect(props).toMatchObject(expected);
    });
  });
  // GIVEN
  // WHEN
  // THEN
});
