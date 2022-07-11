import { Test, TestingModule } from '@nestjs/testing';
import { MemController } from './mem.controller';

describe('MemController', () => {
  let controller: MemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemController],
    }).compile();

    controller = module.get<MemController>(MemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
