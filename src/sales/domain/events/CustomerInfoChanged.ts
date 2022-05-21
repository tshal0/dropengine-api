import { ISalesCustomer } from "../model";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export interface ICustomerInfoChangedDetails {
  customer: ISalesCustomer;
}

export class CustomerInfoChanged extends SalesOrderEvent<ICustomerInfoChangedDetails> {
  constructor(aggId: string, details: ICustomerInfoChangedDetails) {
    super(
      aggId,
      CustomerInfoChanged.name,
      SalesOrderEventName.CustomerInfoChanged,
      details
    );
  }
}
