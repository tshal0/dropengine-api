import { AddShipmentDto } from "@sales/dto/AddShipmentDto";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class ShipmentAdded extends SalesOrderEvent<AddShipmentDto> {
  constructor(aggId: string, details: AddShipmentDto) {
    super(
      aggId,
      ShipmentAdded.name,
      SalesOrderEventName.ShipmentAdded,
      details
    );
  }
}
