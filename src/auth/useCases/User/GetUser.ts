import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Auth0User } from "@auth0/domain/Auth0ExtendedUser";
import { User } from "@auth/domain";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class GetUserUseCase implements UseCase<string, User> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private readonly auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${GetUserUseCase.name}]`;
  }

  async execute(id: string): Promise<Result<User>> {
    try {
      let user = await this.auth0.getUser(id);
      return Result.ok(User.fromAuth0User(user));
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { id }));
    }
  }
}
