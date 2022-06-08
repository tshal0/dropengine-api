import { IVariantProps } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { Dimension, Money, Weight } from "@shared/graphql";
import { Product } from "./Product";
import { ProductType } from "./ProductType";
import { VariantOption } from "./VariantOption";

@ObjectType({ description: "Variant" })
export class Variant implements IVariantProps {
  @Field()
  id: number;
  @Field()
  image: string;
  @Field()
  sku: string;
  @Field()
  type: string;
  @Field((type) => VariantOption)
  option1: VariantOption;
  @Field((type) => VariantOption)
  option2: VariantOption;
  @Field((type) => VariantOption)
  option3: VariantOption;
  @Field((type) => Dimension)
  height: Dimension;
  @Field((type) => Dimension)
  width: Dimension;
  @Field((type) => Weight)
  weight: Weight;
  @Field((type) => Money)
  manufacturingCost: Money;
  @Field((type) => Money)
  shippingCost: Money;
  @Field((type) => Product, { nullable: true })
  product?: Product;
  @Field((type) => ProductType, { nullable: true })
  productType?: ProductType;
}
