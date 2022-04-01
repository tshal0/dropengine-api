import { Result, ResultError, UUID, ValueObject } from "@shared/domain";
export enum AccountIdError {
  InvalidAccountId = "InvalidAccountId",
}

export class InvalidAccountIdError implements ResultError {
  public stack: string;
  public name = AccountIdError.InvalidAccountId;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class AccountId extends UUID {
  static fromId(id: UUID) {
    return Result.ok(new AccountId(id.value()));
  }
  static from(value: any): Result<AccountId> {
    try {
      if (value instanceof UUID) {
        return Result.ok(new AccountId(value.value()));
      }
      let result = UUID.from(value);
      if (result.isFailure) {
        return Result.fail(
          new InvalidAccountIdError(value, `AccountId must be a valid UUID.`)
        );
      }
      let id = new AccountId(value);
      return Result.ok(id);
    } catch (error) {
      return Result.fail(
        new InvalidAccountIdError(value, `AccountId must be a valid UUID.`)
      );
    }
  }
}
