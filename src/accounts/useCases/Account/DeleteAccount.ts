import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Injectable, Scope, CACHE_MANAGER, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Auth0MgmtApiClient } from "@auth0/Auth0MgmtApiClient";
import { AccountId } from "@accounts/domain/valueObjects/AccountId";
import { AccountsRepository } from "@accounts/database/AccountsRepository";
import { User } from "@accounts/domain";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteAccountUseCase implements UseCase<AccountId, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly auth0: Auth0MgmtApiClient,
    private _repo: AccountsRepository,

    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}
  get llog() {
    return `[${moment()}][${DeleteAccountUseCase.name}]`;
  }

  async execute(id: AccountId): Promise<Result<any>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let result = await this._repo.loadById(id);
      if (result.isFailure) {
        return Result.fail(result.error, id.value());
      }
      let account = result.value();

      const ownerId = account.props().ownerId;
      let resp = await this.auth0.getUser(ownerId);
      let owner = User.fromAuth0User(resp);
      owner.removeAccount(account);
      let auth0Owner = owner.toAuth0();
      resp = await this.auth0.patchUserAppMetadata(
        auth0Owner.user_id,
        auth0Owner.app_metadata
      );
      await this._repo.delete(id);
      return Result.ok();
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }
      this.logger.error(`${this.llog} Failed to DeleteAccount`, error);
      return Result.fail(error);
    }
  }
}
