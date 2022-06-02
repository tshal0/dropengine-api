import { IPersonalizationRule } from "@catalog/model";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "PersonalizationRule" })
export class PersonalizationRule implements IPersonalizationRule {
  @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  type: string;
  @Field({nullable: true})
  label: string;
  @Field({nullable: true})
  options: string;
  @Field({nullable: true})
  pattern: string;
  @Field({nullable: true})
  required: boolean;
  @Field({nullable: true})
  maxLength: number;
  @Field({nullable: true})
  placeholder: string;
}
