import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoProductionData {
  @Prop()
  material: string;
  @Prop()
  thickness: string;
  @Prop()
  route: string;
}
export const MongoProductionDataSchema =
  SchemaFactory.createForClass(MongoProductionData);
