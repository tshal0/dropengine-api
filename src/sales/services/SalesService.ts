import { Injectable, Scope } from "@nestjs/common";
import { SalesOrderQueryResult, SalesOrderRepository } from "@sales/database";
import { MongoQueryParams } from "@shared/mongo";

@Injectable({ scope: Scope.DEFAULT })
export class SalesService {
  constructor(private readonly _repo: SalesOrderRepository) {}

  public async findById(id: string) {
    return await this._repo.load(id);
  }

  /**
   * Queries the SalesOrder repository for a paginated, filtered result set.
   * @param params SalesOrderQueryParams
   * @returns SalesOrderQueryResult
   */
  public async query(params: MongoQueryParams): Promise<SalesOrderQueryResult> {
    let result = await this._repo.query(params);
    return result;
  }

  public async delete(id: string) {
    return await this._repo.delete(id);
  }
}
