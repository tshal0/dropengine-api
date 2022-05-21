import { MESMetalArtMocks } from "@catalog/mocks";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import { MongoSalesOrderDocument, MongoSalesOrder } from "@sales/database";
import { OrderStatus } from "@sales/domain";
import { SalesOrderMocks, withDefaults } from "@sales/mocks";
import { now } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";
import { OrdersController } from "./OrdersController";

describe("OrdersController", () => {
  let module: TestingModule;
  let service: OrdersController;
  let model: Model<MongoSalesOrderDocument>;

  beforeEach(async () => {
    module = await withDefaults().compile();
    service = await module.resolve<OrdersController>(OrdersController);
    const modelToken = getModelToken(MongoSalesOrder.name);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
  });
  afterAll(async () => {
    await closeMongoConnection();
  });
  it("should exist", () => {
    expect(service).toBeDefined();
  });

  describe("getById", () => {
    it("should return SalesOrder > OrderResponse", async () => {
      // GIVEN
      let toBeCreated = new MongoSalesOrder(
        cloneDeep(SalesOrderMocks.orderProps)
      );
      const raw = toBeCreated.raw();
      let doc = await model.create(raw);

      // WHEN
      let result = await service.getById(doc.id);

      // THEN
      expect(result).toEqual({
        id: expect.anything(),
        billingAddress: SalesOrderMocks.billingAddress,
        customer: SalesOrderMocks.customer,
        lineItems: [SalesOrderMocks.salesLineItem1],
        orderDate: now,
        orderName: SalesOrderMocks.orderName,
        orderNumber: SalesOrderMocks.orderNumber,
        orderStatus: OrderStatus.OPEN,
        shippingAddress: SalesOrderMocks.shippingAddress,
      });
    });
  });
});
