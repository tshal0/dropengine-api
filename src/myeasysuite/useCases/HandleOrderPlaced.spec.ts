import { mockMyEasySuiteModule } from "@myeasysuite/mocks/myEasySuite.module.mock";
import { MyEasySuiteClient } from "@myeasysuite/myeasysuite.client";
import { TestingModule } from "@nestjs/testing";
import { HandleOrderPlaced } from "./HandleOrderPlaced";

describe("HandleOrderPlaced", () => {
  let module: TestingModule;
  let service: HandleOrderPlaced;

  beforeAll(() => {});

  afterAll(async () => {});

  beforeEach(async () => {
    module = await mockMyEasySuiteModule();

    service = await module.resolve<HandleOrderPlaced>(HandleOrderPlaced);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  it("should emit correct order when triggered", async () => {
    let client = await module.resolve<MyEasySuiteClient>(MyEasySuiteClient);
    client.getOrderById = jest.fn().mockResolvedValue({})
  });
});
