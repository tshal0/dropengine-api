import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
