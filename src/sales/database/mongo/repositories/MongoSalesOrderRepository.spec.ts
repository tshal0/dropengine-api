import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule } from "@nestjs/testing";
import { mockSalesModule } from "@sales/mocks";
import { Model } from "mongoose";
import { MongoSalesOrderDocument, MongoSalesOrder } from "../schemas";
import { MongoOrdersRepository } from "./MongoOrdersRepository";

describe("MongoSalesOrderRepository", () => {
  let module: TestingModule;
  let model: Model<MongoSalesOrderDocument>;
  const modelToken = getModelToken(MongoSalesOrder.name);
  let ordersRepo: MongoOrdersRepository;

  beforeAll(() => {});

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    model = await module.resolve<Model<MongoSalesOrderDocument>>(modelToken);

    // Set up Repo

    ordersRepo = await module.resolve<MongoOrdersRepository>(
      MongoOrdersRepository
    );
  });

  it("should be defined", () => {
    expect(ordersRepo).toBeDefined();
  });
});
