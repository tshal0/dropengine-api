import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { IMongoEntity } from "../IMongoEntity";

@Schema({ collection: "events" })
export class MongoDomainEvent {
  _id?: Types.ObjectId | undefined;
  id?: string | undefined;
  @Prop()
  public eventId: string;
  @Prop()
  public eventName: string;
  @Prop()
  public eventType: string;
  @Prop()
  public eventVersion: string;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  public details: any;
  @Prop()
  public aggregateType: string;
  @Prop()
  public aggregateId: string;
  @Prop()
  public aggregateVersion?: number | undefined;
  @Prop()
  public timestamp: Date;
}
export type MongoDomainEventDocument = MongoDomainEvent & Document;

export const MongoDomainEventSchema =
  SchemaFactory.createForClass(MongoDomainEvent);
