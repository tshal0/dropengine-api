import { IPersonalizationRule } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "personalizationRule " })
export class GPersonalizationRule implements IPersonalizationRule {
  @Field()
  name: string;
  @Field()
  type: string;
  @Field()
  label: string;
  @Field()
  options: string;
  @Field()
  pattern: string;
  @Field()
  required: boolean;
  @Field()
  maxLength: number;
  @Field()
  placeholder: string;
}
