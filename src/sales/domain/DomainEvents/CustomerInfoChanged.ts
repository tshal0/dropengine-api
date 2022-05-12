import { EditCustomerDto } from "@sales/api";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";


export class CustomerInfoChanged extends SalesOrderEvent<EditCustomerDto> {
  constructor(aggId: string, details: EditCustomerDto) {
    super(
      aggId,
      CustomerInfoChanged.name,
      SalesOrderEventName.CustomerInfoChanged,
      details
    );
  }
}
