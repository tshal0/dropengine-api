import {
  Controller,
  Get,
  HttpCode,
  Version,
  VersioningType,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller({ path: "/", version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private readonly health: HealthService) {}
  @Get()
  @HttpCode(200)
  async getHealthCheck(): Promise<any> {
    return await this.health.check();
  }
  @Get("/health")
  @HttpCode(200)
  async getHealthCheck2(): Promise<any> {
    return await this.health.check();
  }
}
