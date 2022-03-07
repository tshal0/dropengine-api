import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";
import moment from "moment";
import { Result } from "@shared/domain/Result";
import { UUID } from "@shared/domain/valueObjects";
import { EntityNotFoundException } from "@shared/exceptions/entitynotfound.exception";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import {
  IProductType,
  IProductTypeProps,
} from "catalog/domain/interfaces/IProductType";
import { ProductTypesRepository } from "catalog/database/ProductTypesRepository";
import { result } from "lodash";

@Injectable({ scope: Scope.DEFAULT })
export class GetAllProductTypes implements UseCase<any, IProductTypeProps[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureLoggerService,
    private _repository: ProductTypesRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetAllProductTypes.name}]`;
  }

  async execute(): Promise<Result<IProductTypeProps[]>> {
    this.logger.log(`${this.llog} Fetching All ProductTypes`);
    try {
      let result = await this._repository.findAll();
      if (result.isFailure) {
        return Result.fail(result.error);
      }
      return Result.ok(result.value());
    } catch (error) {
      return Result.fail(error);
    }
  }
}
