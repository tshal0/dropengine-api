import { ArgsType, Field, Int } from "@nestjs/graphql";
import { SalesOrder } from "@sales/domain";
import { Max, Min } from "class-validator";
import { getDefaultStartDate, getDefaultEndDate } from "./dateUtils";
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
  query: string;

  @Field({ nullable: true, defaultValue: getDefaultStartDate() })
  startDate: Date = getDefaultStartDate();
  @Field({ nullable: true, defaultValue: getDefaultEndDate() })
  endDate: Date = getDefaultEndDate();

  @Field((type) => String, { nullable: true })
  sortBy: keyof SalesOrder = "orderDate";

  @Field((type) => String, { nullable: true })
  sortDir: "asc" | "desc" = "desc";
}
