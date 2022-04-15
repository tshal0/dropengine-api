import { ISalesOrderAddress } from "@sales/domain";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddressDto {
  constructor(props: ISalesOrderAddress) {
    this.zip = props?.zip;
    this.city = props?.city;
    this.name = props?.name;
    this.phone = props?.phone;
    this.company = props?.company;
    this.country = props?.country;
    this.address1 = props?.address1;
    this.address2 = props?.address2;
    this.address3 = props?.address3;
    this.latitude = props?.latitude;
    this.longitude = props?.longitude;
    this.province = props?.province;
    this.lastName = props?.lastName;
    this.firstName = props?.firstName;
    this.countryCode = props?.countryCode;
    this.provinceCode = props?.provinceCode;
  }
  @IsNotEmpty()
  @IsString()
  zip: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  phone: string;
  @IsString()
  company: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsString()
  @IsNotEmpty()
  address1: string;
  @IsString()
  address2: string;
  @IsString()
  address3: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
  @IsString()
  @IsNotEmpty()
  province: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  firstName: string;
  @IsString()
  @IsNotEmpty()
  countryCode: string;
  @IsString()
  @IsNotEmpty()
  provinceCode: string;
}
