import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";
import { IMongoEntity } from "../IMongoEntity";
import {
  MongoLineItemProperty,
  MongoLineItemPropertySchema,
} from "./MongoLineItemProperty";
import {
  MongoSalesVariant,
  MongoSalesVariantSchema,
} from "./MongoSalesVariant";

@Schema({ toObject: { virtuals: true } })
export class MongoSalesLineItem {
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
export type MongoSalesLineItemDocument = MongoSalesLineItem & Document;

export const MongoSalesLineItemSchema =
  SchemaFactory.createForClass(MongoSalesLineItem);
