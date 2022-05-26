import { Field, ObjectType } from "@nestjs/graphql";
import { IAddress } from "@shared/domain";

@ObjectType({ description: "Address" })
export class Address implements IAddress {
  @Field()
  address1: string;
  @Field()
  zip: string;
  @Field()
  city: string;
  @Field()
  province: string;
  @Field()
  provinceCode: string;
  @Field()
  country: string;
  @Field()
  countryCode: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  company: string;

  @Field({ nullable: true })
  address2: string;
  @Field({ nullable: true })
  address3: string;
  @Field({ nullable: true })
  latitude: number;
  @Field({ nullable: true })
  longitude: number;
}
