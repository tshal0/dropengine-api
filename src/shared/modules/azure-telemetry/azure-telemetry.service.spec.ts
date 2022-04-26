import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AzureTelemetryService } from "./azure-telemetry.service";
jest.mock("./azure-telemetry.helper");
describe("AzureTelemetryService", () => {
  let service: AzureTelemetryService;
  let config: ConfigService;

  beforeEach(async () => {
    const config_mock = {
      get: jest.fn((key: string) => {
        return key.toUpperCase();
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureTelemetryService,
        { provide: ConfigService, useValue: config_mock },
      ],
    }).compile();

    config = module.get<ConfigService>(ConfigService);
    service = await module.resolve<AzureTelemetryService>(
      AzureTelemetryService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
