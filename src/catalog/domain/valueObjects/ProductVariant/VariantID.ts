import { NumberID, Result, ResultError, ValueObject } from "@shared/domain";

export enum ProductVariantNIDError {
  InvalidProductVariantNumberId = "InvalidProductVariantNumberId",
}

export class InvalidProductVariantNIDError implements ResultError {
  public stack: string;
  public name = ProductVariantNIDError.InvalidProductVariantNumberId;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class ProductVariantNID extends NumberID {
  static fromId(id: NumberID) {
    return Result.ok(new ProductVariantNID(id.value()));
  }
  static from(value: any): Result<ProductVariantNID> {
    try {
      if ([null, undefined, ""].includes(value)) {
        return Result.ok(new ProductVariantNID(null));
      }
      if (value instanceof NumberID) {
        return Result.ok(new ProductVariantNID(value.value()));
      }
      let result = NumberID.from(value);
      return result;
    } catch (error) {
      return Result.fail(
        new InvalidProductVariantNIDError(
          value,
          `ProductVariantNumberId must be a valid NumberId.`
        )
      );
    }
  }
}
