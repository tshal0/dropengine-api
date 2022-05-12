import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoSalesVariantOption {
  @Prop()
  name: string;
  @Prop()
  option: string;
  @Prop()
  enabled: boolean;
}
export const MongoSalesVariantOptionSchema = SchemaFactory.createForClass(
  MongoSalesVariantOption
);
