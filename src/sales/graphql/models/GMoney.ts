import { Field, ObjectType } from "@nestjs/graphql";
import { IMoney } from "@shared/domain";

@ObjectType({ description: "money " })
export class GMoney implements IMoney {
  @Field()
  total: number;
  @Field()
  currency: "USD";
}
