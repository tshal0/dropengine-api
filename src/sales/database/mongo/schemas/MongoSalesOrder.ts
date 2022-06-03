import mongoose, { Document } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SalesOrderEvent } from "@sales/domain/events/SalesOrderEvent";
import { SalesCustomer } from "@sales/domain/model/SalesCustomer";
import { SalesLineItem } from "@sales/domain/model/SalesLineItem";
import { Address } from "@shared/domain";

import { IMongoEntity } from "../IMongoEntity";

import { MongoAddress, MongoAddressSchema } from "./MongoAddress";
import { MongoCustomer, MongoCustomerSchema } from "./MongoCustomer";
import { MongoDomainEventSchema } from "./MongoDomainEvent";
import {
  MongoSalesLineItem,
  MongoSalesLineItemSchema,
} from "./MongoSalesLineItem";
import { ISalesOrderProps, OrderStatus } from "@sales/domain/model/SalesOrder";
import { MongoMerchant, MongoMerchantSchema } from "./MongoMerchant";
import { SalesMerchant } from "@sales/domain/model/SalesMerchant";

@Schema({ collection: "orders", id: true, toObject: { virtuals: true } })
export class MongoSalesOrder extends IMongoEntity {
  constructor(props?: ISalesOrderProps | undefined) {
    super();
    if (props) {
      this.id = props.id;
      this.seller = props.seller;
      this.orderName = props.orderName;
      this.orderNumber = props.orderNumber;
      this.orderDate = props.orderDate;
      this.orderStatus = props.orderStatus;
      this.lineItems = props.lineItems;
      this.customer = props.customer;
      this.merchant = props.merchant;
      this.shippingAddress = props.shippingAddress;
      this.billingAddress = props.billingAddress;
      this.updatedAt = props.updatedAt;
      this.createdAt = props.createdAt;
      this.events = props.events;
    }
  }
  @Prop({ required: true })
  seller: string;
  
  @Prop({ required: true })
  orderStatus: OrderStatus;

  @Prop({ required: true, index: true})
  orderDate: Date;
  @Prop({ required: true })
  orderNumber: number;

  @Prop({ required: false, unique: true })
  orderName: string;

  @Prop({
    type: [MongoSalesLineItemSchema],
    required: true,
  })
  lineItems: MongoSalesLineItem[];
  @Prop({ type: MongoCustomerSchema, required: true })
  customer: MongoCustomer;
  @Prop({ type: MongoMerchantSchema, required: false })
  merchant: MongoMerchant;
  @Prop({ type: MongoAddressSchema, required: true })
  shippingAddress: MongoAddress;
  @Prop({ type: MongoAddressSchema, required: true })
  billingAddress: MongoAddress;
  @Prop({ type: [MongoDomainEventSchema], required: false })
  events: SalesOrderEvent<any>[];
  public raw(): ISalesOrderProps {
    let props: ISalesOrderProps = {
      id: this.id,
      seller: this.seller,
      orderName: this.orderName,
      orderNumber: this.orderNumber,
      orderDate: this.orderDate,
      orderStatus: this.orderStatus as OrderStatus,
      lineItems: this.lineItems.map((li) => new SalesLineItem(li).raw()),
      customer: new SalesCustomer(this.customer).raw(),
      merchant: new SalesMerchant(this.merchant).raw(),
      shippingAddress: new Address(this.shippingAddress).raw(),
      billingAddress: new Address(this.billingAddress).raw(),
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      events: [],
    };
    return props;
  }
}
export type MongoSalesOrderDocument = MongoSalesOrder & Document;
export const MongoSalesOrderSchema =
  SchemaFactory.createForClass(MongoSalesOrder);
