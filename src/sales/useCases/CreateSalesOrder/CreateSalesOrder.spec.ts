import { TestingModule } from "@nestjs/testing";
import { mockSalesModule } from "./mockCreateSalesOrder";
import { CreateSalesOrder } from "..";

describe("CreateSalesOrder", () => {
  let service: CreateSalesOrder;
  let module: TestingModule;
  beforeEach(async () => {
    module = await mockSalesModule();

    service = await module.resolve<CreateSalesOrder>(CreateSalesOrder);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("given valid CreateSalesOrderApiDto", () => {
    it("should generate and create a valid SalesOrder", () => {});
  });
});
