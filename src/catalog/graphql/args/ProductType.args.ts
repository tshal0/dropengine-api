import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";
@ArgsType()
export class ProductTypeArgs {
  constructor() {}

  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  slug: string;
}
