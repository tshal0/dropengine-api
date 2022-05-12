import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoCustomer {
  @Prop()
  name: string;
  @Prop()
  email: string;
}
export const MongoCustomerSchema = SchemaFactory.createForClass(MongoCustomer);
