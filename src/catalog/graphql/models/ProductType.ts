import { IProductTypeProps } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "./Product";
import { ProductionData } from "./ProductionData";
import { LivePreview } from "./LivePreview";
import { VariantOptions } from "./VariantOptions";

@ObjectType({ description: "ProductType" })
export class ProductType implements IProductTypeProps {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field()
  image: string;
  @Field((type) => ProductionData)
  productionData: ProductionData;
  @Field((type) => VariantOptions)
  option1: VariantOptions;
  @Field((type) => VariantOptions)
  option2: VariantOptions;
  @Field((type) => VariantOptions)
  option3: VariantOptions;
  @Field((type) => LivePreview)
  livePreview: LivePreview;
  @Field((type) => [Product], { nullable: true })
  products: Product[];
  @Field()
  updatedAt: Date;
  @Field()
  createdAt: Date;
}
