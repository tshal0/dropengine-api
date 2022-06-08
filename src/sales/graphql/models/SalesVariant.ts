import { PersonalizationRule, ProductionData, VariantOption } from "@catalog/graphql";
import {
  IVariantOption,
  IProductionData,
  IPersonalizationRule,
} from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesVariantProps } from "@sales/domain";
import { IDimension, IMoney, IWeight } from "@shared/domain";
import { Dimension, Money, Weight } from "@shared/graphql";

@ObjectType({ description: "SalesVariant" })
export class SalesVariant implements ISalesVariantProps {
  id: number;
  @Field()
  sku: string;
  @Field()
  image: string;
  @Field()
  svg: string;
  @Field()
  type: string;
  @Field((type) => VariantOption)
  option1: IVariantOption;
  @Field((type) => VariantOption)
  option2: IVariantOption;
  @Field((type) => VariantOption)
  option3: IVariantOption;
  @Field((type) => ProductionData)
  productionData: IProductionData;
  @Field((type) => [PersonalizationRule])
  personalizationRules: IPersonalizationRule[];
  @Field((type) => Money)
  manufacturingCost: IMoney;
  @Field((type) => Money)
  shippingCost: IMoney;
  @Field((type) => Weight)
  weight: IWeight;
  @Field((type) => Dimension)
  height: IDimension;
  @Field((type) => Dimension)
  width: IDimension;
}
