import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "SalesOrderQueryOptions" })
export class SalesOrderQueryOptions {
  constructor(props?: SalesOrderQueryOptions | undefined) {
    if (props) {
      this.merchants = props.merchants;
      this.sellers = props.sellers;
    }
  }
  @Field((type) => [String])
  merchants: string[];
  @Field((type) => [String])
  sellers: string[];
}
