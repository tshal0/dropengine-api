import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import { MESMetalArtMocks } from "@catalog/mocks";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import {
  ISalesOrder,
  ISalesOrderProps,
  OrderStatus,
  SalesOrder,
} from "@sales/domain";
import {
  ISalesLineItemProps,
  SalesLineItem,
} from "@sales/domain/model/SalesLineItem";
import { mockUuid1 } from "@sales/mocks";
import { mockSalesModule } from "@sales/mocks/sales.module.mock";
import { Address, IAddress } from "@shared/domain";
import { now, spyOnDate } from "@shared/mocks";
import { cloneDeep } from "lodash";
import { Model, connection, Types } from "mongoose";
import { MongoSalesOrder, MongoSalesOrderDocument } from "../schemas";
import {
  MongoOrdersRepository,
  SalesOrderQueryResult,
} from "./MongoOrdersRepository";
import csv from "csvtojson";

export abstract class MongoMocks {
  static readonly addressProps: IAddress = {
    zip: "43844-9406",
    city: "Warsaw",
    name: "Tony Stark",
    phone: "2563472777",
    company: "MyEasySuite Inc.",
    country: "United States",
    address1: "19936 County Road 18",
    address2: "",
    address3: "",
    latitude: 40.2496938,
    province: "Ohio",
    lastName: "Stark",
    longitude: -82.1265222,
    firstName: "Tony",
    countryCode: "US",
    provinceCode: "OH",
  };
  static readonly address: Address = new Address(MongoMocks.addressProps);
  static readonly lineItemProps: ISalesLineItemProps = {
    lineNumber: 1,
    quantity: 1,
    variant: cloneDeep(MESMetalArtMocks.expectedCatalogVariant),
    personalization: [
      { name: "Top Text", value: "Sample" },
      { name: "Bottom Text", value: "Sample" },
    ],
    flags: [],
  };
  static readonly lineItem: SalesLineItem = new SalesLineItem(
    cloneDeep(MongoMocks.lineItemProps)
  );
  static readonly mockMongoId = "000000000000000000000001";
  static readonly orderProps: ISalesOrderProps = {
    id: MongoMocks.mockMongoId,
    accountId: mockUuid1,
    orderName: "SLI-1001",
    orderNumber: 1001,
    orderDate: now,
    orderStatus: OrderStatus.OPEN,
    lineItems: [cloneDeep(MongoMocks.lineItemProps)],
    customer: { email: "sample@mail.com", name: "SampleCustomer" },
    shippingAddress: cloneDeep(MongoMocks.addressProps),
    billingAddress: cloneDeep(MongoMocks.addressProps),
    updatedAt: now,
    createdAt: now,
  };
  static readonly order: SalesOrder = new SalesOrder(MongoMocks.orderProps);

  static readonly expectedOrderProps: ISalesOrderProps = {
    id: null,
    orderDate: now,
    orderName: "SLI-1001",
    orderNumber: 1001,
    orderStatus: OrderStatus.OPEN,
    accountId: mockUuid1,
    billingAddress: MongoMocks.addressProps,
    customer: {
      email: "sample@mail.com",
      name: "SampleCustomer",
    },
    lineItems: [
      {
        flags: [],
        lineNumber: 1,
        personalization: [
          {
            name: "Top Text",
            value: "Sample",
          },
          {
            name: "Bottom Text",
            value: "Sample",
          },
        ],
        quantity: 1,
        variant: MESMetalArtMocks.expectedCatalogVariant,
      },
    ],
    shippingAddress: MongoMocks.addressProps,
    updatedAt: now,
    createdAt: now,
  };
}

// spyOnDate();
describe("MongoOrdersRepository", () => {
  let module: TestingModule;
  let service: MongoOrdersRepository;
  let model: Model<MongoSalesOrderDocument>;

  beforeEach(async () => {
    module = await mockSalesModule()
      .overrideProvider(getRepositoryToken(DbProductType))
      .useValue({})
      .overrideProvider(getRepositoryToken(DbProduct))
      .useValue({})
      .overrideProvider(getRepositoryToken(DbProductVariant))
      .useValue({})
      .overrideProvider(AccountsRepository)
      .useValue({})
      .overrideProvider(StoresRepository)
      .useValue({})
      .compile();

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
        r.lineItems = JSON.parse(r.lineItems).map((li) => {
          li._id = null;
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
        skip: 1,
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
