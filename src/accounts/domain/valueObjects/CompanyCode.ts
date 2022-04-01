import { Result, ResultError, ValueObject } from "@shared/domain";
import { isNull } from "lodash";

export enum CompanyCodeError {
  InvalidCompanyCode = "InvalidCompanyCode",
}

export class InvalidCompanyCode implements ResultError {
  public stack: string;
  public name = CompanyCodeError.InvalidCompanyCode;
  public message: string;
  public inner: ResultError[];
  constructor(public value: string, public reason: string) {
    this.message = `${CompanyCodeError.InvalidCompanyCode} '${value}': ${reason}`;
  }
}
//TODO: CompanyCode cant have spaces. Must be alphanumeric, with underscores.
export class CompanyCode extends ValueObject<string> {
  static from(value: string): Result<CompanyCode> {
    if (isNull(value)) {
      return Result.fail(
        new InvalidCompanyCode(value, `Name can not be null.`)
      );
    }
    if (!value?.length) {
      return Result.fail(
        new InvalidCompanyCode(value, `Name can not be empty.`)
      );
    }
    return Result.ok(new CompanyCode({ value }));
  }
}
