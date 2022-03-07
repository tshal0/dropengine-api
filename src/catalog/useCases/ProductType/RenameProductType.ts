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
export class RenameProductType
  implements UseCase<{ uuid: UUID; name: string }, ProductType>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${RenameProductType.name}]`;
  }

  async execute(dto: {
    uuid: UUID;
    name: string;
  }): Promise<Result<ProductType>> {
    this.logger.log(`${this.llog} Loading productType...`);
    try {
      let result = await this._repo.load(dto.uuid);
      if (result.isFailure) {
        //TODO: EntityNotFound:ProductType
        return Result.fail(result.error);
      }
      let pt = result.value();
      pt.rename(dto.name);
      result = await this._repo.save(pt);
      if (result.isFailure) {
        //TODO: ProductTypeRenameFailed
        return Result.fail(result.error);
      }
      return Result.ok(result.value());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
