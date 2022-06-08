import { IVariantOptionValue } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "OptionValue" })
export class OptionValue implements IVariantOptionValue {
  @Field()
  value: string;
  @Field()
  enabled: boolean;
}
