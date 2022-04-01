import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { CreateProductTypeDto } from "@catalog/dto/ProductType/CreateProductTypeDto";
import { ProductTypesRepository } from "@catalog/database/ProductTypesRepository";
import { ProductType } from "@catalog/domain/aggregates/ProductType";

@Injectable({ scope: Scope.DEFAULT })
export class UpdateProductType
  implements UseCase<CreateProductTypeDto, ProductType>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${UpdateProductType.name}]`;
  }

  async execute(dto: CreateProductTypeDto): Promise<Result<ProductType>> {
    this.logger.log(`${this.llog} Loading productType...`);
    try {
      const uuid = UUID.from(dto.id).value();
      let result = await this._repo.load(uuid);
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
