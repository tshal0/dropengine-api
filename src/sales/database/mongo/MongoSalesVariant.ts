import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { IMoney, IWeight } from "@shared/domain";
import {
  MongoPersonalizationRule,
  MongoProductionData,
  MongoSalesVariantOption,
} from "..";
import { MongoMoneySchema } from "./MongoMoney";
import { MongoPersonalizationRuleSchema } from "./MongoPersonalizationRule";
import { MongoProductionDataSchema } from "./MongoProductionData";
import { MongoSalesVariantOptionSchema } from "./MongoSalesVariantOption";
import { MongoWeightSchema } from "./MongoWeight";

@Schema({ _id: false })
export class MongoSalesVariant {
  @Prop()
  id: string;
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
