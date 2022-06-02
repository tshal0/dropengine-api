import { Field, ObjectType } from "@nestjs/graphql";
import { FlagDetails } from "./FlagDetails";

@ObjectType({ description: "ErrorFlag" })
export class ErrorFlag {
  @Field()
  type: string;
  @Field()
  message: string;
  @Field((type) => FlagDetails)
  details: FlagDetails;
}
