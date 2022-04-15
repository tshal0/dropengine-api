import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IWeight } from "@shared/domain";


@Schema({ _id: false })
export class MongoWeight implements IWeight {
  @Prop()
  dimension: number;
  @Prop()
  units: "oz" | "g";
}
export const MongoWeightSchema = SchemaFactory.createForClass(MongoWeight);
