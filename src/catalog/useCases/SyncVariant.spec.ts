import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { SyncVariant } from "./SyncVariant";

describe("SyncVariant", () => {
  let module: TestingModule;
  let service: SyncVariant;

  beforeAll(() => {});

  afterAll(async () => {});

  beforeEach(async () => {
    module = await mockCatalogModule();

    service = await module.resolve<SyncVariant>(SyncVariant);
  });

  it("should exist", () => {
    expect(service).toBeDefined();
  });
});
