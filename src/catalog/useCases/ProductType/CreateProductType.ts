import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import { ProductTypesRepository } from "../../database/ProductTypesRepository";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { ProductTypeName } from "@catalog/domain";
import { ProductType } from "@catalog/domain/aggregates/ProductType";
import { CreateProductTypeDto } from "@catalog/dto/CreateProductTypeDto";

@Injectable({ scope: Scope.DEFAULT })
export class CreateProductType
  implements UseCase<CreateProductTypeDto, ProductType>
{
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${CreateProductType.name}]`;
  }

  async execute(dto: CreateProductTypeDto): Promise<Result<ProductType>> {
    try {
      //TODO: Load ProductType by Name or UUID
      //TODO: If exists, Update
      //TODO: If not exists, Create
      //TODO: Save
      this.logger.warn(`${this.llog} '${this.config.get('POSTGRES_HOST')}'`)
      let result = await this._repo.load(dto);
      if (result.isFailure) {
        return result;
      }
      let pt = result.value();
      return await this._repo.save(pt);
    } catch (error) {
      this.logger.log(`${this.llog} err`);
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}
