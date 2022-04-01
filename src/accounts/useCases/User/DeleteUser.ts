import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import {
  Injectable,
  Scope,
  CACHE_MANAGER,
  Inject,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Auth0MgmtApiClient } from "@auth0/auth0-mgmt-api.service";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteUserUseCase implements UseCase<string, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly auth0: Auth0MgmtApiClient,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}
  get llog() {
    return `[${moment()}][${DeleteUserUseCase.name}]`;
  }

  async execute(id: string): Promise<Result<any>> {
    this.logger.log(`${this.llog} Loading user...`);
    try {
      // DeleteUser in Auth0
      let resp = await this.auth0.deleteUser(id);
      return Result.ok(resp);
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
