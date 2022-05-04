import { isInt, Result, ResultError, ValueObject } from "@shared/domain";
export enum SalesOrderNumberError {
  InvalidSalesOrderNumber = "InvalidSalesOrderNumber",
}

export class InvalidSalesOrderNumberError implements ResultError {
  public stack: string;
  public name = SalesOrderNumberError.InvalidSalesOrderNumber;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class SalesOrderNumber extends ValueObject<number> {
  static from(num: any): Result<SalesOrderNumber> {
    if (!isInt(num)) {
      return Result.fail(SalesOrderNumber.invalid(num));
    } else if (typeof num === "string") {
      let value = parseInt(num);
      if (SalesOrderNumber.validate(value)) {
        return Result.ok(new SalesOrderNumber({ value }));
      }
    } else if (typeof num === "number") {
      if (SalesOrderNumber.validate(num)) {
        return Result.ok(new SalesOrderNumber({ value: num }));
      }
    }
    return Result.fail(SalesOrderNumber.invalid(num));
  }

  private static validate(value: number) {
    return value > 0;
  }

  private static invalid(num: any): ResultError {
    return new InvalidSalesOrderNumberError(
      num,
      `SalesOrderNumber must be a valid integer.`
    );
  }
}
