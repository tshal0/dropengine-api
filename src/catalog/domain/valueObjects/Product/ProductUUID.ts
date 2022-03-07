import { Result, ResultError, UUID, ValueObject } from "@shared/domain";
export enum ProductUuidError {
  InvalidProductUuid = "InvalidProductUuid",
}

export class InvalidProductUuidError implements ResultError {
  public stack: string;
  public name = ProductUuidError.InvalidProductUuid;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class ProductUUID extends UUID {
  static fromId(id: UUID) {
    return Result.ok(new ProductUUID(id.value()));
  }
  static from(value: any): Result<ProductUUID> {
    try {
      if (value instanceof UUID) {
        return Result.ok(new ProductUUID(value.value()));
      }
      let result = UUID.from(value);
      if (result.isFailure) {
        return Result.fail(
          new InvalidProductUuidError(
            value,
            `ProductUUID must be a valid UUID.`
          )
        );
      }
      return result;
    } catch (error) {
      return Result.fail(
        new InvalidProductUuidError(value, `ProductUUID must be a valid UUID.`)
      );
    }
  }
}
