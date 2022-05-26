import {
  IVariantOption,
  IProductionData,
  IPersonalizationRule,
} from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesVariantProps } from "@sales/domain";
import { IDimension, IMoney, IWeight } from "@shared/domain";
import { Dimension } from "./GDimension";
import { Money } from "./GMoney";
import { PersonalizationRule } from "./GPersonalizationRule";
import { ProductionData } from "./GProductionData";
import { VariantOption } from "./GVariantOption";
import { Weight } from "./GWeight";

@ObjectType({ description: "SalesVariant" })
export class SalesVariant implements ISalesVariantProps {
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
