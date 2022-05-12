import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoAddress {
  @Prop()
  zip: string;
  @Prop()
  city: string;
  @Prop()
  name: string;
  @Prop()
  phone: string;
  @Prop()
  company: string;
  @Prop()
  country: string;
  @Prop()
  address1: string;
  @Prop()
  address2: string;
  @Prop()
  address3: string;
  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop()
  province: string;
  @Prop()
  lastName: string;
  @Prop()
  firstName: string;
  @Prop()
  countryCode: string;
  @Prop()
  provinceCode: string;
}
export const MongoAddressSchema = SchemaFactory.createForClass(MongoAddress);
