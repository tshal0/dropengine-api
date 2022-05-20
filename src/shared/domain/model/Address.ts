export interface IAddress {
  zip: string;
  city: string;
  name: string;
  phone: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  address3: string;
  latitude: number;
  longitude: number;
  province: string;
  lastName: string;
  firstName: string;
  countryCode: string;
  provinceCode: string;
}

export class Address implements IAddress {
  private _zip: string = "";
  private _city: string = "";
  private _countryCode: string = "";
  private _provinceCode: string = "";
  private _address1: string = "";

  private _name: string = "";

  private _province: string = "";
  private _country: string = "";

  private _address2: string = "";
  private _address3: string = "";

  private _lastName: string = "";
  private _firstName: string = "";

  private _latitude: number = 0;
  private _longitude: number = 0;
  private _company: string = "";
  private _phone: string = "";

  constructor(props?: IAddress | undefined) {
    if (props) {
      this._zip = props.zip;
      this._city = props.city;
      this._name = props.name;
      this._phone = props.phone;
      this._company = props.company;
      this._country = props.country;
      this._address1 = props.address1;
      this._address2 = props.address2;
      this._address3 = props.address3;
      this._latitude = props.latitude;
      this._longitude = props.longitude;
      this._province = props.province;
      this._lastName = props.lastName;
      this._firstName = props.firstName;
      this._countryCode = props.countryCode;
      this._provinceCode = props.provinceCode;
    }
  }

  public raw(): IAddress {
    let props: IAddress = {
      zip: this._zip,
      city: this._city,
      name: this._name,
      phone: this._phone,
      company: this._company,
      country: this._country,
      address1: this._address1,
      address2: this._address2,
      address3: this._address3,
      latitude: this._latitude,
      longitude: this._longitude,
      province: this._province,
      lastName: this._lastName,
      firstName: this._firstName,
      countryCode: this._countryCode,
      provinceCode: this._provinceCode,
    };
    return props;
  }

  public set zip(val: any) {
    this._zip = val;
  }
  public get zip() {
    return this._zip;
  }
  public set city(val: any) {
    this._city = val;
  }
  public get city() {
    return this._city;
  }
  public set countryCode(val: any) {
    this._countryCode = val;
  }
  public get countryCode() {
    return this._countryCode;
  }
  public set provinceCode(val: any) {
    this._provinceCode = val;
  }
  public get provinceCode() {
    return this._provinceCode;
  }
  public set address1(val: any) {
    this._address1 = val;
  }
  public get address1() {
    return this._address1;
  }
  public set address2(val: any) {
    this._address2 = val;
  }
  public get address2() {
    return this._address2;
  }
  public set address3(val: any) {
    this._address3 = val;
  }
  public get address3() {
    return this._address3;
  }

  public set country(val: any) {
    this._country = val;
  }
  public get country() {
    return this._country;
  }

  public set province(val: any) {
    this._province = val;
  }
  public get province() {
    return this._province;
  }
  public set name(val: any) {
    this._name = val;
  }
  public get name() {
    return this._name;
  }
  public set phone(val: any) {
    this._phone = val;
  }
  public get phone() {
    return this._phone;
  }

  public set lastName(val: any) {
    this._lastName = val;
  }
  public get lastName() {
    return this._lastName;
  }
  public set firstName(val: any) {
    this._firstName = val;
  }
  public get firstName() {
    return this._firstName;
  }
  public set company(val: any) {
    this._company = val;
  }
  public get company() {
    return this._company;
  }
  public set latitude(val: any) {
    this._latitude = val;
  }
  public get latitude() {
    return this._latitude;
  }
  public set longitude(val: any) {
    this._longitude = val;
  }
  public get longitude() {
    return this._longitude;
  }
}
