import { IVariantOption } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "variantOption " })
export class GVariantOption implements IVariantOption {
  @Field()
  name: string;
  @Field({ nullable: true })
  value: string;
}
