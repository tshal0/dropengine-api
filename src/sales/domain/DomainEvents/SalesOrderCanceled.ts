import { CancelOrderDto } from "@sales/dto/CancelOrderDto";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class SalesOrderCanceled extends SalesOrderEvent<CancelOrderDto> {
  constructor(aggId: string, details: CancelOrderDto) {
    super(
      aggId,
      SalesOrderCanceled.name,
      SalesOrderEventName.SalesOrderCanceled,
      details
    );
  }
}
