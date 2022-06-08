import { Field, ObjectType } from "@nestjs/graphql";
import { IWeight } from "@shared/domain";

@ObjectType({ description: "Weight" })
export class Weight implements IWeight {
  @Field()
  dimension: number;
  @Field()
  units: "oz" | "g";
}
