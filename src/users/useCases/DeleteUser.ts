import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { DbUsersRepository } from "../database/DbUsersRepository";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import {
  Injectable,
  Scope,
  CacheModule,
  CACHE_MANAGER,
  Inject,
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { requestObject } from "@shared/utils/requestObject";
import { lastValueFrom } from "rxjs";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteUserUseCase implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: DbUsersRepository,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}
  get llog() {
    return `[${moment()}][${DeleteUserUseCase.name}]`;
  }

  async execute(id: UUID): Promise<Result<any>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      let result = await this._repo.load(id);
      let user = result.value();
      // DeleteUser in Auth0
      let TOKEN = await this.cache.get("AUTH0_MGMT_ACCESS_TOKEN");

      const AUTH0_M2M_CLIENT_ID = this.config.get("AUTH0_M2M_CLIENT_ID");
      const AUTH0_M2M_CLIENT_SECRET = this.config.get(
        "AUTH0_M2M_CLIENT_SECRET"
      );
      const AUTH0_DOMAIN = this.config.get(`AUTH0_DOMAIN`);
      const AUTH0_MGMT_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`;
      const AUTH0_MGMT_GRANT_TYPE = `client_credentials`;

      if (!TOKEN) {
        const options = {
          method: "POST",
          url: `https://${AUTH0_DOMAIN}/oauth/token`,
          headers: { "content-type": "application/json" },
          body: {
            client_id: AUTH0_M2M_CLIENT_ID,
            client_secret: AUTH0_M2M_CLIENT_SECRET,
            audience: AUTH0_MGMT_AUDIENCE,
            grant_type: AUTH0_MGMT_GRANT_TYPE,
          },
          json: true,
        };

        const resp = await requestObject(options);
        TOKEN = resp?.object?.access_token;
        this.cache.set("AUTH0_MGMT_ACCESS_TOKEN", TOKEN, { ttl: 86400 });
      }
      if (user.props().externalUserId) {
        try {
          const url = `https://${AUTH0_DOMAIN}/api/v2/users/${
            user.props().externalUserId
          }`;
          const options = {
            headers: { Authorization: `Bearer ${TOKEN}` },
          };
          const resp$ = await this.http.delete<any>(url, options);
          await lastValueFrom(resp$);
        } catch (error) {
          throw error;
        }
      }

      let deleteResult = await this._repo.delete(user);
      if (deleteResult.isSuccess) {
        return Result.ok({ message: `User has been deleted.` });
      } else {
        return Result.fail(
          new ResultError(new Error(`User was not deleted.`), [], {
            id: id.value(),
          })
        );
      }
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }
      this.logger.error(`${this.llog} Failed to DeleteUser`, error);
      return Result.fail(error);
    }
  }
}
