import { SalesOrder } from "src/sales/domain";
import { OrderResponseDto, QueryOrdersDto } from ".";

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
  constructor(query: QueryOrdersDto, data: SalesOrder[]) {
    this.page = +query.page;
    this.size = +query.size;
    this.data = data.map((agg) => new OrderResponseDto(agg));
  }
}
