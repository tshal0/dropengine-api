import { Result, ResultError, UUID, ValueObject } from "@shared/domain";

export enum ProductTypeUUIDError {
  InvalidProductTypeUUID = "InvalidProductTypeUUID",
}

export class InvalidProductTypeUUIDError implements ResultError {
  public stack: string;
  public name = ProductTypeUUIDError.InvalidProductTypeUUID;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class ProductTypeUUID extends UUID {
  static fromId(id: UUID) {
    return Result.ok(new ProductTypeUUID(id.value()));
  }
  static from(value: any): Result<ProductTypeUUID> {
    try {
      if (value instanceof UUID) {
        return Result.ok(new ProductTypeUUID(value.value()));
      }
      let result = UUID.from(value);
      if (result.isFailure) {
        return Result.fail(
          new InvalidProductTypeUUIDError(
            value,
            `ProductTypeUUID must be a valid UUID.`
          )
        );
      }
      return result;
    } catch (error) {
      return Result.fail(
        new InvalidProductTypeUUIDError(value, `ProductTypeUUID must be a valid UUID.`)
      );
    }
  }
}

