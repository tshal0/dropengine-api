import { Test, TestingModule } from '@nestjs/testing';
import { AzureLoggerService } from '@shared/modules/azure-logger/azure-logger.service';
import { ShopifyApiClient } from '../ShopifyApiClient';
import { AcceptShopifyInstallUseCase } from '../useCases/AcceptShopifyInstallUseCase';
import { ConnectShopifyAccountUseCase } from '../useCases/ConnectShopifyAccount';
import { DeleteShopifyAccountUseCase } from '../useCases/DeleteShopifyAccount';
import { GetAllAccountsUseCase } from '../useCases/GetAllAccounts';
import { GetShopifyAccountUseCase } from '../useCases/GetShopifyAccount';
import { ShopifyController } from './shopify.api.controller';

describe('ShopifyController', () => {
  let controller: ShopifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyController],
      providers: [
        { provide: AzureLoggerService, useValue: {} },
        { provide: ShopifyApiClient, useValue: {} },
        { provide: ConnectShopifyAccountUseCase, useValue: {} },
        { provide: GetShopifyAccountUseCase, useValue: {} },
        { provide: AcceptShopifyInstallUseCase, useValue: {} },
        { provide: GetAllAccountsUseCase, useValue: {} },
        { provide: DeleteShopifyAccountUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<ShopifyController>(ShopifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
