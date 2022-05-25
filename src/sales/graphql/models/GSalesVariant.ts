import {
  IVariantOption,
  IProductionData,
  IPersonalizationRule,
} from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesVariantProps } from "@sales/domain";
import { IDimension, IMoney, IWeight } from "@shared/domain";
import { GDimension } from "./GDimension";
import { GMoney } from "./GMoney";
import { GPersonalizationRule } from "./GPersonalizationRule";
import { GProductionData } from "./GProductionData";
import { GVariantOption } from "./GVariantOption";
import { GWeight } from "./GWeight";

@ObjectType({ description: "salesVariant " })
export class GSalesVariant implements ISalesVariantProps {
  @Field()
  id: string;
  @Field()
  productId: string;
  @Field()
  productTypeId: string;
  @Field()
  sku: string;
  @Field()
  image: string;
  @Field()
  svg: string;
  @Field()
  type: string;
  @Field((type) => GVariantOption)
  option1: IVariantOption;
  @Field((type) => GVariantOption)
  option2: IVariantOption;
  @Field((type) => GVariantOption)
  option3: IVariantOption;
  @Field((type) => GProductionData)
  productionData: IProductionData;
  @Field((type) => [GPersonalizationRule])
  personalizationRules: IPersonalizationRule[];
  @Field((type) => GMoney)
  manufacturingCost: IMoney;
  @Field((type) => GMoney)
  shippingCost: IMoney;
  @Field((type) => GWeight)
  weight: IWeight;
  @Field((type) => GDimension)
  height: IDimension;
  @Field((type) => GDimension)
  width: IDimension;
}
