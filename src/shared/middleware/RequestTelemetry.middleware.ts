import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request } from "express";
import { AzureTelemetryService } from "@shared/modules";
import { IAuth0User } from "@auth0/domain/Auth0ExtendedUser";
import { AuthenticatedUser } from "@shared/decorators";
import moment from "moment";
import { IUserAccount } from "@identity/domain";
@Injectable()
export class RequestTelemetryInterceptor implements NestInterceptor {
  constructor(private logger: AzureTelemetryService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.getArgByIndex(0);
    const val: any = context.getArgByIndex(0).user;
    const user = AuthenticatedUser.load(val);
    const begin = moment().toDate();
    
    // const begin = this.generateBeginTrace(now, user, request);
    // this.logger.debug(begin.message);
    return next.handle().pipe(
      tap(() => {
        const end = moment().toDate();
        const duration = end.getTime() - begin.getTime();
      })
    );
  }
}
