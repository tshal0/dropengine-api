import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { ProductsRepository } from "./ProductsRepository";

describe("ProductsRepository", () => {
  let module: TestingModule;
  let service: ProductsRepository;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
  });
  it("should exist", async () => {
    service = await module.resolve(ProductsRepository);
    expect(service).toBeDefined();
  });
});
