import { unwatchFile } from "fs";
import { isInteger } from "lodash";
import { Result, ResultError } from "../Result";
import { ValueObject } from "./ValueObject";
export enum NumberIdError {
  InvalidNumberId = "InvalidNumberID",
}

export class InvalidNumberIdError implements ResultError {
  public stack: string;
  public name = NumberIdError.InvalidNumberId;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class NumberID extends ValueObject<number> {
  protected constructor(value: number) {
    super({ value });
  }

  static from(value: any): Result<NumberID> {
    if ([null, undefined].includes(value)) {
      return Result.ok(new NumberID(value));
    }
    if (!NumberID.validate(value)) {
      return Result.fail(
        new InvalidNumberIdError(value, `NumberID must be a valid number.`)
      );
    } else {
      if (typeof value == "string") {
        return Result.ok(new NumberID(parseInt(value)));
      } else if (typeof value == "number") {
        return Result.ok(new NumberID(value));
      }
      return Result.fail(
        new InvalidNumberIdError(
          value,
          `NumberID must be a string or number that can be converted to an integer.`
        )
      );
    }
  }
  static validate(value: any): boolean {
    return isInt(value);
  }
}

export function isInt(value: any) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}
