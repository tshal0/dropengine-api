import { Result, ResultError, ValueObject } from "@shared/domain";

export enum OrderStatus {
  OPEN = "OPEN",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
  FULFILLED = "FULFILLED",
  ARCHIVED = "ARCHIVED",
}
export enum SalesOrderStatusError {
  InvalidSalesOrderStatus = "InvalidSalesOrderStatus",
}

export class InvalidSalesOrderStatusError implements ResultError {
  public stack: string;
  public name = SalesOrderStatusError.InvalidSalesOrderStatus;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class SalesOrderStatus extends ValueObject<OrderStatus> {
  static from(val: any): Result<SalesOrderStatus> {
    if (val in OrderStatus) {
      let sval = new SalesOrderStatus({ value: OrderStatus[val] });
      return Result.ok(sval);
    } else if ([null, undefined].includes(val)) {
      return Result.fail(SalesOrderStatus.invalid(val));
    }
    return Result.fail(SalesOrderStatus.invalid(val));
  }

  private static invalid(val: any): ResultError {
    return new InvalidSalesOrderStatusError(
      `${val}`,
      `SalesOrderStatus must be a valid OrderStatus (OPEN, COMPLETE, CANCELED, FULFILLED, ARCHIVED).`
    );
  }
}
