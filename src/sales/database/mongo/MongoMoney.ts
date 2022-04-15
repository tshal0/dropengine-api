import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMoney } from "@shared/domain";

@Schema({ _id: false })
export class MongoMoney implements IMoney {
  @Prop()
  total: number;
  @Prop()
  currency: "USD" = "USD";
}
export const MongoMoneySchema = SchemaFactory.createForClass(MongoMoney);
