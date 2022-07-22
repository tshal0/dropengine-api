import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { MyEasyMonogramController } from "./myeasymonogram.controller";
import { MyEasyMonogramService } from "./myeasymonogram.service";

describe("MemService", () => {
  let service: MyEasyMonogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyEasyMonogramController],
      providers: [MyEasyMonogramService],
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: "jwt" }),
      ],
    }).compile();

    service = module.get<MyEasyMonogramService>(MyEasyMonogramService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
