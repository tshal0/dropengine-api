import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { ProductVariantsRepository } from "@catalog/database/ProductVariantsRepository";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { ProductVariantUUID } from "@catalog/domain/valueObjects/ProductVariant/VariantUUID";

@Injectable({ scope: Scope.DEFAULT })
export class GetProductVariantById
  implements UseCase<ProductVariantUUID, ProductVariant>
{
  constructor(private _repo: ProductVariantsRepository) {}
  get llog() {
    return `[${moment()}][${GetProductVariantById.name}]`;
  }

  async execute(id: ProductVariantUUID): Promise<Result<ProductVariant>> {
    try {
      let result = await this._repo.findById(id);
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
