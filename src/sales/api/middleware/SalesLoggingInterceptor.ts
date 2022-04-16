import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";
import { AzureLoggerService } from "@shared/modules";
import { IAuth0User } from "@auth0/domain/Auth0ExtendedUser";
import { AuthenticatedUser } from "@shared/decorators";
import moment from "moment";
import { IUserAccount } from "@accounts/domain";
@Injectable()
export class SalesLoggingInterceptor implements NestInterceptor {
  constructor(private logger: AzureLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.getArgByIndex(0);
    const val: any = context.getArgByIndex(0).user;
    const user = AuthenticatedUser.load(val);
    const now = moment().toDate();

    const begin = this.generateBeginTrace(now, user, request);
    this.logger.debug(begin.message);
    return next.handle().pipe(
      tap(() => {
        const now = moment().toDate();
        const duration = now.getTime() - begin.timestamp.getTime();
        const end = this.generateEndTrace(now, duration, user, request);
        this.logger.debug(end.message);
      })
    );
  }

  private generateEndTrace(
    now: Date,
    duration: number,
    user: AuthenticatedUser,
    request
  ) {
    return {
      timestamp: now,
      duration: duration,
      email: user.email,
      userId: user.id,
      message:
        `[END]` +
        `[${user.id}]` +
        `[${user.email}]` +
        `[${request.method} ${
          request.url
        }] ${now.toISOString()} +${duration}ms`,
      properties: {
        action: "END",
        method: request.method,
        url: request.url,
        body: request.body,
      },
    };
  }

  private generateBeginTrace(now: Date, user: AuthenticatedUser, request) {
    return {
      timestamp: now,
      email: user.email,
      userId: user.id,
      message:
        `[BEGIN]` +
        `[${user.id}]` +
        `[${user.email}]` +
        `[${request.method} ${request.url}] ${now.toISOString()}`,
      properties: {
        action: "BEGIN",
        method: request.method,
        url: request.url,
        body: request.body,
      },
    };
  }
}
