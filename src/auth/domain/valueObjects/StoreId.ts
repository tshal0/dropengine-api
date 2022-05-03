import { Result, ResultError, UUID, ValueObject } from "@shared/domain";
export enum StoreIdError {
  InvalidStoreId = "InvalidStoreId",
}

export class InvalidStoreIdError implements ResultError {
  public stack: string;
  public name = StoreIdError.InvalidStoreId;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class StoreId extends UUID {
  static fromId(id: UUID) {
    return Result.ok(new StoreId(id.value()));
  }
  static from(value: any): Result<StoreId> {
    try {
      if (value instanceof UUID) {
        return Result.ok(new StoreId(value.value()));
      }
      let result = UUID.from(value);
      if (result.isFailure) {
        return Result.fail(
          new InvalidStoreIdError(value, `StoreId must be a valid UUID.`)
        );
      }
      let id = new StoreId(value);
      return Result.ok(id);
    } catch (error) {
      return Result.fail(
        new InvalidStoreIdError(value, `StoreId must be a valid UUID.`)
      );
    }
  }
  /**
   *Returns new ID instance with randomly generated ID value
   * @static
   * @return {*}  {StoreId}
   * @memberof StoreId
   */
  static generate(): StoreId {
    return new StoreId(UUID.generate().value());
  }
}
