import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import {
  DbProductType,
  DbProduct,
  DbProductVariant,
} from "@catalog/database/entities";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import {
  MongoDomainEventRepository,
  MongoSalesOrder,
  SalesOrderQueryResult,
  SalesOrderRepository,
} from "@sales/database";
import { mockSalesModule } from "@sales/mocks/sales.module.mock";
import { SalesOrderMocks } from "@sales/mocks/SalesOrderMocks.mock";
import { SalesService } from "./SalesService";
import { when } from "jest-when";
import {
  EventSchemaVersion,
  SalesOrderEvent,
  SalesOrderEventName,
  SalesOrderPlaced,
} from "@sales/domain/events";
import { SalesOrder } from "@sales/domain";
import { DomainEvent } from "@shared/domain/events/DomainEvent";
const withDefaults = () => {
  return mockSalesModule()
    .overrideProvider(getRepositoryToken(DbProductType))
    .useValue({})
    .overrideProvider(getRepositoryToken(DbProduct))
    .useValue({})
    .overrideProvider(getRepositoryToken(DbProductVariant))
    .useValue({})
    .overrideProvider(AccountsRepository)
    .useValue({})
    .overrideProvider(StoresRepository)
    .useValue({});
};
describe("SalesService", () => {
  let module: TestingModule;
  let service: SalesService;
  beforeEach(async () => {
    module = await withDefaults().compile();

    service = await module.resolve(SalesService);
  });
  it("should exist", () => {
    expect(service).toBeDefined();
  });

  it("findById should return SalesOrder", async () => {
    const loadFn = jest.fn();
    when(loadFn)
      .calledWith(SalesOrderMocks.id)
      .mockResolvedValue(SalesOrderMocks.order);
    module = await withDefaults()
      .overrideProvider(SalesOrderRepository)
      .useValue({ load: loadFn })
      .compile();

    service = await module.resolve(SalesService);
    let result = await service.findById(SalesOrderMocks.id);
    expect(result.raw()).toEqual(SalesOrderMocks.orderProps);
    result = await service.findById(SalesOrderMocks.id2);
    expect(result).toBe(undefined);
  });
  it("loadEvents should return SalesOrderEvents", async () => {
    const loadFn = jest.fn();
    when(loadFn)
      .calledWith(SalesOrderMocks.id)
      .mockResolvedValue([
        new SalesOrderPlaced(SalesOrderMocks.id, SalesOrderMocks.placedDetails),
      ]);
    module = await withDefaults()
      .overrideProvider(MongoDomainEventRepository)
      .useValue({ findByAggregateId: loadFn })
      .compile();

    service = await module.resolve(SalesService);
    let result = await service.loadEvents(SalesOrderMocks.id);
    const event: SalesOrderPlaced = {
      eventId: expect.anything(),
      eventName: SalesOrderEventName.OrderPlaced,
      eventType: SalesOrderPlaced.name,
      eventVersion: EventSchemaVersion.v1,
      details: SalesOrderMocks.placedDetails,
      aggregateType: SalesOrder.name,
      aggregateId: SalesOrderMocks.id,
      timestamp: expect.anything(),
    };
    const expected: SalesOrderEvent<any>[] = [event];
    expect(result).toEqual(expected);
  });
  it("delete should return SalesOrder", async () => {
    const deleteFn = jest.fn();
    when(deleteFn)
      .calledWith(SalesOrderMocks.id)
      .mockResolvedValue(new MongoSalesOrder(SalesOrderMocks.orderProps));
    module = await withDefaults()
      .overrideProvider(SalesOrderRepository)
      .useValue({ delete: deleteFn })
      .compile();

    service = await module.resolve(SalesService);
    let result = await service.delete(SalesOrderMocks.id);
    expect(result.raw()).toEqual(SalesOrderMocks.orderProps);
  });

  describe("query", () => {
    it("should return a paginated, filtered result set", async () => {
      const loadFn = jest.fn();
      when(loadFn)
        .calledWith(SalesOrderMocks.id)
        .mockResolvedValue(SalesOrderMocks.order);
      const set = new SalesOrderQueryResult();
      set.data = [SalesOrderMocks.order];
      set.page = 0;
      set.pages = 11;
      set.size = 1;
      set.total = 11;

      module = await withDefaults()
        .overrideProvider(SalesOrderRepository)
        .useValue({
          query: jest.fn().mockResolvedValue(set),
        })
        .compile();

      service = await module.resolve(SalesService);
      let result = await service.query({ limit: 1, skip: 0 });
      expect(result).toMatchObject({
        page: 0,
        pages: 11,
        size: 1,
        total: 11,
        data: [SalesOrderMocks.order],
      });
    });
  });
});
