import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class SalesOrderCanceled extends SalesOrderEvent<any> {
  constructor(aggId: string, details: any) {
    super(
      aggId,
      SalesOrderCanceled.name,
      SalesOrderEventName.OrderCanceled,
      details
    );
  }
}
