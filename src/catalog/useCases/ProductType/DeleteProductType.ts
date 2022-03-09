import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
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
  CACHE_MANAGER,
  Inject,
  NotImplementedException,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { ProductTypesRepository } from "@catalog/database/ProductTypesRepository";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteProductType implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: ProductTypesRepository,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}
  get llog() {
    return `[${moment()}][${DeleteProductType.name}]`;
  }

  async execute(id: UUID): Promise<Result<any>> {
    this.logger.log(`${this.llog} Delete ProductType ${id.value()}`);
    try {
      let res = await this._repo.delete(id);
      if (res.isFailure) return Result.fail(res.error);
      return Result.ok();
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }

      this.logger.error(`${this.llog} Failed to DeleteProductType`, error);
      return Result.fail(error);
    }
  }
}
