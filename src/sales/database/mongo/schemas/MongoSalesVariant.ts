import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISalesVariantProps } from "@sales/domain/model/SalesVariant";

import { IDimension, IMoney, IWeight } from "@shared/domain";
import mongoose from "mongoose";
import { MongoMoneySchema } from "./MongoMoney";
import {
  MongoPersonalizationRule,
  MongoPersonalizationRuleSchema,
} from "./MongoPersonalizationRule";
import {
  MongoProductionData,
  MongoProductionDataSchema,
} from "./MongoProductionData";
import {
  MongoSalesVariantOption,
  MongoSalesVariantOptionSchema,
} from "./MongoSalesVariantOption";
import { MongoWeightSchema } from "./MongoWeight";

@Schema({ _id: false })
export class MongoSalesVariant implements ISalesVariantProps {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  height: IDimension;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  width: IDimension;
  @Prop()
  id: number;
  @Prop()
  sku: string;
  @Prop()
  image: string;
  @Prop()
  svg: string;
  @Prop()
  type: string;
  @Prop({ type: MongoSalesVariantOptionSchema })
  option1: MongoSalesVariantOption;
  @Prop({ type: MongoSalesVariantOptionSchema })
  option2: MongoSalesVariantOption;
  @Prop({ type: MongoSalesVariantOptionSchema })
  option3: MongoSalesVariantOption;
  @Prop({ type: MongoMoneySchema })
  manufacturingCost: IMoney;
  @Prop({ type: MongoMoneySchema })
  shippingCost: IMoney;
  @Prop({ type: MongoWeightSchema })
  weight: IWeight;
  @Prop({ type: MongoProductionDataSchema })
  productionData: MongoProductionData;
  @Prop({ type: [MongoPersonalizationRuleSchema] })
  personalizationRules: MongoPersonalizationRule[];
}
export const MongoSalesVariantSchema =
  SchemaFactory.createForClass(MongoSalesVariant);
