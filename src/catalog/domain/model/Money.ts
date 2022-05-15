export interface IMoney {
  total: number;
  currency: "USD";
}
export class Money implements IMoney {
  private _total: number = 0;
  private _currency: "USD" = "USD";

  constructor(props?: IMoney | undefined) {
    if (props) {
      this._currency = props.currency;
      this._total = props.total;
    }
  }

  public raw(): IMoney {
    return { currency: this._currency, total: this._total };
  }

  public set total(val: any) {
    this._total = val;
  }
  public set currency(val: any) {
    this._currency = val;
  }

  public get total() {
    return this._total;
  }
  public get currency() {
    return this._currency;
  }
}
