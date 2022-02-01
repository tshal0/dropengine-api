import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ShopifyApiClient } from "../ShopifyApiClient";
import { AcceptShopifyInstallUseCase } from "../useCases/AcceptShopifyInstallUseCase";
import { ConnectShopifyAccountUseCase } from "../useCases/ConnectShopifyAccount";
import { DeleteShopifyAccountUseCase } from "../useCases/DeleteShopifyAccount";
import { GetAllAccountsUseCase } from "../useCases/GetAllAccounts";
import { GetShopifyAccountUseCase } from "../useCases/GetShopifyAccount";
import { ShopifyApiController } from "./shopify.api.controller";

describe("ShopifyController", () => {
  let controller: ShopifyApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyApiController],
      providers: [
        { provide: AzureLoggerService, useValue: {} },
        { provide: ShopifyApiClient, useValue: {} },
        { provide: ConnectShopifyAccountUseCase, useValue: {} },
        { provide: GetShopifyAccountUseCase, useValue: {} },
        { provide: AcceptShopifyInstallUseCase, useValue: {} },
        { provide: GetAllAccountsUseCase, useValue: {} },
        { provide: DeleteShopifyAccountUseCase, useValue: {} },
      ],
      imports: [PassportModule.register({ defaultStrategy: "jwt" })],
    }).compile();

    controller = module.get<ShopifyApiController>(ShopifyApiController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
