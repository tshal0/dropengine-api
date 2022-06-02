import { ArgsType, Field, Int } from "@nestjs/graphql";
import { SalesOrder } from "@sales/domain";
import { Max, Min } from "class-validator";
import moment from "moment";

@ArgsType()
export class SalesOrdersQueryArgs {
  constructor() {}
  @Field((type) => Int)
  @Min(0)
  page = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  size = 25;

  @Field({ nullable: true })
  orderName: string;
  @Field({ nullable: true })
  merchantName: string;
  
  @Field({ nullable: true, defaultValue: getDefaultStartDate() })
  startDate: Date = getDefaultStartDate();
  @Field({ nullable: true, defaultValue: getDefaultEndDate() })
  endDate: Date = getDefaultEndDate();

  @Field((type) => String, { nullable: true })
  sortBy: keyof SalesOrder = "orderDate";

  @Field((type) => String, { nullable: true })
  sortDir: "asc" | "desc" = "desc";
}
function getDefaultEndDate(): any {
  return moment().endOf("day").toDate();
}

function getDefaultStartDate(): any {
  return moment().subtract(30, "days").startOf("day").toDate();
}
