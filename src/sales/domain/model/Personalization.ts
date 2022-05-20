export interface IPersonalization {
  name: string;
  value: string;
}

export class Personalization implements IPersonalization {
  private _name: string = "";
  private _value: string = "";
  constructor(props?: IPersonalization | undefined) {
    if (props) {
      this._name = props.name;
      this._value = props.value;
    }
  }
  public raw(): IPersonalization {
    return { name: this._name, value: this._value };
  }

  public set name(val: any) {
    this._name = val;
  }
  public get name() {
    return this._name;
  }
  public set value(val: any) {
    this._value = val;
  }
  public get value() {
    return this._value;
  }
}
