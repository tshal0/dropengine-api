import { NumberID, Result, ResultError, ValueObject } from "@shared/domain";

export enum ProductNIDError {
  InvalidProductNumberId = "InvalidProductNumberId",
}

export class InvalidProductNIDError implements ResultError {
  public stack: string;
  public name = ProductNIDError.InvalidProductNumberId;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class ProductNID extends NumberID {
  static fromId(id: NumberID) {
    return Result.ok(new ProductNID(id.value()));
  }
  static from(value: any): Result<ProductNID> {
    try {
      if ([null, undefined, ""].includes(value)) {
        return Result.ok(new ProductNID(null));
      }
      if (value instanceof NumberID) {
        return Result.ok(new ProductNID(value.value()));
      }
      let result = NumberID.from(value);
      return result;
    } catch (error) {
      return Result.fail(
        new InvalidProductNIDError(
          value,
          `ProductNumberId must be a valid NumberId.`
        )
      );
    }
  }
}
