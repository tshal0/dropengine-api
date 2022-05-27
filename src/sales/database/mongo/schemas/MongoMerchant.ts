import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ _id: false })
export class MongoMerchant {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  shopOrigin: string;
}
export const MongoMerchantSchema = SchemaFactory.createForClass(MongoMerchant);
