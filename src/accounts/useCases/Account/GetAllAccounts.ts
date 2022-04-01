import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { Account } from "@accounts/domain/aggregates/Account";
import { AccountsRepository } from "@accounts/database/AccountsRepository";
import { Auth0MgmtApiClient } from "@auth0/auth0-mgmt-api.service";

@Injectable({ scope: Scope.DEFAULT })
export class GetAccountsUseCase implements UseCase<any, Account[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private auth0: Auth0MgmtApiClient,
    private _repo: AccountsRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetAccountsUseCase.name}]`;
  }

  async execute(): Promise<Result<Account[]>> {
    try {
      return await this._repo.findAll({});
    } catch (error) {
      return Result.fail(error);
    }
  }
}
