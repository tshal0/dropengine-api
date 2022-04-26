import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ProductVariantsRepository } from "@catalog/database/ProductVariantsRepository";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { VariantQueryDto } from "@catalog/dto";

@Injectable({ scope: Scope.DEFAULT })
export class QueryProductVariants
  implements UseCase<VariantQueryDto, ProductVariant[]>
{
  constructor(
    private logger: AzureTelemetryService,
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
