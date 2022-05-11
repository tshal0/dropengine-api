import { DomainEvent } from "@shared/domain/events/BaseDomainEvent";
export enum AggregateType {
  SalesOrder = "SalesOrder",
}

export enum SalesOrderEventType {
  SalesOrderPlaced = "SalesOrderPlaced",
}
export enum SalesOrderEventName {
  SalesOrderPlaced = "sales.order.placed",
  SalesOrderCanceled = "sales.order.canceled",
}
export class SalesOrderEvent<T> extends DomainEvent<T> {
  constructor(
    aggId: string,
    type: string,
    name: SalesOrderEventName,
    details: T
  ) {
    super(AggregateType.SalesOrder, aggId, type, name, details);
  }
}


