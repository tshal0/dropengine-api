import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { Injectable, Scope } from "@nestjs/common";
import { ProductTypesRepository } from "@catalog/database/ProductTypesRepository";

@Injectable({ scope: Scope.DEFAULT })
export class DeleteProductType implements UseCase<UUID, any> {
  constructor(
    private logger: AzureLoggerService,
    private _repo: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${DeleteProductType.name}]`;
  }

  async execute(id: UUID): Promise<Result<any>> {
    this.logger.log(`${this.llog} Delete ProductType ${id.value()}`);
    try {
      let res = await this._repo.delete(id);
      if (res.isFailure) return Result.fail(res.error);
      return Result.ok();
    } catch (error) {
      let resp = {};
      if (error.toJSON) {
        resp = error.response.data;
      }

      this.logger.error(`${this.llog} Failed to DeleteProductType`, error);
      return Result.fail(error);
    }
  }
}
