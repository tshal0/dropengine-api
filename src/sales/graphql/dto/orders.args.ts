import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";

@ArgsType()
export class SalesOrdersArgs {
  @Field((type) => Int)
  @Min(0)
  page = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(100)
  size = 25;

  @Field({ nullable: true })
  orderName: string;
}
