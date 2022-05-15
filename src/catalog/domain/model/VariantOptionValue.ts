export interface IVariantOptionValue {
  value: string;
  enabled: boolean;
}

export class VariantOptionValue implements IVariantOptionValue {
  constructor(props?: IVariantOptionValue | undefined) {
    if (props) {
      this._value = props.value;
      this._enabled = props.enabled;
    }
  }
  public raw(): IVariantOptionValue {
    return { enabled: this._enabled, value: this._value };
  }
  private _value: string = "";
  private _enabled: boolean = false;

  public set value(val: any) {
    this._value = val;
  }
  public set enabled(val: any) {
    this._enabled = val;
  }
  public get value() {
    return this._value;
  }
  public get enabled() {
    return this._enabled;
  }
}
