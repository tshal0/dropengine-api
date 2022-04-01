import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { Store } from "@accounts/domain/aggregates/Store";
import { StoresRepository } from "@accounts/database/StoresRepository";
import { StoreId } from "@accounts/domain/valueObjects/StoreId";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class GetStoreUseCase implements UseCase<string, Store> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: StoresRepository,
    private auth0: Auth0MgmtApiClient
  ) {}
  get llog() {
    return `[${moment()}][${GetStoreUseCase.name}]`;
  }

  async execute(val: string): Promise<Result<Store>> {
    try {
      let idResult = StoreId.from(val);
      if (idResult.isFailure) {
        return Result.fail(
          new ResultError(new Error(`ID is not a valid StoreId.`))
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
