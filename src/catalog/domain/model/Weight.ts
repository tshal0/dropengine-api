export class Weight implements IWeight {
  constructor(props?: IWeight | undefined) {
    if (props) {
      this._dimension = props.dimension;
      this._units = props.units;
    }
  }
  private _dimension: number = 0;
  private _units: "oz" | "g" = "g";
  raw(): IWeight {
    return { dimension: this._dimension, units: this._units };
  }

  public get dimension() {
    return this._dimension;
  }
  public get units() {
    return this._units;
  }
}
export interface IWeight {
  dimension: number;
  units: "oz" | "g";
}
