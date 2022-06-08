import { IProductProps } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductType } from "./ProductType";
import { Variant } from "./Variant";
import { PersonalizationRule } from "./PersonalizationRule";

@ObjectType({ description: "Product" })
export class Product implements IProductProps {
  @Field()
  id: number;
  @Field()
  sku: string;
  @Field()
  type: string;
  @Field()
  pricingTier: string;
  @Field((type) => [String])
  tags: string[];
  @Field()
  image: string;
  @Field()
  svg: string;
  @Field((type) => [PersonalizationRule])
  personalizationRules: PersonalizationRule[];
  @Field((type) => [Variant])
  variants: Variant[];
  @Field((type) => ProductType, { nullable: true })
  productType?: ProductType;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
