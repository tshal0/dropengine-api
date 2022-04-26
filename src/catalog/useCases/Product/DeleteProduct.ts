import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { Injectable, Scope } from "@nestjs/common";
import { ProductsRepository } from "@catalog/database/ProductsRepository";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteProduct implements UseCase<UUID, any> {
  constructor(
    private logger: AzureTelemetryService,
    private _repo: ProductsRepository
  ) {}
  get llog() {
    return `[${moment()}][${DeleteProduct.name}]`;
  }

  async execute(id: UUID): Promise<Result<any>> {
    this.logger.log(`${this.llog} Delete Product ${id.value()}`);
    try {
      let res = await this._repo.delete(id);
      if (res.isFailure) return Result.fail(res.error);
      return Result.ok();
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }

      this.logger.error(`${this.llog} Failed to DeleteProduct`, error);
      return Result.fail(error);
    }
  }
}
