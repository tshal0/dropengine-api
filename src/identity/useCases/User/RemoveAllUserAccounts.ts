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
import { AccountId } from "@identity/domain/valueObjects/AccountId";
import { AccountsRepository } from "@identity/database/AccountsRepository";
import { User } from "@identity/domain";

@Injectable({ scope: Scope.DEFAULT })
export class RemoveAllUserAccountsUseCase implements UseCase<string, any> {
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
    return `[${moment()}][${RemoveAllUserAccountsUseCase.name}]`;
  }

  async execute(id: string): Promise<Result<any>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let resp = await this.auth0.getUser(id);
      let owner = User.fromAuth0User(resp);
      let accountIds = owner.props().metadata?.accounts?.map((a) => a.id) || [];
      owner.removeAllAccounts();
      let auth0Owner = owner.toAuth0();
      resp = await this.auth0.patchUserAppMetadata(
        auth0Owner.user_id,
        auth0Owner.app_metadata
      );
      let deleteAcctTasks = accountIds.map(async (id) => {
        try {
          return await this._repo.delete(AccountId.from(id).value());
        } catch (error) {
          this.logger.debug({ error });
        }
      });
      await Promise.all(deleteAcctTasks);
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
