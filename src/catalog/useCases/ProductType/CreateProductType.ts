import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import { ProductTypesRepository } from "../../database/ProductTypesRepository";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ConfigService } from "@nestjs/config";
import { ProductType } from "@catalog/domain/aggregates/ProductType";
import { CreateProductTypeDto } from "@catalog/dto";

@Injectable({ scope: Scope.DEFAULT })
export class CreateProductType
  implements UseCase<CreateProductTypeDto, ProductType>
{
  constructor(
    private logger: AzureTelemetryService,
    private readonly config: ConfigService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${CreateProductType.name}]`;
  }

  async execute(dto: CreateProductTypeDto): Promise<Result<ProductType>> {
    try {
      this.logger.warn(`${this.llog} '${this.config.get("DATABASE_URL")}'`);
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
