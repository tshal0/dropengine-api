import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { AzureTelemetryService } from "@shared/modules";
import { AuthenticatedUser } from "@shared/decorators";
import moment from "moment";
import {
  SeverityLevel,
  TraceTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
@Injectable()
export class SalesLoggingInterceptor implements NestInterceptor {
  constructor(private readonly telemetry: AzureTelemetryService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const val: any = req["user"];

    const user = AuthenticatedUser.load(val);
    const begin = moment().toDate();

    const payload = {
      timestamp: begin,
      email: user.email,
      userId: user.id,
      message:
        `[BEGIN]` +
        `[${user.id}]` +
        `[${user.email}]` +
        `[${req.method} ${req.url}] ${begin.toISOString()}`,
      properties: {
        action: "BEGIN",
        method: req.method,
        url: req.url,
        body: req.body,
      },
    };
    const telemetry: TraceTelemetry = {
      message: payload.message,
      severity: SeverityLevel.Information,
      time: begin,
      contextObjects: { user },
      properties: { request: req.body },
    };
    this.telemetry.trace(telemetry);
    // this.logger.debug(payload.message);
    return next.handle().pipe(
      tap({
        next: (val) => {
          const end = moment().toDate();
          const duration = end.getTime() - begin.getTime();
          const payload = {
            timestamp: end,
            duration: duration,
            email: user.email,
            userId: user.id,
            message:
              `[END]` +
              `[${user.id}]` +
              `[${user.email}]` +
              `[${req.method} ${req.url}] ${end.toISOString()} +${duration}ms`,
            properties: {
              action: "END",
              method: req.method,
              url: req.url,
              body: req.body,
            },
          };
          const telemetry: TraceTelemetry = {
            message: payload.message,
            severity: SeverityLevel.Information,
            time: end,
            contextObjects: { user },
            properties: { response: val },
          };
          this.telemetry.trace(telemetry);
          // this.logger.debug(payload.message);
        },
        error: (error) => {},
        complete: () => {},
        finalize: () => {},
      })
    );
  }
}
