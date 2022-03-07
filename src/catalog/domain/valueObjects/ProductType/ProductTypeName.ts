import { Result, ResultError, ValueObject } from "@shared/domain";
import { isNull } from "lodash";

export enum ProductTypeNameError {
  InvalidProductTypeName = "InvalidProductTypeName",
}

export class InvalidProductTypeName implements ResultError {
  public stack: string;
  public name = ProductTypeNameError.InvalidProductTypeName;
  public message: string;
  public inner: ResultError[];
  constructor(public value: string, public reason: string) {
    this.message = `${ProductTypeNameError.InvalidProductTypeName} '${value}': ${reason}`;
  }
}

export class ProductTypeName extends ValueObject<string> {
  static from(value: string): Result<ProductTypeName> {
    if (isNull(value)) {
      return Result.fail(
        new InvalidProductTypeName(value, `Name can not be null.`)
      );
    }
    if (!value?.length) {
      return Result.fail(
        new InvalidProductTypeName(value, `Name can not be empty.`)
      );
    }
    return Result.ok(new ProductTypeName({ value }));
  }
}
