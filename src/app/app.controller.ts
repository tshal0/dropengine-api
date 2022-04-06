import {
  Controller,
  Get,
  HttpCode,
  Version,
  VersioningType,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller({ path: "/", version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  async getHealthCheck(): Promise<any> {
    return { status: "DropEngine™ API Up!" };
  }
}
