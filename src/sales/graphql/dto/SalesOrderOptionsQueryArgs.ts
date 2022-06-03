import { ArgsType, Field } from "@nestjs/graphql";
import { getDefaultStartDate, getDefaultEndDate } from "./dateUtils";

@ArgsType()
export class SalesOrderOptionsQueryArgs {
  constructor() { }
  @Field({ nullable: true })
  query: string;

  @Field({ nullable: true, defaultValue: getDefaultStartDate() })
  startDate: Date = getDefaultStartDate();
  @Field({ nullable: true, defaultValue: getDefaultEndDate() })
  endDate: Date = getDefaultEndDate();
}
