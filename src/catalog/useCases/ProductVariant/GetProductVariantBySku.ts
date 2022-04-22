import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { ProductVariantsRepository } from "@catalog/database/ProductVariantsRepository";
import { VariantSKU } from "@catalog/domain";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";

@Injectable({ scope: Scope.DEFAULT })
export class GetProductVariantBySku
  implements UseCase<VariantSKU, ProductVariant>
{
  constructor(private _repo: ProductVariantsRepository) {}
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
