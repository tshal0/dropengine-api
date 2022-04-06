import { QueryOrdersDto } from ".";

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
  constructor(query: QueryOrdersDto) {
    this.page = +query.page;
    this.size = +query.size;
  }
}
