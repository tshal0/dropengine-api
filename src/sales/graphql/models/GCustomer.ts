import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesCustomer } from "@sales/domain";


@ObjectType({ description: "salesCustomer" })
export class GCustomer implements ISalesCustomer {
  @Field()
  name: string;
  @Field()
  email: string;
}
