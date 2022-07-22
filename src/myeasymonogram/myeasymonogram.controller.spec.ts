import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { MyEasyMonogramController } from "./myeasymonogram.controller";
import { MyEasyMonogramService } from "./myeasymonogram.service";

describe("MemController", () => {
  let controller: MyEasyMonogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyEasyMonogramController],
      providers: [MyEasyMonogramService],
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: "jwt" }),
      ],
    }).compile();

    controller = module.get<MyEasyMonogramController>(MyEasyMonogramController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
