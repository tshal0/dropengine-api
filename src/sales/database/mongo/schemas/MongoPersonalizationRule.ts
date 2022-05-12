import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class MongoPersonalizationRule {
  [prop: string]: any;
  @Prop()
  name: string;
  @Prop()
  label: string;
  @Prop()
  placeholder: string;
  @Prop()
  required: boolean;
  @Prop()
  type: string;
  @Prop()
  maxLength?: number;
  @Prop()
  pattern?: string;
  @Prop()
  options?: string;
}
export const MongoPersonalizationRuleSchema = SchemaFactory.createForClass(
  MongoPersonalizationRule
);
