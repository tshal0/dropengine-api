import { Module } from "@nestjs/common";
import { MemService } from "./mem.service";
import { MemController } from "./mem.controller";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

@Module({
  providers: [MemService],
  controllers: [MemController],
  imports: [ConfigService, PassportModule.register({ defaultStrategy: "jwt" })],
})
export class MemModule {}
