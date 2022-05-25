import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";
import {
  ISalesCustomer,
  ISalesLineItemProps,
  ISalesOrderProps,
  OrderStatus,
} from "@sales/domain";
import { SalesOrderEvent } from "@sales/domain/events";
import { IAddress } from "@shared/domain";

@ObjectType({ description: "SalesOrder " })
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
  lineItems: ISalesLineItemProps[];
  customer: ISalesCustomer;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  events: SalesOrderEvent<any>[];
  @Field()
  updatedAt: Date;
  @Field()
  createdAt: Date;
}
