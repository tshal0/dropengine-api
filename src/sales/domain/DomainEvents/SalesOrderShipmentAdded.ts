import { AddShipmentDto } from "@sales/dto/AddShipmentDto";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class SalesOrderShipmentAdded extends SalesOrderEvent<AddShipmentDto> {
  constructor(aggId: string, details: AddShipmentDto) {
    super(
      aggId,
      SalesOrderShipmentAdded.name,
      SalesOrderEventName.SalesOrderShipmentAdded,
      details
    );
  }
}
