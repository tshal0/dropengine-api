import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("healthCheck", () => {
    it("should return a JSON with status: UP", async () => {
      let result = await appController.getHealthCheck();
      expect(result).toEqual({ status: "UP" });
    });
  });
});
