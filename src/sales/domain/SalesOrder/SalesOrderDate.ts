import {
  DateValueObject,
  isInt,
  Result,
  ResultError,
  ValueObject,
} from "@shared/domain";
import { isValidDate } from "@shared/utils";
export enum SalesOrderDateError {
  InvalidSalesOrderDate = "InvalidSalesOrderDate",
}

export class InvalidSalesOrderDateError implements ResultError {
  public stack: string;
  public name = SalesOrderDateError.InvalidSalesOrderDate;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class SalesOrderDate extends ValueObject<Date> {
  static from(val: any): Result<SalesOrderDate> {
    if (isValidDate(val)) {
      let vo = new SalesOrderDate({ value: val });
      return Result.ok(vo);
    }
    return Result.fail(SalesOrderDate.invalid(val));
  }

  private static invalid(date: any): ResultError {
    return new InvalidSalesOrderDateError(
      date,
      `SalesOrderDate must be a valid Date.`
    );
  }
}
