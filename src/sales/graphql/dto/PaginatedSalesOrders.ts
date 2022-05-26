import { Field, ObjectType } from "@nestjs/graphql";
import { SalesOrder } from "../models";

@ObjectType({ description: "PaginatedSalesOrders" })
export class PaginatedSalesOrders {
  constructor(props?: PaginatedSalesOrders | undefined) {
    if (props) {
      this.count = props.count;
      this.page = props.page;
      this.pages = props.pages;
      this.size = props.size;
      this.salesOrders = props.salesOrders;
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
  @Field((type) => [SalesOrder])
  salesOrders: SalesOrder[];
}
