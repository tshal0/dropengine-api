import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  Scope,
} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { TelemetryClient } from "applicationinsights";
import {
  RequestTelemetry,
  TraceTelemetry,
  ExceptionTelemetry,
  EventTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable({ scope: Scope.DEFAULT })
export class AzureTelemetryService extends ConsoleLogger {
  private client: TelemetryClient;
  setClient(client: TelemetryClient) {
    this.client = client;
  }
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
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
}
