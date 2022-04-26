import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ProductsRepository } from "@catalog/database/ProductsRepository";
import { IProductProps } from "@catalog/domain";
import { ProductsQueryDto } from "@catalog/api/ProductsController";

@Injectable({ scope: Scope.DEFAULT })
export class GetAllProducts implements UseCase<any, IProductProps[]> {
  constructor(
    private logger: AzureTelemetryService,
    private _repo: ProductsRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetAllProducts.name}]`;
  }

  async execute(query: ProductsQueryDto): Promise<Result<IProductProps[]>> {
    this.logger.log(`${this.llog} Fetching All Products`);
    try {
      let result = await this._repo.findAll(query);
      if (result.isFailure) {
        return Result.fail(result.error);
      }
      return Result.ok(result.value());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
