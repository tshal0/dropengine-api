import { Field, ObjectType } from "@nestjs/graphql";
import { IPersonalization } from "@sales/domain";

@ObjectType({ description: "personalization" })
export class GPersonalization implements IPersonalization {
  @Field()
  name: string;
  @Field()
  value: string;
}
