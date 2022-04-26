import { TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { Result } from "@shared/domain";
import { now, spyOnDate } from "@shared/mocks";
import { CatalogService } from "@catalog/services";

import { CreateSalesOrder } from "..";
import { mockSalesModule } from "./mockCreateSalesOrder";
import { createSalesOrderDto, expectedCreateOrderProps } from "./fixtures";

import { CreateOrderApiDto } from "@sales/api";
import { CreateOrderDto } from "@sales/dto";
import {
  MongoOrdersRepository,
  MongoSalesOrder,
  MongoSalesOrderDocument,
  SalesOrderRepository,
} from "@sales/database";
import { SalesOrder } from "@sales/domain";
import {
  mockCatalogVariant1,
  mockCustomer,
  mockOrderName1,
  mockOrderNumber1,
  mockUuid1,
  mockAddress,
  mockTopText,
  mockMiddleText,
  mockBottomText,
  mockInitial,
  mockLineItem,
} from "@sales/mocks";

import { cloneDeep } from "lodash";

describe("CreateSalesOrder", () => {
  let module: TestingModule;
  let service: CreateSalesOrder;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);

  beforeAll(() => {});

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    service = await module.resolve<CreateSalesOrder>(CreateSalesOrder);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("given valid CreateSalesOrderApiDto", () => {
    it("should generate and create a valid SalesOrder", async () => {
      const mockAccountId = mockUuid1;
      const mockShipping = mockAddress;
      const mockBilling = mockAddress;
      const mockLi1 = cloneDeep(mockLineItem);
      mockLi1.sku = mockCatalogVariant1.sku;
      mockLi1.lineItemProperties = [
        { name: mockTopText, value: "ValidText" },
        { name: mockMiddleText, value: "ValidText" },
        { name: mockBottomText, value: "ValidText" },
        { name: mockInitial, value: "M" },
      ];
      const mockDto: CreateOrderApiDto = {
        accountId: mockAccountId,
        orderName: mockOrderName1,
        orderDate: now,
        orderNumber: mockOrderNumber1,
        customer: mockCustomer,
        lineItems: [mockLi1],
        shippingAddress: mockShipping,
        billingAddress: mockBilling,
      };
      const mockSalesOrderDto1: CreateOrderDto = cloneDeep(createSalesOrderDto);
      const mockSalesOrder1 = SalesOrder.create(mockSalesOrderDto1);
      // Set up CatalogService
      const catalogService = await module.resolve<CatalogService>(
        CatalogService
      );
      catalogService.loadLineItemVariantBySku = jest
        .fn()
        .mockResolvedValue(Result.ok(mockCatalogVariant1));

      // Set up Repo
      const ordersRepo = await module.resolve<MongoOrdersRepository>(
        MongoOrdersRepository
      );
      const salesRepo = await module.resolve<SalesOrderRepository>(
        SalesOrderRepository
      );

      const res = await service.execute(mockDto);
      expect(res.isFailure).toBe(false);
      const props = res.value().props();
      expect(props).toMatchObject(expectedCreateOrderProps);
    });
  });
});
