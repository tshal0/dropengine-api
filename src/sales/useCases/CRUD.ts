import { Injectable, NotImplementedException, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UseCase } from "@shared/domain/UseCase";

import moment from "moment";
import { Result, ResultError } from "@shared/domain/Result";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { QueryOrdersDto } from "../api/model";
import { SalesOrderRepository } from "../database/SalesOrderRepository";
import { SalesOrderQuery } from "../database/SalesOrderQueries";
import { SalesOrder } from "@sales/domain";

@Injectable({ scope: Scope.DEFAULT })
export class GetSalesOrder implements UseCase<string, SalesOrder> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: SalesOrderRepository
  ) {}
  get llog() {
    return `[${moment()}][${GetSalesOrder.name}]`;
  }

  async execute(id: string): Promise<Result<SalesOrder>> {
    try {
      let result = await this._repo.load(id);
      if (result.isFailure) {
        //TODO: FailedToLoadSalesOrder
        return result;
      }
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto: id }));
    }
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class QuerySalesOrders implements UseCase<QueryOrdersDto, SalesOrder[]> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _query: SalesOrderQuery
  ) {}
  get llog() {
    return `[${moment()}][${QuerySalesOrders.name}]`;
  }

  async execute(dto: QueryOrdersDto): Promise<Result<SalesOrder[]>> {
    try {
      if (!dto?.size) dto.size = 100;
      if (!dto?.page) dto.page = 0;
      let results = await this._query.execute(dto);
      if (results.isFailure) {
        return Result.fail(results.error, ``);
      }
      return results;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto }));
    }
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class DeleteSalesOrder implements UseCase<string, void> {
  constructor(
    private eventEmitter: EventEmitter2,
    private logger: AzureTelemetryService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private _repo: SalesOrderRepository
  ) {}
  get llog() {
    return `[${moment()}][${DeleteSalesOrder.name}]`;
  }

  async execute(id: string): Promise<Result<void>> {
    try {
      let result = await this._repo.delete(id);
      if (result.isFailure) {
        //TODO: FailedToDeleteSalesOrder
        throw new NotImplementedException(`FailedToDeleteSalesOrder`);
      }
      return result;
    } catch (error) {
      return Result.fail(new ResultError(error, [error], { dto: id }));
    }
  }
}
