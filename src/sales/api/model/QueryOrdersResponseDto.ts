import { SalesOrderQueryResult } from "@sales/database";
import { SalesOrder } from "@sales/domain";
import { OrderResponse, QueryOrdersDto } from ".";

export class AggregationResultOptions {
  key: string;
  values: any[];
}
export class QueryOrdersResponseDto {
  total: number = 0;
  page: number = 0;
  pages: number = 0;
  size: number = 100;
  options: AggregationResultOptions[] = [];
  data: any[] = [];
  constructor(result: SalesOrderQueryResult) {
    this.total = result.total;
    this.pages = result.pages;
    this.page = result.page;
    this.size = result.size;
    this.data = result.data.map((order) => new OrderResponse(order));
  }
}
