import { Injectable, Scope } from "@nestjs/common";
import { UseCase } from "@shared/domain/UseCase";

import moment from "moment";
import { QueryOrdersDto } from "../api/model";
import { SalesOrderRepository } from "../database/SalesOrderRepository";
import { SalesOrderQuery } from "../database/SalesOrderQueries";
import { SalesOrder } from "@sales/domain/SalesOrder";
@Injectable({ scope: Scope.DEFAULT })
export class GetSalesOrder implements UseCase<string, SalesOrder> {
  constructor(private _repo: SalesOrderRepository) {}

  async execute(id: string): Promise<SalesOrder> {
    let result = await this._repo.load(id);
    return result;
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class QuerySalesOrders implements UseCase<QueryOrdersDto, SalesOrder[]> {
  constructor(private _query: SalesOrderQuery) {}

  async execute(dto: QueryOrdersDto): Promise<SalesOrder[]> {
    if (!dto?.size) dto.size = 100;
    if (!dto?.page) dto.page = 0;
    let results = await this._query.execute(dto);
    return results;
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class DeleteSalesOrder implements UseCase<string, void> {
  constructor(private _repo: SalesOrderRepository) {}

  async execute(id: string): Promise<void> {
    await this._repo.delete(id);
  }
}
