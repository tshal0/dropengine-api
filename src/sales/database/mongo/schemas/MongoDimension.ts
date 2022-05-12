import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IDimension } from "@shared/domain";


@Schema({ _id: false })
export class MongoDimension implements IDimension {
  @Prop()
  dimension: number;
  @Prop()
  units: "in" | "mm";
}
export const MongoDimensionSchema =
  SchemaFactory.createForClass(MongoDimension);
