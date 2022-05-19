import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { VariantService } from "./VariantService";

describe("VariantService", () => {
  let module: TestingModule;
  let service: VariantService;
  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(VariantService);
  });
  describe("findAndUpdateOrCreate", () => {
    it("should exist", () => {
      expect(service.findAndUpdateOrCreate).toBeDefined();
    });
  });
  describe("query", () => {});
  describe("findById", () => {});
  describe("findBySku", () => {});
  describe("delete", () => {});
  describe("import", () => {});
});
