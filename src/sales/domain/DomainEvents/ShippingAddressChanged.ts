import { UpdateShippingAddressDto } from "@sales/useCases";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";


export class ShippingAddressChanged extends SalesOrderEvent<UpdateShippingAddressDto> {
  constructor(aggId: string, details: UpdateShippingAddressDto) {
    super(
      aggId,
      ShippingAddressChanged.name,
      SalesOrderEventName.ShippingAddressChanged,
      details
    );
  }
}
