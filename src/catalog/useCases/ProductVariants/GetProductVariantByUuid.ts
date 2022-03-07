import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ProductsRepository } from "catalog/database/ProductsRepository";
import { Product } from "catalog/domain";
import { ProductVariant } from "catalog/domain/aggregates/ProductVariant";
import { ProductVariantsRepository } from "catalog/database/ProductVariantsRepository";

@Injectable({ scope: Scope.DEFAULT })
export class GetProductVariantByUuid implements UseCase<UUID, ProductVariant> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductVariantsRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetProductVariantByUuid.name}]`;
  }

  async execute(id: UUID): Promise<Result<ProductVariant>> {
    this.logger.log(`${this.llog} Loading productType...`);
    try {
      let result = await this._repo.findByUuid(id);
      if (result.isFailure) {
        //TODO: EntityNotFound:ProductType
        return Result.fail();
      }
      let entity = result.value();
      return Result.ok(entity);
    } catch (error) {
      throw error;
    }
  }
}
