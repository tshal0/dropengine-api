import { IAddress } from "@shared/domain";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddressDto {
  constructor(props: IAddress) {
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
  phone: string;
  company: string;
  country: string;
  @IsString()
  @IsNotEmpty()
  address1: string;
  @IsString()
  @IsOptional()
  address2: string;
  address3: string;
  latitude: number;
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
