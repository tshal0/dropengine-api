import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { Auth0User } from "@auth0/domain/Auth0ExtendedUser";
import { Auth0MgmtApiClient } from "@auth0/auth0-mgmt-api.service";
import { User } from "@accounts/domain";

@Injectable({ scope: Scope.DEFAULT })
export class GetAllUsersUseCase implements UseCase<any, User[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${GetAllUsersUseCase.name}]`;
  }

  async execute(): Promise<Result<User[]>> {
    try {
      let resp = await this.auth0.fetchAllUsers();
      const users = resp.map((u) => User.fromAuth0User(u));
      return Result.ok(users);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
