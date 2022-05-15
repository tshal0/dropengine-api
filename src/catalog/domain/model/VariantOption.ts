export interface IVariantOption {
  name: string;
  value: string;
  enabled: boolean;
}
export class VariantOption implements IVariantOption {
  constructor(props?: IVariantOption | undefined) {
    if (props) {
      this._enabled = props.enabled;
      this._name = props.name;
      this._value = props.value;
    }
  }
  raw(): IVariantOption {
    return {
      enabled: this._enabled,
      name: this._name,
      value: this._value,
    };
  }
  private _name: string = "";
  private _value: string = "";
  private _enabled: boolean = false;

  public set name(val: any) {
    this._name = val;
  }
  public set value(val: any) {
    this._value = val;
  }
  public set enabled(val: any) {
    this._enabled = val;
  }

  public get name() {
    return this._name;
  }
  public get value() {
    return this._value;
  }
  public get enabled() {
    return this._enabled;
  }
}
