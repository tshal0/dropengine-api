import { IAddress } from "@shared/domain";
import { SalesOrderEvent, SalesOrderEventName } from "./SalesOrderEvent";

export interface IShippingAddressChangedDetails {
  address: IAddress;
}

export class ShippingAddressChanged extends SalesOrderEvent<IShippingAddressChangedDetails> {
  constructor(aggId: string, details: IShippingAddressChangedDetails) {
    super(
      aggId,
      ShippingAddressChanged.name,
      SalesOrderEventName.ShippingAddressChanged,
      details
    );
  }
}
