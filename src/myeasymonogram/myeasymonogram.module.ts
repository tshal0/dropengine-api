import { Module } from "@nestjs/common";
import { MyEasyMonogramService } from "./myeasymonogram.service";
import { MyEasyMonogramController } from "./myeasymonogram.controller";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

@Module({
  providers: [MyEasyMonogramService],
  controllers: [MyEasyMonogramController],
  imports: [ConfigService, PassportModule.register({ defaultStrategy: "jwt" })],
})
export class MyEasyMonogramModule {}
