import { Result, ResultError, UUID, ValueObject } from "@shared/domain";
export enum ProductVariantUUIDError {
  InvalidProductVariantUUID = "InvalidProductVariantUUID",
}

export class InvalidProductVariantUUIDError implements ResultError {
  public stack: string;
  public name = ProductVariantUUIDError.InvalidProductVariantUUID;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class ProductVariantUUID extends UUID {
  static fromId(id: UUID) {
    return Result.ok(new ProductVariantUUID(id.value()));
  }
  static from(value: any): Result<ProductVariantUUID> {
    try {
      if (value instanceof UUID) {
        return Result.ok(new ProductVariantUUID(value.value()));
      }
      let result = UUID.from(value);
      if (result.isFailure) {
        return Result.fail(
          new InvalidProductVariantUUIDError(
            value,
            `ProductVariantUUID must be a valid UUID.`
          )
        );
      }
      return result;
    } catch (error) {
      return Result.fail(
        new InvalidProductVariantUUIDError(value, `ProductVariantUUID must be a valid UUID.`)
      );
    }
  }
}
