import { IVariantOptionsProps } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";
import { OptionValue } from "./OptionValue";

@ObjectType({ description: "VariantOptions" })
export class VariantOptions implements IVariantOptionsProps {
  @Field()
  name: string;
  @Field()
  enabled: boolean;
  @Field((type) => [OptionValue])
  values: OptionValue[];
}
