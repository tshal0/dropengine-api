import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ProductTypesRepository } from "catalog/database/ProductTypesRepository";
import { IProductType } from "catalog/domain/interfaces/IProductType";
import { ProductType } from "catalog/domain/aggregates/ProductType";

@Injectable({ scope: Scope.DEFAULT })
export class GetProductType implements UseCase<UUID, ProductType> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetProductType.name}]`;
  }

  async execute(id: UUID): Promise<Result<ProductType>> {
    this.logger.log(`${this.llog} Loading productType...`);
    try {
      let result = await this._repo.load(id);
      if (result.isFailure) {
        //TODO: EntityNotFound:ProductType
        return result;
      }
      let pt = result.value();
      return Result.ok(pt);
    } catch (error) {
      throw error;
    }
  }
}
