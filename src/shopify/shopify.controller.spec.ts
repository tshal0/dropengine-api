import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ShopifyController } from "./shopify.controller";
import { ShopifyApiClient } from "./ShopifyApiClient";
import { AcceptShopifyInstallUseCase } from "./useCases/AcceptShopifyInstallUseCase";
import { ConnectShopifyAccountUseCase } from "./useCases/ConnectShopifyAccount";
import { DeleteShopifyAccountUseCase } from "./useCases/DeleteShopifyAccount";
import { GetAllAccountsUseCase } from "./useCases/GetAllAccounts";
import { GetShopifyAccountUseCase } from "./useCases/GetShopifyAccount";

describe("ShopifyController", () => {
  let controller: ShopifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyController],
      providers: [
        { provide: ConfigService, useValue: {} },
        { provide: AzureTelemetryService, useValue: {} },
        { provide: ShopifyApiClient, useValue: {} },
        { provide: ConnectShopifyAccountUseCase, useValue: {} },
        { provide: GetShopifyAccountUseCase, useValue: {} },
        { provide: AcceptShopifyInstallUseCase, useValue: {} },
        { provide: GetAllAccountsUseCase, useValue: {} },
        { provide: DeleteShopifyAccountUseCase, useValue: {} },
      ],
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
    }).compile();

    controller = module.get<ShopifyController>(ShopifyController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
