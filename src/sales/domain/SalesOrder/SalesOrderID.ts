import { Result, ResultError, ValueObject } from "@shared/domain";
import mongoose, { Types } from "mongoose";
export enum SalesOrderIDError {
  InvalidSalesOrderID = "InvalidSalesOrderID",
}

export class InvalidSalesOrderIDError implements ResultError {
  public stack: string;
  public name = SalesOrderIDError.InvalidSalesOrderID;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class SalesOrderID extends ValueObject<string> {
  static from(id: Types.ObjectId | string): Result<SalesOrderID> {
    if ([null, undefined].includes(id)) {
      return Result.ok(new SalesOrderID({ value: null }));
    } else if (typeof id === "string") {
      if (mongoose.Types.ObjectId.isValid(id)) {
        let value = new mongoose.Types.ObjectId(id).toString();
        let sid = new SalesOrderID({ value });
        return Result.ok(sid);
      }
    } else if (id.toString) {
      let val = id.toString();

      if (mongoose.Types.ObjectId.isValid(val)) {
        let value = new mongoose.Types.ObjectId(val).toString();
        let sid = new SalesOrderID({ value });
        return Result.ok(sid);
      }
    }
    return Result.fail(SalesOrderID.invalid(id));
  }

  private static invalid(id: any): ResultError {
    return new InvalidSalesOrderIDError(
      `${id}`,
      `SalesOrderID must be a valid ObjectId.`
    );
  }
}
