import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * TYPES: LineItem, Customer, Address
 */

export abstract class IMongoEntity {
  _id: Types.ObjectId | undefined;
  id: string | undefined;
  @Prop()
  updatedAt: Date;
  @Prop()
  createdAt: Date;
}
