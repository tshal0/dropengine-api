import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { ProductsRepository } from "../../database/ProductsRepository";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CreateProductDto } from "catalog/dto/CreateProductDto";
import { IProduct } from "catalog/domain/interfaces/IProduct";
import { Product } from "catalog/domain/aggregates/Product";
import { ProductTypesRepository } from "@catalog/database/ProductTypesRepository";

@Injectable({ scope: Scope.DEFAULT })
export class CreateProduct implements UseCase<CreateProductDto, Product> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _typeRepo: ProductTypesRepository,
    private _repo: ProductsRepository
  ) {}
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
