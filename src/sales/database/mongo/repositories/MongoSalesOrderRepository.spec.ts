import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  mockAddress,
  mockCustomer,
  mockOrderName1,
  mockOrderNumber1,
  mockSalesModule,
  mockUuid1,
} from "@sales/mocks";
import { now } from "@shared/mocks";
import mongoose, { Model } from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import { MongoSalesOrderDocument, MongoSalesOrder } from "../schemas";
import { MongoOrdersRepository } from "./MongoOrdersRepository";

describe("MongoSalesOrderRepository", () => {
  let module: TestingModule;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);
  let repo: MongoOrdersRepository;
  const mockDoc = Object.assign(new MongoSalesOrder(), {
    accountId: mockUuid1,
    billingAddress: mockAddress,
    shippingAddress: mockAddress,
    customer: mockCustomer,
    orderDate: now,
    orderNumber: +mockOrderNumber1,
    orderName: mockOrderName1,
    orderStatus: "OPEN",
    lineItems: [],
    createdAt: now,
    updatedAt: now,
  } as MongoSalesOrder);
  let id: string = null;

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);

    // Set up Repo

    repo = await module.resolve<MongoOrdersRepository>(MongoOrdersRepository);
    let doc: MongoSalesOrder = Object.assign(new MongoSalesOrder(), mockDoc);
    doc = await repo.create(doc);
    id = doc._id.toHexString();
  });

  it("should be defined", () => {
    expect(repo).toBeDefined();
  });
  describe("create", () => {
    it("should correctly create a MongoSalesOrder, generating an id", async () => {
      // GIVEN
      let doc: MongoSalesOrder = Object.assign(new MongoSalesOrder(), mockDoc);
      // WHEN
      let result = await repo.create(doc);
      const expected = {
        __v: 0,
        updatedAt: now,
        createdAt: now,
        accountId: "00000000-0000-0000-0000-000000000001",
        orderStatus: "OPEN",
        orderDate: now,
        orderNumber: 1001,
        orderName: "SLI-10000000001",
        lineItems: [],
        customer: {
          name: "Mock Customer",
          email: "mock.customer@email.com",
        },
        shippingAddress: mockAddress,
        billingAddress: mockAddress,
        _id: result._id,
        id: result.id,
      };
      // THEN
      expect(result).toEqual(expected);
    });
  });
  describe("update", () => {
    describe("given MongoSalesOrder with valid ID", () => {
      it("should find doc by ID and update", async () => {
        // GIVEN
        let doc: MongoSalesOrder = Object.assign(new MongoSalesOrder(), {
          ...mockDoc,
          id: id,
          orderStatus: "CANCELED",
        } as MongoSalesOrder);
        // WHEN
        let result = await repo.findByIdAndUpdateOrCreate(doc);
        const expected = {
          __v: 0,
          updatedAt: now,
          createdAt: now,
          accountId: "00000000-0000-0000-0000-000000000001",
          orderStatus: "CANCELED",
          orderDate: now,
          orderNumber: 1001,
          orderName: "SLI-10000000001",
          lineItems: [],
          customer: {
            name: "Mock Customer",
            email: "mock.customer@email.com",
          },
          shippingAddress: mockAddress,
          billingAddress: mockAddress,
          _id: new mongoose.Types.ObjectId(id),
          id: id,
        };
        // THEN
        expect(result).toEqual(expected);
      });
    });
    describe("given MongoSalesOrder with no ID", () => {
      it("should create doc", async () => {
        // GIVEN
        let doc: MongoSalesOrder = Object.assign(new MongoSalesOrder(), {
          ...mockDoc,
          id: undefined,
          _id: undefined,
          orderStatus: "OPEN",
        } as MongoSalesOrder);
        // WHEN
        let result = await repo.findByIdAndUpdateOrCreate(doc);
        const expected = {
          __v: 0,
          updatedAt: now,
          createdAt: now,
          accountId: "00000000-0000-0000-0000-000000000001",
          orderStatus: "OPEN",
          orderDate: now,
          orderNumber: 1001,
          orderName: "SLI-10000000001",
          lineItems: [],
          customer: {
            name: "Mock Customer",
            email: "mock.customer@email.com",
          },
          shippingAddress: mockAddress,
          billingAddress: mockAddress,
          _id: result._id,
          id: result.id,
        };
        // THEN
        expect(result).toEqual(expected);
      });
    });
  });
});
