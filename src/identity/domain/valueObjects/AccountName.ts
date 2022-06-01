import { Result, ResultError, ValueObject } from "@shared/domain";
import { isNull } from "lodash";

export enum AccountNameError {
  InvalidAccountName = "InvalidAccountName",
}

export class InvalidAccountName implements ResultError {
  public stack: string;
  public name = AccountNameError.InvalidAccountName;
  public message: string;
  public inner: ResultError[];
  constructor(public value: string, public reason: string) {
    this.message = `${AccountNameError.InvalidAccountName} '${value}': ${reason}`;
  }
}

export class AccountName extends ValueObject<string> {
  static from(value: string): Result<AccountName> {
    if (isNull(value)) {
      return Result.fail(
        new InvalidAccountName(value, `Name can not be null.`)
      );
    }
    if (!value?.length) {
      return Result.fail(
        new InvalidAccountName(value, `Name can not be empty.`)
      );
    }
    return Result.ok(new AccountName({ value }));
  }
}
