import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AzureStorageService } from './azure-storage.service';

describe('AzureStorageService', () => {
  let service: AzureStorageService;
  let config: ConfigService;

  beforeEach(async () => {
    const config_mock = {
      get: jest.fn((key: string) => {
        return key.toUpperCase();
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureStorageService, { provide: ConfigService, useValue: config_mock },],
    }).compile();
    config = module.get<ConfigService>(ConfigService);

    service = module.get<AzureStorageService>(AzureStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
