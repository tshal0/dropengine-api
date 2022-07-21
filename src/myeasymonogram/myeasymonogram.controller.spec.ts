import { Test, TestingModule } from '@nestjs/testing';
import { MyEasyMonogramController } from './myeasymonogram.controller';

describe('MemController', () => {
  let controller: MyEasyMonogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyEasyMonogramController],
    }).compile();

    controller = module.get<MyEasyMonogramController>(MyEasyMonogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
