import { isInt, Result, ResultError, ValueObject } from "@shared/domain";
import mongoose from "mongoose";
export enum LineNumberError {
  InvalidLineNumber = "InvalidLineNumber",
}

export class InvalidLineNumberError implements ResultError {
  public stack: string;
  public name = LineNumberError.InvalidLineNumber;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class LineNumber extends ValueObject<number> {
  static from(num: any): Result<LineNumber> {
    if (!isInt(num)) {
      return Result.fail(LineNumber.invalid(num));
    } else if (typeof num === "string") {
      let value = parseInt(num);
      if (LineNumber.validate(value)) {
        return Result.ok(new LineNumber({ value }));
      }
    } else if (typeof num === "number") {
      if (LineNumber.validate(num)) {
        return Result.ok(new LineNumber({ value: num }));
      }
    }
    return Result.fail(LineNumber.invalid(num));
  }

  private static validate(value: number) {
    return value > 0;
  }

  private static invalid(num: any): ResultError {
    return new InvalidLineNumberError(
      num?.toString(),
      `LineNumber must be a valid integer.`
    );
  }
}
