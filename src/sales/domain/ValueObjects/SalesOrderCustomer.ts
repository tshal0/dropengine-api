import { ValidationError } from "@nestjs/common";
import { CustomerDto } from "@sales/dto";
import { Result, ResultError, ValueObject } from "@shared/domain";
import { validate } from "class-validator";
export interface ISalesOrderCustomer {
  name: string;
  email: string;
}
export enum SalesOrderCustomerError {
  InvalidSalesOrderCustomer = "InvalidSalesOrderCustomer",
  CustomerValidationError = "CustomerValidationError",
}

export class InvalidSalesOrderCustomerError implements ResultError {
  public stack: string;
  public name = SalesOrderCustomerError.InvalidSalesOrderCustomer;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: CustomerDto,
    public reason: string
  ) {
    this.message = `${this.name} '${value?.name || value?.email}': ${reason}`;
  }
}
export class CustomerValidationError implements ResultError {
  public stack: string;
  public name = SalesOrderCustomerError.CustomerValidationError;
  public message: string;
  public inner: ResultError[];

  constructor(public value: ValidationError, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class SalesOrderCustomer extends ValueObject<ISalesOrderCustomer> {
  static async from(val: any): Promise<Result<SalesOrderCustomer>> {
    if ([null, undefined].includes(val)) {
      return Result.fail(SalesOrderCustomer.invalid(val));
    }
    let value: CustomerDto = new CustomerDto();
    value.email = val.email;
    value.name = val.name;
    const errors = await validate(value);
    if (errors.length) {
      return Result.fail(SalesOrderCustomer.validationErrors(errors, val));
    }
    let sid = new SalesOrderCustomer(value);
    return Result.ok(sid);
  }

  private static validationErrors(errors, val: CustomerDto): ResultError {
    return new InvalidSalesOrderCustomerError(
      errors.map((e) => SalesOrderCustomer.validationError(e)),
      val,
      `SalesOrderCustomer must be a valid Customer.`
    );
  }

  private static validationError(e: ValidationError) {
    return new CustomerValidationError(e, `'${e.property}' is invalid.`);
  }

  private static invalid(val: CustomerDto): ResultError {
    return new InvalidSalesOrderCustomerError(
      [],
      val,
      `SalesOrderCustomer must be a valid Customer, with a name and email.`
    );
  }
}
