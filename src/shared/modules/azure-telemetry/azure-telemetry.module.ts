import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Constants } from "@shared/Constants";
import { initAppInsights } from "./azure-telemetry.helper";
import { AzureTelemetryService } from "./azure-telemetry.service";

@Module({
  providers: [AzureTelemetryService],
  exports: [AzureTelemetryService],
})
export class AzureTelemetryModule {
  constructor() {}
  public onModuleInit(): any {}
}
