import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Account } from "@identity/domain/aggregates/Account";
import { AccountsRepository } from "@identity/database/AccountsRepository";
import { User } from "@identity/domain";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { CreateStoreDto } from "@identity/dto/CreateStoreDto";
import { AccountId } from "@identity/domain/valueObjects/AccountId";
import { Store } from "@identity/domain/aggregates/Store";
import { StoresRepository } from "@identity/database/StoresRepository";

@Injectable({ scope: Scope.DEFAULT })
export class AddStoreUseCase implements UseCase<CreateStoreDto, Account> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private auth0: Auth0MgmtApiClient,
    private _repo: StoresRepository,
    private _accountRepo: AccountsRepository
  ) {}
  get llog() {
    return `[${moment()}][${AddStoreUseCase.name}]`;
  }

  async execute(dto: CreateStoreDto): Promise<Result<Account>> {
    // Load Account, CreateStore, Save
    try {
      let idResult = AccountId.from(dto.accountId);
      if (idResult.isFailure) {
        return Result.fail(idResult.error, dto.accountId);
      }
      let id = idResult.value();
      let result = await this._accountRepo.loadById(id);
      if (result.isFailure) {
        return Result.fail(result.error, dto.accountId);
      }
      let account = result.value();

      let storeResult = account.addStore(dto);
      if (storeResult.isFailure) {
        return Result.fail(storeResult.error, dto.accountId);
      }

      result = await this._accountRepo.save(account);
      if (result.isFailure) {
        return Result.fail(result.error, dto.storeName);
      }
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], {}));
    }
  }
}
