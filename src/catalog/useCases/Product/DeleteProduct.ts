import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
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
import { ProductsRepository } from "@catalog/database/ProductsRepository";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteProduct implements UseCase<UUID, any> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: ProductsRepository,
    @Inject(CACHE_MANAGER) private cache: Cache
  ) {}
  get llog() {
    return `[${moment()}][${DeleteProduct.name}]`;
  }

  async execute(id: UUID): Promise<Result<any>> {
    this.logger.log(`${this.llog} Delete Product ${id.value()}`);
    try {
      let res = await this._repo.delete(id);
      if (res.isFailure) return Result.fail(res.error);
      return Result.ok();
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }

      this.logger.error(`${this.llog} Failed to DeleteProduct`, error);
      return Result.fail(error);
    }
  }
}
