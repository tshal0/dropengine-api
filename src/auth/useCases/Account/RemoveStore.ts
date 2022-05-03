import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Account } from "@auth/domain/aggregates/Account";
import { AccountsRepository } from "@auth/database/AccountsRepository";
import { User } from "@auth/domain";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { CreateStoreDto } from "@auth/dto/CreateStoreDto";
import { AccountId } from "@auth/domain/valueObjects/AccountId";
import { Store } from "@auth/domain/aggregates/Store";
import { StoresRepository } from "@auth/database/StoresRepository";
import { RemoveStoreDto } from "@auth/dto/RemoveStoreDto";
import { StoreId } from "@auth/domain/valueObjects/StoreId";

@Injectable({ scope: Scope.DEFAULT })
export class RemoveStoreUseCase implements UseCase<RemoveStoreDto, Account> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private auth0: Auth0MgmtApiClient,
    private _storesRepo: StoresRepository,
    private _repo: AccountsRepository
  ) {}
  get llog() {
    return `[${moment()}][${RemoveStoreUseCase.name}]`;
  }

  async execute(dto: RemoveStoreDto): Promise<Result<Account>> {
    // Load Account, CreateStore, Save
    try {
      let accountResult = await this.loadAccount(dto.accountId);
      if (accountResult.isFailure) {
        return Result.fail(accountResult.error, dto.accountId);
      }
      let account = accountResult.value();
      let storeResult = await this.loadStore(dto.storeId);
      if (storeResult.isFailure) {
        return Result.fail(storeResult.error, dto.storeId);
      }
      let store = storeResult.value();

      accountResult = account.removeStore(store);
      if (accountResult.isFailure) {
        return Result.fail(accountResult.error, dto.accountId);
      }

      accountResult = await this._repo.save(account);
      if (accountResult.isFailure) {
        return Result.fail(accountResult.error, dto.accountId);
      }
      return Result.ok(accountResult.value());
    } catch (error) {
      return Result.fail(new ResultError(error, [error], {}));
    }
  }

  private async loadAccount(id: string): Promise<Result<Account>> {
    let idResult = AccountId.from(id);
    if (idResult.isFailure) {
      return Result.fail(idResult.error, id);
    }
    let result = await this._repo.loadById(idResult.value());
    if (result.isFailure) {
      return Result.fail(result.error, id);
    }
    return result;
  }

  private async loadStore(id: string): Promise<Result<Store>> {
    let idResult = StoreId.from(id);
    if (idResult.isFailure) {
      return Result.fail(idResult.error, id);
    }
    let result = await this._storesRepo.loadById(idResult.value());
    if (result.isFailure) {
      return Result.fail(result.error, id);
    }
    return result;
  }
}
