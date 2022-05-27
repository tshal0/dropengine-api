
export interface ISalesMerchant {
  email: string;
  name: string;
  shopOrigin: string;
}

export class SalesMerchant {
  private _email: string = "";
  private _name: string = "";
  private _shopOrigin: string = "";
  constructor(props?: ISalesMerchant | undefined) {
    if (props) {
      this._email = props.email || "";
      this._name = props.name || "";
      this._shopOrigin = props.shopOrigin || "";
    }
  }
  public raw(): ISalesMerchant {
    return {
      email: this._email,
      name: this._name,
      shopOrigin: this._shopOrigin,
    };
  }

  public set email(val: any) {
    this._email = val;
  }
  public get email() {
    return this._email;
  }
  public set name(val: any) {
    this._name = val;
  }
  public get name() {
    return this._name;
  }
  public set shopOrigin(val: any) {
    this._shopOrigin = val;
  }
  public get shopOrigin() {
    return this._shopOrigin;
  }
}
