export interface IVariantOption {
  name: string;
  value: string;
}
export class VariantOption implements IVariantOption {
  constructor(props?: IVariantOption | undefined) {
    if (props) {
      this._name = props.name;
      this._value = props.value;
    }
  }
  raw(): IVariantOption {
    return {
      name: this._name,
      value: this._value,
    };
  }
  private _name: string = "";
  private _value: string = "";

  public set name(val: any) {
    this._name = val;
  }
  public set value(val: any) {
    this._value = val;
  }

  public get name() {
    return this._name;
  }
  public get value() {
    return this._value;
  }
}
