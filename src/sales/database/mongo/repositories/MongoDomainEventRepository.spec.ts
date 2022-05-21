import { mockSalesModule } from "@sales/mocks/sales.module.mock";
import { AccountsRepository } from "@auth/database/AccountsRepository";
import { StoresRepository } from "@auth/database/StoresRepository";
import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import { closeMongoConnection } from "@jestconfig/mongodb-memory-server";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { TestingModule } from "@nestjs/testing";

import { MongoDomainEventRepository } from "./MongoDomainEventRepository";
import { MongoMocks } from "../../../mocks/MongoMocks";

// spyOnDate();
describe("MongoDomainEventRepository", () => {
  let module: TestingModule;
  let service: MongoDomainEventRepository;

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
    service = await module.resolve(MongoDomainEventRepository);
  });
  afterAll(async () => {
    await closeMongoConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("findByAggregateId should return all events from that entity", async () => {
    let result = await service.findByAggregateId(MongoMocks.mockMongoId);
    expect(result).toEqual([]);
  });
});
