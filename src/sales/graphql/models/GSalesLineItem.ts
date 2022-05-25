import { Field, ObjectType } from "@nestjs/graphql";
import { ISalesLineItemProps, OrderFlag } from "@sales/domain";
import { GPersonalization } from "./GPersonalization";
import { GSalesVariant } from "./GSalesVariant";

@ObjectType({ description: "salesLineItem " })
export class GSalesLineItem implements ISalesLineItemProps {
  @Field()
  lineNumber: number;
  @Field()
  quantity: number;
  @Field((type) => GSalesVariant)
  variant: GSalesVariant;
  @Field((type) => [GPersonalization])
  personalization: GPersonalization[];
  flags: OrderFlag[];
}
