import { AddressDto } from "@sales/dto";
import { Result, ResultError, ValueObject } from "@shared/domain";
import { validate, ValidationError } from "class-validator";
export interface ISalesOrderAddress {
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
export enum SalesOrderAddressError {
  InvalidSalesOrderAddress = "InvalidSalesOrderAddress",
  AddressValidationError = "AddressValidationError",
}

export class InvalidSalesOrderAddressError implements ResultError {
  public stack: string;
  public name = SalesOrderAddressError.InvalidSalesOrderAddress;
  public message: string;

  constructor(
    public inner: ResultError[],
    public value: AddressDto,
    public reason: string
  ) {
    this.message = `${this.name}: ${reason}`;
  }
}
export class AddressValidationError implements ResultError {
  public stack: string;
  public name = SalesOrderAddressError.AddressValidationError;
  public message: string;
  public inner: ResultError[];

  constructor(public value: ValidationError, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class SalesOrderAddress extends ValueObject<ISalesOrderAddress> {
  static async from(val: any): Promise<Result<SalesOrderAddress>> {
    if ([null, undefined].includes(val)) {
      return Result.fail(SalesOrderAddress.invalid(val));
    } else {
      let dto = new AddressDto(val);
      let errors = await validate(dto, {
        validationError: { target: false },
      });
      if (errors.length) {
        return Result.fail(SalesOrderAddress.validationErrors(errors, val));
      }
      let sid = new SalesOrderAddress(dto);
      return Result.ok(sid);
    }
  }
  private static validationErrors(errors, val: AddressDto): ResultError {
    return new InvalidSalesOrderAddressError(
      errors.map((e) => SalesOrderAddress.validationError(e)),
      val,
      `SalesOrderAddress encountered validation errors. See inner for details.`
    );
  }

  private static validationError(e: ValidationError) {
    return new AddressValidationError(e, `'${e.property}' is invalid.`);
  }
  private static invalid(val: any): ResultError {
    return new InvalidSalesOrderAddressError(
      [],
      val,
      `SalesOrderAddress must be a valid Address.`
    );
  }
}
