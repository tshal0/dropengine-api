import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { ProductsRepository } from "@catalog/database/ProductsRepository";
import { Product } from "@catalog/domain";

@Injectable({ scope: Scope.DEFAULT })
export class GetProduct implements UseCase<UUID, Product> {
  constructor(
    private logger: AzureTelemetryService,
    private _repo: ProductsRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetProduct.name}]`;
  }

  async execute(id: UUID): Promise<Result<Product>> {
    this.logger.log(`${this.llog} Loading productType...`);
    try {
      let result = await this._repo.loadByUuid(id);
      if (result.isFailure) {
        //TODO: EntityNotFound:ProductType
        return Result.fail();
      }
      let product = result.value();
      return Result.ok(product);
    } catch (error) {
      throw error;
    }
  }
}
