import { Field, ObjectType } from "@nestjs/graphql";
import { SalesOrder } from "../models";
import { SalesOrderQueryOptions } from "./SalesOrderQueryOptions";
@ObjectType({ description: "PaginatedSalesOrders" })
export class PaginatedSalesOrders {
  constructor(props?: PaginatedSalesOrders | undefined) {
    if (props) {
      this.count = props.count;
      this.page = props.page;
      this.pages = props.pages;
      this.size = props.size;
      this.data = props.data;
      this.options = props.options;
    }
  }
  @Field()
  count: number;
  @Field()
  page: number;
  @Field()
  pages: number;
  @Field()
  size: number;
  @Field((type) => SalesOrderQueryOptions)
  options: SalesOrderQueryOptions;
  @Field((type) => [SalesOrder])
  data: SalesOrder[];
}
