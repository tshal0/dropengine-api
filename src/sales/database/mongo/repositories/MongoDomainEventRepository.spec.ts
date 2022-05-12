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
import { now, nowStr } from "@shared/mocks";
import { NoErrorThrownError } from "@shared/utils";
import mongoose, { Model } from "mongoose";
import safeJsonStringify from "safe-json-stringify";
import {
  MongoDomainEvent,
  MongoDomainEventDocument,
} from "../schemas/MongoDomainEvent";
import { MongoDomainEventRepository } from "./MongoDomainEventRepository";

describe("MongoDomainEventRepository", () => {
  let module: TestingModule;
  let model: Model<MongoDomainEventDocument>;
  const modelToken = getModelToken(MongoDomainEvent.name);
  let repo: MongoDomainEventRepository;
  const ev: MongoDomainEvent = {
    createdAt: now,
    updatedAt: now,
    eventId: mockUuid1,
    eventName: "Mock.EventName",
    eventType: "MockEventName",
    eventVersion: "v1",
    details: { test: "value" },
    aggregateType: "Mock",
    aggregateId: mockUuid1,
    timestamp: now,
  };
  const mockDoc = Object.assign(new MongoDomainEvent(), ev);
  let id: string = null;

  afterAll(async () => {
    await closeMongoConnection();
  });

  beforeEach(async () => {
    module = await mockSalesModule();

    model = await module.resolve<Model<MongoDomainEventDocument>>(modelToken);

    // Set up Repo

    repo = await module.resolve<MongoDomainEventRepository>(
      MongoDomainEventRepository
    );
    let doc: MongoDomainEvent = Object.assign(new MongoDomainEvent(), mockDoc);
    doc = await repo.create(doc);
  });

  it("should be defined", () => {
    expect(repo).toBeDefined();
  });
  describe("create", () => {
    it("should correctly create a MongoDomainEvent, generating an id", async () => {
      // GIVEN
      let doc: MongoDomainEvent = Object.assign(
        new MongoDomainEvent(),
        mockDoc
      );
      // WHEN
      let result = await repo.create(doc);
      const expected = {
        __v: 0,
        _id: result._id,
        eventId: mockUuid1,
        eventName: "Mock.EventName",
        eventType: "MockEventName",
        eventVersion: "v1",
        details: { test: "value" },
        aggregateType: "Mock",
        aggregateId: mockUuid1,
        timestamp: now,
        createdAt: now,
        updatedAt: now,
      };
      // THEN
      expect(result).toEqual(expected);
    });
  });
  describe("findByAggregateId", () => {
    describe("given MongoDomainEvents with valid AggregateID", () => {
      it("should find docs by ID", async () => {
        // GIVEN

        // WHEN
        let result = await repo.findByAggregateId(mockUuid1);
        const expected = [
          {
            __v: 0,
            _id: result[0]._id,
            eventId: mockUuid1,
            eventName: "Mock.EventName",
            eventType: "MockEventName",
            eventVersion: "v1",
            details: { test: "value" },
            aggregateType: "Mock",
            aggregateId: mockUuid1,
            timestamp: now,
            createdAt: now,
            updatedAt: now,
          },
        ];
        // THEN
        expect(result).toEqual(expected);
      });
    });
  });
});
