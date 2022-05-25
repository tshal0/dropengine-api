import { Field, ObjectType } from "@nestjs/graphql";
import { IWeight } from "@shared/domain";

@ObjectType({ description: "weight " })
export class GWeight implements IWeight {
  @Field()
  dimension: number;
  @Field()
  units: "oz" | "g";
}
