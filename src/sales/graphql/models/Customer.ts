import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesCustomer } from "@sales/domain";

@ObjectType({ description: "SalesCustomer" })
export class Customer implements ISalesCustomer {
  @Field()
  name: string;
  @Field()
  email: string;
}
