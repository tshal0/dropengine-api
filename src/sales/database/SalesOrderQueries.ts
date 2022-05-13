import { Injectable } from "@nestjs/common";
import { Result, ResultError } from "@shared/domain";
import { MongoQueryParams } from "@shared/mongo";
import moment from "moment";
import { MongoOrdersRepository } from "./mongo/repositories/MongoOrdersRepository";
import { QueryOrdersDto } from "../api/model";
import { SalesOrder } from "@sales/domain/SalesOrder";

export enum SalesOrderQueryError {
  FailedToLoadSalesOrdersFromDb = "FailedToLoadSalesOrderFromDb",
  FailedToConvertSalesOrdersToDb = "FailedToConvertSalesOrderToDb",
  SalesOrdersNotFound = "SalesOrderNotFound",
}
export class SalesOrdersNotFoundError implements ResultError {
  public stack: string;
  public name = SalesOrderQueryError.SalesOrdersNotFound;
  public message: string;
  public inner: ResultError[];
  constructor(public value: any, reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class FailedToLoadSalesOrdersFromDb implements ResultError {
  public stack: string;
  public name = SalesOrderQueryError.FailedToLoadSalesOrdersFromDb;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: QueryOrdersDto,
    public reason: string
  ) {
    this.message =
      `${SalesOrderQueryError.FailedToLoadSalesOrdersFromDb}` +
      `'${value.page}' ` +
      `'${value.size}': ${reason}`;
  }
}

@Injectable()
export class SalesOrderQuery {
  constructor(private readonly _mongo: MongoOrdersRepository) {}
  protected static llog = () => `[${moment()}][${SalesOrderQuery.name}]`;

  public async execute(params: QueryOrdersDto): Promise<SalesOrder[]> {
    let qp: MongoQueryParams = {
      limit: params.size,
      skip: params.size * params.page,
    };
    let docsResult = await this._mongo.find(qp);
    let docs = docsResult.result.map((d) => d);
    let orderResults = await Promise.all(
      docs.map(async (d) => await SalesOrder.load(d))
    );

    return orderResults;
  }
}
