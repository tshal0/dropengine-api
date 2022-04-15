import { isInt, Result, ResultError, ValueObject } from "@shared/domain";
export enum QuantityError {
  InvalidQuantity = "InvalidQuantity",
}

export class InvalidQuantityError implements ResultError {
  public stack: string;
  public name = QuantityError.InvalidQuantity;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class Quantity extends ValueObject<number> {
  static from(num: any): Result<Quantity> {
    if (!isInt(num)) {
      return Result.fail(Quantity.invalid(num));
    } else if (typeof num === "string") {
      let value = parseInt(num);
      if (Quantity.validate(value)) {
        return Result.ok(new Quantity({ value }));
      }
    } else if (typeof num === "number") {
      if (Quantity.validate(num)) {
        return Result.ok(new Quantity({ value: num }));
      }
    }
    return Result.fail(Quantity.invalid(num));
  }

  private static validate(value: number) {
    return value > 0;
  }

  private static invalid(num: any): ResultError {
    return new InvalidQuantityError(
      num?.toString(),
      `Quantity must be a valid integer.`
    );
  }
}
