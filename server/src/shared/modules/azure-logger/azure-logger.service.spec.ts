import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AzureLoggerService } from './azure-logger.service';
jest.mock('./azure-logger.helper');
describe('AzureLoggerService', () => {
  let service: AzureLoggerService;
  let config: ConfigService;

  beforeEach(async () => {
    const config_mock = {
      get: jest.fn((key: string) => {
        return key.toUpperCase();
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureLoggerService,
        { provide: ConfigService, useValue: config_mock },
      ],
    }).compile();

    config = module.get<ConfigService>(ConfigService);
    service = await module.resolve<AzureLoggerService>(AzureLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
