import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Constants } from "@shared/Constants";
import { initAppInsights } from "./azure-logger.helper";
import { AzureLoggerService } from "./azure-logger.service";

@Module({
  providers: [AzureLoggerService],
  exports: [AzureLoggerService],
})
export class AzureLoggerModule {
  constructor(
    private _config: ConfigService,
    private _logger: AzureLoggerService
  ) {}
  public onModuleInit(): any {}
}
