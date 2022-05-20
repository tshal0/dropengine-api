export class Dimension implements IDimension {
  private _dimension: number = 0;
  private _units: "in" | "mm"  = "mm";
  constructor(props?: IDimension | undefined) {
    if (props) {
      this._dimension = props.dimension;
      this._units = props.units;
    }
  }
  public raw(): IDimension {
    return { dimension: this._dimension, units: this._units };
  }

  public get dimension() {
    return this._dimension;
  }
  public get units() {
    return this._units;
  }
}
export interface IDimension {
  dimension: number;
  units: "in" | "mm" ;
}
