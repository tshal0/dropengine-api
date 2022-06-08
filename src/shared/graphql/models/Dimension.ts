import { Field, ObjectType } from "@nestjs/graphql";
import { IDimension } from "@shared/domain";

@ObjectType({ description: "Dimension" })
export class Dimension implements IDimension {
  constructor(props?: IDimension | undefined) {
    if (props) {
      this.dimension = props.dimension;
      this.units = props.units;
    }
  }
  @Field()
  dimension: number;
  @Field()
  units: "in" | "mm";
}
