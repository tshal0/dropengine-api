import { CatalogModule } from "@catalog/catalog.module";
import { MyEasySuiteController } from "@myeasysuite/api/MyEasySuiteController";
import { HandleOrderPlaced } from "@myeasysuite/useCases/HandleOrderPlaced";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { MyEasySuiteClient } from "..";
jest.mock("@shared/utils", () => {
  return {
    loadAccessToken: jest.fn().mockResolvedValue("MOCK_ACCESS_TOKEN"),
  };
});
export const mockMyEasySuiteModule = async (): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      EventEmitterModule.forRoot(),
      HttpModule,
      ConfigModule.forRoot(),
      CacheModule.register(),
    ],
    controllers: [MyEasySuiteController],
    providers: [MyEasySuiteClient, HandleOrderPlaced],
  }).compile();
};
