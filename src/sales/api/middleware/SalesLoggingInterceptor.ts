import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  LoggerService,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { AzureTelemetryService, WinstonLogger } from "@shared/modules";
import { AuthenticatedUser } from "@shared/decorators";
import moment from "moment";
import {
  SeverityLevel,
  TraceTelemetry,
} from "applicationinsights/out/Declarations/Contracts";
import {
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from "nest-winston";
@Injectable()
export class SalesLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(SalesLoggingInterceptor.name);
  constructor() {}
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
    this.logger.debug(telemetry);
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
            properties: { response: { ...val, data: [] } },
          };
          this.logger.debug(telemetry);
          // this.logger.debug(payload.message);
        },
        error: (error) => {},
        complete: () => {},
        finalize: () => {},
      })
    );
  }
}
