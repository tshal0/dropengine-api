import { SalesVariant } from "../SalesVariant";
import { ISalesVariantProps } from "../SalesVariant/ISalesVariant";
import { LineItemID } from "./LineItemID";
import { LineNumber } from "./LineNumber";
import { OrderFlag } from "./OrderFlag";
import { Quantity } from "./Quantity";

export interface ILineItemProperty {
  name: string;
  value: string;
}
export interface ILineItemProps {
  id?: string | undefined;
  lineNumber: number;
  quantity: number;
  variant: ISalesVariantProps;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILineItem {
  id: LineItemID;
  lineNumber: LineNumber;
  quantity: Quantity;
  variant: SalesVariant;
  personalization: ILineItemProperty[];
  flags: OrderFlag[];
  createdAt: Date;
  updatedAt: Date;
}
