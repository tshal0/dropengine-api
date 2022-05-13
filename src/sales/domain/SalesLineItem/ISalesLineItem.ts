import { SalesVariant } from "../SalesVariant";
import { ISalesVariantProps } from "../SalesVariant/ISalesVariant";
import {
  OrderFlag,
  LineItemID,
  LineNumber,
  Quantity,
  ILineItemProperty,
} from "../ValueObjects";

export interface ISalesLineItemProps {
  lineNumber: number;
  quantity: number;
  variant: ISalesVariantProps;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
}

export interface ISalesLineItem {
  lineNumber: LineNumber;
  quantity: Quantity;
  variant: SalesVariant;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
}
