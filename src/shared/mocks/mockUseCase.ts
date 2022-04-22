import { TestingModule, Test } from "@nestjs/testing";

export const mockCreateModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    controllers: [],
    exports: [],
    imports: [],
    providers: [],
  }).compile();
};
