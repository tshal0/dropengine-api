import { EditShippingAddressDto } from "@sales/api";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export class ShippingAddressChanged extends SalesOrderEvent<EditShippingAddressDto> {
  constructor(aggId: string, details: EditShippingAddressDto) {
    super(
      aggId,
      ShippingAddressChanged.name,
      SalesOrderEventName.ShippingAddressChanged,
      details
    );
  }
}
