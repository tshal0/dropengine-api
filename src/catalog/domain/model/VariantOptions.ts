import { IVariantOptionValue, VariantOptionValue } from "./VariantOptionValue";

export interface IVariantOptionsProps {
  name: string;
  enabled: boolean;
  values: IVariantOptionValue[];
}
export interface IVariantOptions {
  name: string;
  enabled: boolean;
  values: VariantOptionValue[];
}

export class VariantOptions implements IVariantOptions {
  constructor(props?: IVariantOptionsProps | undefined) {
    if (props) {
      this._name = props.name;
      this._enabled = props.enabled;
      if (props.values)
        this._values = props.values.map((v) => new VariantOptionValue(v));
    }
  }
  raw(): IVariantOptionsProps {
    return {
      enabled: this._enabled,
      name: this._name,
      values: this._values.map((v) => v.raw()),
    };
  }
  private _name: string = "";
  private _enabled: boolean = false;
  private _values: VariantOptionValue[] = [];

  public set name(val: string) {
    this._name = val;
  }
  public set enabled(val: boolean) {
    this._enabled = val;
  }
  public set values(val: VariantOptionValue[]) {
    this._values = [...val];
  }

  public get name() {
    return this._name;
  }
  public get enabled() {
    return this._enabled;
  }
  public get values() {
    return this._values;
  }
}
