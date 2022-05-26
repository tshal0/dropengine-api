import { Field, ObjectType } from "@nestjs/graphql";
import { IMoney } from "@shared/domain";

@ObjectType({ description: "Money" })
export class Money implements IMoney {
  @Field()
  total: number;
  @Field()
  currency: "USD";
}
