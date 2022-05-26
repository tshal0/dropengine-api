import { Field, ObjectType } from "@nestjs/graphql";
import { IPersonalization } from "@sales/domain";

@ObjectType({ description: "Personalization" })
export class Personalization implements IPersonalization {
  @Field()
  name: string;
  @Field()
  value: string;
}
