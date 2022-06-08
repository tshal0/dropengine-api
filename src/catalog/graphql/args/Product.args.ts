import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";
@ArgsType()
export class ProductArgs {
  constructor() {}

  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  sku: string;
  @Field({ nullable: true })
  slug: string;
}
