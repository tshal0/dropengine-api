export interface ISalesCustomer {
  name: string;
  email: string;
}

export class SalesCustomer implements ISalesCustomer {
  private _name: string = "";
  private _email: string = "";
  constructor(props?: ISalesCustomer | undefined) {
    if (props) {
      this._email = props.email;
      this._name = props.name;
    }
  }
  public raw(): ISalesCustomer {
    return { email: this._email, name: this._name };
  }

  public set name(val: any) {
    this._name = val;
  }
  public get name() {
    return this._name;
  }

  public set email(val: any) {
    this._email = val;
  }
  public get email() {
    return this._email;
  }
}
