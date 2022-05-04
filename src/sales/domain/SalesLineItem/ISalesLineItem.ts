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
  id?: string | undefined;
  lineNumber: number;
  quantity: number;
  variant: ISalesVariantProps;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalesLineItem {
  id: LineItemID;
  lineNumber: LineNumber;
  quantity: Quantity;
  variant: SalesVariant;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
  createdAt: Date;
  updatedAt: Date;
}
