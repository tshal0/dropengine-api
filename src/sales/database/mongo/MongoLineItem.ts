import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose from "mongoose";
import { MongoLineItemProperty } from ".";
import { IMongoEntity } from "./IMongoEntity";
import { MongoLineItemPropertySchema } from "./MongoLineItemProperty";
import {
  MongoSalesVariant,
  MongoSalesVariantSchema,
} from "./MongoSalesVariant";

@Schema({ _id: true })
export class MongoLineItem extends IMongoEntity {
  @Prop()
  lineNumber: number;
  @Prop()
  quantity: number;
  @Prop({ type: MongoSalesVariantSchema })
  variant: MongoSalesVariant;
  @Prop({ type: [MongoLineItemPropertySchema] })
  personalization: MongoLineItemProperty[];
  @Prop({ type: [mongoose.Schema.Types.Mixed] })
  flags: any[];
}
export const MongoLineItemSchema = SchemaFactory.createForClass(MongoLineItem);
