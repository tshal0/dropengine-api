import { IVariantOptionsProps } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { OptionValue } from "./OptionValue";

@ObjectType({ description: "VariantOptions" })
export class VariantOptions implements IVariantOptionsProps {
  @Field({ nullable: true })
  name: string;
  @Field()
  enabled: boolean;
  @Field((type) => [OptionValue], { nullable: true })
  values: OptionValue[];
}
