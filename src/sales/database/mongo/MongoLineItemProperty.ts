import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoLineItemProperty {
  @Prop()
  name: string;
  @Prop()
  value: string;
}
export const MongoLineItemPropertySchema = SchemaFactory.createForClass(
  MongoLineItemProperty
);
