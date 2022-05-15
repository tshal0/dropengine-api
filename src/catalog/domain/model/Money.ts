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

  public get total() {
    return this._total;
  }
  public get currency() {
    return this._currency;
  }
}
