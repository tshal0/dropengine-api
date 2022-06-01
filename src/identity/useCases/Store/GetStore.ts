import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Store } from "@identity/domain/aggregates/Store";
import { StoresRepository } from "@identity/database/StoresRepository";
import { StoreId } from "@identity/domain/valueObjects/StoreId";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";

@Injectable({ scope: Scope.DEFAULT })
export class GetStoreUseCase implements UseCase<string, Store> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
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
