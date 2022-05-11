import { DomainEvent } from "@shared/domain/events/DomainEvent";
export enum AggregateType {
  SalesOrder = "SalesOrder",
}
export enum EventSchemaVersion {
  v1 = "v1",
}
export enum SalesOrderEventName {
  SalesOrderPlaced = "Sales.OrderPlaced",
  SalesOrderCanceled = "Sales.OrderCanceled",
  SalesOrderShipmentAdded = "Sales.ShipmentAdded",
}
export class SalesOrderEvent<T> extends DomainEvent<T> {
  constructor(
    aggId: string,
    type: string,
    name: SalesOrderEventName,
    details: T,
    version?: EventSchemaVersion | undefined
  ) {
    super(
      AggregateType.SalesOrder,
      aggId,
      type,
      name,
      details,
      version || EventSchemaVersion.v1
    );
  }
}
