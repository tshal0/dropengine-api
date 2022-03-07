import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ProductsRepository } from "catalog/database/ProductsRepository";
import { Product, VariantSKU } from "catalog/domain";
import { ProductVariant } from "catalog/domain/aggregates/ProductVariant";
import { ProductVariantsRepository } from "catalog/database/ProductVariantsRepository";

@Injectable({ scope: Scope.DEFAULT })
export class GetProductVariantBySku
  implements UseCase<VariantSKU, ProductVariant>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductVariantsRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetProductVariantBySku.name}]`;
  }

  async execute(id: VariantSKU): Promise<Result<ProductVariant>> {
    try {
      let result = await this._repo.findBySku(id);
      if (result.isFailure) {
        //TODO: EntityNotFound:ProductVariant
        return Result.fail(result.error);
      }
      let entity = result.value();
      return Result.ok(entity);
    } catch (error) {
      throw error;
    }
  }
}
