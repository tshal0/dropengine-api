import { Injectable, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { ProductVariantsRepository } from "@catalog/database/ProductVariantsRepository";
import { VariantSKU } from "@catalog/domain";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { VariantQueryDto } from "@catalog/dto";

@Injectable({ scope: Scope.DEFAULT })
export class QueryProductVariants
  implements UseCase<VariantQueryDto, ProductVariant[]>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repo: ProductVariantsRepository
  ) {}
  get llog() {
    return `[${moment()}][${QueryProductVariants.name}]`;
  }

  async execute(query: VariantQueryDto): Promise<Result<ProductVariant[]>> {
    try {
      let result = await this._repo.query(query);
      let variants = result.filter((r) => r.isSuccess).map((r) => r.value());
      return Result.ok(variants);
    } catch (error) {
      this.logger.error(error, error.stack);
      return Result.fail(new ResultError(error));
    }
  }
}
