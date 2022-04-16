import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";
import { Logger, LoggerService } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { TelemetryClient } from "applicationinsights";
import {
  RequestTelemetry,
  SeverityLevel,
  TraceTelemetry,
  ExceptionTelemetry,
  EventTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
import * as appInsights from "applicationinsights";

@Injectable({ scope: Scope.DEFAULT })
export class AzureLoggerService extends ConsoleLogger {
  private client: TelemetryClient;
  setClient(client: TelemetryClient) {
    this.client = client;
  }
  constructor(private _config: ConfigService) {
    super();
  }

  trace(telemetry: TraceTelemetry) {
    this.client.trackTrace(telemetry);
  }
  exception(telemetry: ExceptionTelemetry) {
    this.client.trackException(telemetry);
  }
  request(telemetry: RequestTelemetry) {
    this.client.trackRequest(telemetry);
  }
  event(telemetry: EventTelemetry) {
    this.client.trackEvent(telemetry);
  }
  error(message: string, stack?: string, context?: any) {
    // add your tailored logic here

    super.error.apply(this, arguments);
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log.apply(this, arguments);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn.apply(this, arguments);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    super.debug.apply(this, arguments);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose.apply(this, arguments);
  }
}
