import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import { cloneDeep } from "lodash";
import { Model, Types } from "mongoose";
import {
  MongoSalesLineItem,
  MongoSalesOrder,
  MongoSalesOrderDocument,
} from "../schemas";
import { MongoOrdersRepository } from "./MongoOrdersRepository";
import csv from "csvtojson";
import { MongoMocks } from "@sales/mocks/MongoMocks";
import { withDefaults } from "@sales/mocks";
import { ISalesLineItemProps } from "@sales/domain";

// spyOnDate();
describe("MongoOrdersRepository", () => {
  let module: TestingModule;
  let service: MongoOrdersRepository;
  let model: Model<MongoSalesOrderDocument>;

  beforeEach(async () => {
    module = await withDefaults().compile();

    service = await module.resolve(MongoOrdersRepository);
    const modelToken = getModelToken(MongoSalesOrder.name);
    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);
  });
  afterAll(async () => {
    await closeMongoConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create correct document", async () => {
      let toBeCreated = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));
      let doc = await service.create(toBeCreated);
      const raw = doc.raw();
      const expected = cloneDeep(MongoMocks.expectedOrderProps);
      expected.id = raw.id;
      expect(raw).toEqual(expected);
    });
  });

  describe("findById", () => {
    it("should return null if document is not found", async () => {
      let result = await service.findById(MongoMocks.mockMongoId);
      expect(result).toBe(null);
    });
    it("should return doc if document is found", async () => {
      let doc: MongoSalesOrder;
      let toBeCreated = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));
      const raw = toBeCreated.raw();
      doc = await model.create(raw);
      let result = await service.findById(doc.id);
      expect(result).not.toBe(null);
      expect(result).toBeInstanceOf(MongoSalesOrder);
    });
  });
  describe("insert", () => {
    it("should bulk add items", async () => {
      let toBeCreated1 = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));
      let toBeCreated2 = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));

      toBeCreated2.orderName = "SLI-1002";
      toBeCreated2.orderNumber = 1002;

      let result = await service.insert([
        new MongoSalesOrder(toBeCreated1.raw()),
        new MongoSalesOrder(toBeCreated2.raw()),
      ]);
      let docs = result.map((r) => r.raw());
      let expected = [toBeCreated1.raw(), toBeCreated2.raw()];
      expected.forEach((e) => (e.id = expect.anything()));
      expect(docs).toMatchObject(expected);
    });
  });
  describe("delete", () => {
    it("should find and delete existing doc", async () => {
      let doc: MongoSalesOrder;
      let toBeCreated = new MongoSalesOrder(cloneDeep(MongoMocks.orderProps));
      const raw = toBeCreated.raw();
      doc = await model.create(raw);
      let result = await service.delete(doc.id);
      expect(result).not.toBe(null);
      expect(result).toBeInstanceOf(MongoSalesOrder);
    });
    it("should return null if doc not found", async () => {
      let result = await service.delete(MongoMocks.mockMongoId);
      expect(result).toBe(null);
    });
    it("should return null if id is invalid", async () => {
      let result = await service.delete("asdf" as any);
      expect(result).toBe(null);
    });
  });
  describe("query", () => {
    it("should support pagination", async () => {
      //TODO: Insert 100+ orders
      let results = await csv().fromFile("./e2e/fixtures/orders.csv");
      results = results.map((r) => {
        r.lineItems = JSON.parse(r.lineItems).map((li: MongoSalesLineItem) => {
          li.variant.id = null;
          li["_id"] = null;
          return li;
        });
        r.orderNumber = +r.orderNumber;
        r.orderDate = new Date(r.orderDate);
        r._id = Types.ObjectId.createFromHexString(r._id);
        r.shippingAddress.latitude = +r.shippingAddress.latitude || 0;
        r.shippingAddress.longitude = +r.shippingAddress.longitude || 0;

        r.billingAddress.latitude = +r.billingAddress.latitude || 0;
        r.billingAddress.longitude = +r.billingAddress.longitude || 0;
        return r;
      });
      await model.insertMany(results);
      // Paginate, filter

      let p1 = await service.query({
        limit: 10,
        skip: 0,
        sort: { orderDate: -1 },
      });
      let p2 = await service.query({
        limit: 10,
        skip: 10,
        sort: { orderDate: -1 },
      });

      const expectedp1 = {
        total: 254,
        pages: 25,
        size: 10,
        page: 0,
      };
      const expectedp2 = {
        total: 254,
        pages: 25,
        size: 10,
        page: 1,
      };
      expect(p1).toMatchObject(expectedp1);
      expect(p2).toMatchObject(expectedp2);
    });
  });
});
