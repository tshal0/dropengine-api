import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Account } from "@identity/domain/aggregates/Account";
import { AccountsRepository } from "@identity/database/AccountsRepository";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class GetAccountsUseCase implements UseCase<any, Account[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
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
