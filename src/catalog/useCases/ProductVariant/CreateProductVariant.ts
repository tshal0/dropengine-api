import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { UUID } from "@shared/domain";
import { ProductsRepository } from "@catalog/database/ProductsRepository";
import { ProductVariant } from "@catalog/domain/aggregates/ProductVariant";
import { CreateProductVariantDto } from "@catalog/dto/ProductVariant/CreateProductVariantDto";

@Injectable({ scope: Scope.DEFAULT })
export class CreateProductVariant
  implements UseCase<CreateProductVariantDto, ProductVariant>
{
  constructor(private _repo: ProductsRepository) {}
  get llog() {
    return `[${moment()}][${CreateProductVariant.name}]`;
  }

  async execute(dto: CreateProductVariantDto): Promise<Result<ProductVariant>> {
    try {
      let uuid = UUID.from(dto.productId);
      let result = await this._repo.loadByUuid(uuid.value());
      if (result.isFailure) return Result.fail(result.error);
      let product = result.value();
      let variantResult = ProductVariant.create(dto);
      if (result.isFailure) return Result.fail(result.error);
      let variant = variantResult.value();
      product.addVariant(dto);
      result = await this._repo.save(product);
      if (result.isFailure) return Result.fail(result.error);
      product = result.value();
      variant = product.value().variants.find((v) => v.props().sku == dto.sku);
      return Result.ok(variant);
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
