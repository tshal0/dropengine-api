import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { IMongoEntity } from "./IMongoEntity";
import { MongoAddress, MongoAddressSchema } from "./MongoAddress";
import { MongoCustomer, MongoCustomerSchema } from "./MongoCustomer";
import { MongoSalesLineItem } from "./MongoSalesLineItem";

@Schema({ collection: "orders" })
export class MongoSalesOrder extends IMongoEntity {
  @Prop({ required: true })
  accountId: string;
  @Prop({ required: true })
  orderStatus: string;

  @Prop({ required: true })
  orderDate: Date;
  @Prop({ required: true })
  orderNumber: number;

  @Prop({ required: false })
  orderName?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: MongoSalesLineItem.name,
  })
  lineItems?: MongoSalesLineItem[];
  @Prop({ type: MongoCustomerSchema, required: true })
  customer: MongoCustomer;
  @Prop({ type: MongoAddressSchema, required: true })
  shippingAddress: MongoAddress;
  @Prop({ type: MongoAddressSchema, required: true })
  billingAddress: MongoAddress;
}
export type MongoSalesOrderDocument = MongoSalesOrder & Document;
export const MongoSalesOrderSchema =
  SchemaFactory.createForClass(MongoSalesOrder);
