import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { VariantsRepository } from "./VariantsRepository";

describe("VariantsRepository", () => {
  let module: TestingModule;
  let service: VariantsRepository;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
  });
  it("should exist", async () => {
    service = await module.resolve(VariantsRepository);
    expect(service).toBeDefined();
  });
});
