import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import {
  ISalesCustomer,
  ISalesLineItemProps,
  ISalesOrderProps,
  OrderStatus,
} from "@sales/domain";
import { SalesOrderEvent } from "@sales/domain/events";
import { IAddress } from "@shared/domain";
import { GAddress } from "./GAddress";
import { GCustomer } from "./GCustomer";
import { GSalesLineItem } from "./GSalesLineItem";

@ObjectType({ description: "salesOrder " })
export class GSalesOrder implements ISalesOrderProps {
  constructor(props?: ISalesOrderProps | undefined) {
    if (props) {
      this.id = props.id;
    }
  }
  @Field((type) => ID)
  id: string;
  @Field()
  accountId: string;
  @Field()
  orderName: string;
  @Field()
  orderNumber: number;
  @Field()
  orderDate: Date;
  @Field()
  orderStatus: OrderStatus;
  @Field((type) => [GSalesLineItem])
  lineItems: GSalesLineItem[];
  @Field((type) => GCustomer)
  customer: ISalesCustomer;
  @Field((type) => GAddress)
  shippingAddress: IAddress;
  @Field((type) => GAddress)
  billingAddress: IAddress;
  events: SalesOrderEvent<any>[];
  @Field()
  updatedAt: Date;
  @Field()
  createdAt: Date;
}
