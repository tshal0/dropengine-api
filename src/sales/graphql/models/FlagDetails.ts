import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "FlagDetails" })
export class FlagDetails {
  @Field({ nullable: true })
  lineNumber: number;
  @Field({ nullable: true })
  property: string;
  @Field({ nullable: true })
  value?: string;
  @Field({ nullable: true })
  reason?: string;
  @Field({ nullable: true })
  pattern: string;
}
