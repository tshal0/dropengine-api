import { Test, TestingModule } from '@nestjs/testing';
import { MyEasyMonogramService } from './myeasymonogram.service';

describe('MemService', () => {
  let service: MyEasyMonogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyEasyMonogramService],
    }).compile();

    service = module.get<MyEasyMonogramService>(MyEasyMonogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
