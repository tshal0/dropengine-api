import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesLineItemProps, OrderFlag } from "@sales/domain";
import { Personalization } from "./Personalization";
import { SalesVariant } from "./SalesVariant";

@ObjectType({ description: "SalesLineItem" })
export class SalesLineItem implements ISalesLineItemProps {
  @Field()
  lineNumber: number;
  @Field()
  quantity: number;
  @Field((type) => SalesVariant)
  variant: SalesVariant;
  @Field((type) => [Personalization])
  personalization: Personalization[];
  flags: OrderFlag[];
}
