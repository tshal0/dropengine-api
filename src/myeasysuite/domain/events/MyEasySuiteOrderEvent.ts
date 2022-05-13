import { DomainEvent } from "@shared/domain/events/DomainEvent";
export enum AggregateType {
  MyEasySuiteOrder = "MyEasySuiteOrder",
}
export enum EventSchemaVersion {
  v1 = "v1",
}
export enum MyEasySuiteOrderEventName {
  OrderPlaced = "MyEasySuite.OrderPlaced",
  OrderCanceled = "MyEasySuite.OrderCanceled",
  ShipmentAdded = "MyEasySuite.ShipmentAdded",
  PersonalizationChanged = "MyEasySuite.PersonalizationChanged",
  ShippingAddressChanged = "MyEasySuite.ShippingAddressChanged",
  CustomerInfoChanged = "MyEasySuite.CustomerInfoChanged",
}
export class MyEasySuiteOrderEvent<T> extends DomainEvent<T> {
  constructor(
    aggId: string,
    type: string,
    name: MyEasySuiteOrderEventName,
    details: T,
    version?: EventSchemaVersion | undefined
  ) {
    super(
      AggregateType.MyEasySuiteOrder,
      aggId,
      type,
      name,
      details,
      version || EventSchemaVersion.v1
    );
  }
}
