import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesMerchant } from "@sales/domain/model/ISalesMerchant";



@ObjectType({ description: "SalesMerchant" })
export class Merchant implements ISalesMerchant {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  shopOrigin: string;
}
