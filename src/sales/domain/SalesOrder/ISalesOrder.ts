import { AccountId } from "@accounts/domain/valueObjects/AccountId";
import { LineItem, ILineItemProps } from "../LineItem";

import { ISalesOrderAddress, SalesOrderAddress } from "./SalesOrderAddress";
import { ISalesOrderCustomer, SalesOrderCustomer } from "./SalesOrderCustomer";
import { SalesOrderDate } from "./SalesOrderDate";
import { SalesOrderID } from "./SalesOrderID";
import { SalesOrderNumber } from "./SalesOrderNumber";
import { OrderStatus, SalesOrderStatus } from "./SalesOrderStatus";
export interface ISalesOrderFlag {
  type: string;
  message: string;
  details: any;
}
export interface ISalesOrderEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: Date;
  details: any;
}

export interface ISalesOrderProps {
  id?: string | undefined;
  accountId: string;
  orderName?: string;
  orderNumber: number;
  orderDate: Date;
  orderStatus: OrderStatus;
  lineItems: ILineItemProps[];
  customer: ISalesOrderCustomer;
  shippingAddress: ISalesOrderAddress;
  billingAddress: ISalesOrderAddress;

  updatedAt?: Date | undefined;
  createdAt?: Date | undefined;
}
export interface ISalesOrder {
  id: SalesOrderID;
  accountId: AccountId;
  orderName: string;
  orderNumber: SalesOrderNumber;
  orderStatus: SalesOrderStatus;
  orderDate: SalesOrderDate;
  lineItems: LineItem[];
  customer: SalesOrderCustomer;
  shippingAddress: SalesOrderAddress;
  billingAddress: SalesOrderAddress;
  updatedAt: Date;
  createdAt: Date;
}
