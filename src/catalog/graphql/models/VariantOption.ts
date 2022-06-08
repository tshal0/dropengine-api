import { IVariantOption } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "VariantOption" })
export class VariantOption implements IVariantOption {
  @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  value: string;
}
