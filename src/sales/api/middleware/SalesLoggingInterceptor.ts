import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";
import { AuthenticatedUser } from "@shared/decorators";
import moment from "moment";
import {
  SeverityLevel,
  TraceTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
@Injectable()
export class SalesLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(SalesLoggingInterceptor.name);
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    const val: any = req["user"];

    const user = AuthenticatedUser.load(val);
    const begin = moment().toDate();

    const payload = {
      timestamp: begin,
      email: user.email,
      userId: user.id,
      message: `BEGIN ORDERS REQUEST`,
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
    this.logger.debug(telemetry.message);
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
            message: `END ORDERS REQUEST`,

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
            properties: { response: { data: [] } },
          };
          this.logger.debug(telemetry.message);
        },
        error: (error) => {
          this.logger.error(
            `${error?.message || error}`,
            error?.stack,
            error?.context
          );
        },
        complete: () => {},
        finalize: () => {},
      })
    );
  }
}
