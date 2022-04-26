import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Account } from "@accounts/domain/aggregates/Account";
import { AccountsRepository } from "@accounts/database/AccountsRepository";
import { AccountId } from "@accounts/domain/valueObjects/AccountId";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class GetAccountUseCase implements UseCase<string, Account> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private _repo: AccountsRepository,
    private auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${GetAccountUseCase.name}]`;
  }

  async execute(val: string): Promise<Result<Account>> {
    try {
      let idResult = AccountId.from(val);
      if (idResult.isFailure) {
        return Result.fail(
          new ResultError(new Error(`ID is not a valid AccountId.`))
        );
      }
      let id = idResult.value();
      let result = await this._repo.load(id);
      if (result.isFailure) {
        return result;
      }
      let account = result.value();

      return Result.ok(account);
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { id: val }));
    }
  }
}
