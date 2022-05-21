import { OrderFlag } from "./OrderFlag";
import { IPersonalization, Personalization } from "./Personalization";
import { ISalesVariantProps, SalesVariant } from "./SalesVariant";

export interface ISalesLineItemProps {
  lineNumber: number;
  quantity: number;
  variant: ISalesVariantProps;
  personalization: IPersonalization[];
  flags: OrderFlag[];
}
export interface ISalesLineItem {
  lineNumber: number;
  quantity: number;
  variant: SalesVariant;
  personalization: Personalization[];
  flags: OrderFlag[];
}
export class SalesLineItem implements ISalesLineItem {
  private _lineNumber: number = 0;
  private _quantity: number = 0;
  private _variant: SalesVariant = new SalesVariant();
  private _personalization: Personalization[] = [];
  private _flags: OrderFlag[] = [];
  constructor(props?: ISalesLineItemProps | undefined) {
    if (props) {
      this._lineNumber = props.lineNumber;
      this._quantity = props.quantity;
      this._variant = new SalesVariant(props.variant);

      this._personalization = props.personalization?.length
        ? props.personalization.map((p) => new Personalization(p))
        : [];
      this._flags = props.flags;
    }
  }
  public raw(): ISalesLineItemProps {
    return {
      flags: this._flags,
      lineNumber: this._lineNumber,
      quantity: this._quantity,
      variant: this._variant.raw(),
      personalization: this._personalization.map((p) => p.raw()),
    };
  }

  public set lineNumber(val: any) {
    this._lineNumber = val;
  }
  public get lineNumber() {
    return this._lineNumber;
  }
  public set quantity(val: any) {
    this._quantity = val;
  }
  public get quantity() {
    return this._quantity;
  }
  public set personalization(val: Personalization[]) {
    this._personalization = val.map((v) => new Personalization(v));
  }
  public get personalization(): Personalization[] {
    return this._personalization;
  }
  public set variant(val: any) {
    this._variant = val;
  }
  public get variant() {
    return this._variant;
  }
  public set flags(val: any) {
    this._flags = val;
  }
  public get flags() {
    return this._flags;
  }
}
