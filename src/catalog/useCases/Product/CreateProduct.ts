import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { Product } from "@catalog/domain";
import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";

@Injectable({ scope: Scope.DEFAULT })
export class CreateProduct implements UseCase<CreateProductDto, Product> {
  constructor() {}
  get llog() {
    return `[${moment()}][${CreateProduct.name}]`;
  }

  async execute(dto: CreateProductDto): Promise<Result<Product>> {
    try {
      throw new NotImplementedException();
      // let result = Product.create(dto);
      // if (result.isFailure) {
      //   //TODO: CreateProductFailed: InvalidProduct
      //   return result;
      // }
      // result = await this._repo.save(result.value());
      // if (result.isFailure) {
      //   //TODO: CreateProductFailed: ProductFailedToSave
      //   return result;
      // }

      // return Result.ok(result.value());
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
