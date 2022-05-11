import { CreateOrderDto } from "@sales/dto/CreateOrderDto";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class SalesOrderPlaced extends SalesOrderEvent<CreateOrderDto> {
  constructor(aggId: string, details: CreateOrderDto) {
    super(
      aggId,
      SalesOrderPlaced.name,
      SalesOrderEventName.SalesOrderPlaced,
      details
    );
  }
}
