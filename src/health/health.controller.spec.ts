import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

describe("AppController", () => {
  let appController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    appController = app.get<HealthController>(HealthController);
  });

  describe("healthCheck", () => {
    it("should return a JSON with status: UP", async () => {
      let result = await appController.getHealthCheck();
      expect(result).toEqual({ status: "DropEngine™ API Up!" });
    });
  });
});
