import { DomainEvent } from "@shared/domain/events/DomainEvent";
export enum AggregateType {
  SalesOrder = "SalesOrder",
}
export enum EventSchemaVersion {
  v1 = "v1",
}
export enum SalesOrderEventName {
  OrderPlaced = "Sales.OrderPlaced",
  OrderCanceled = "Sales.OrderCanceled",
  ShipmentAdded = "Sales.ShipmentAdded",
  PersonalizationChanged = "Sales.PersonalizationChanged",
  ShippingAddressChanged = "Sales.ShippingAddressChanged",
  CustomerInfoChanged = "Sales.CustomerInfoChanged",
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
