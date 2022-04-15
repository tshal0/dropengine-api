import { Result, ResultError, ValueObject } from "@shared/domain";
export interface ISalesVariantOption {
  name: string;
  option: string;
  enabled: boolean;
}
export enum SalesVariantOptionError {
  InvalidSalesVariantOption = "InvalidSalesVariantOption",
}

export class InvalidSalesVariantOptionError implements ResultError {
  public stack: string;
  public name = SalesVariantOptionError.InvalidSalesVariantOption;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class SalesVariantOption extends ValueObject<ISalesVariantOption> {
  static from(val: any): Result<SalesVariantOption> {
    if ([null, undefined].includes(val)) {
      return Result.fail(SalesVariantOption.invalid(val));
    } else if (SalesVariantOption.validate(val)) {
      let value: ISalesVariantOption = {
        name: val.name,
        option: val.option,
        enabled: val.enabled,
      };
      let sid = new SalesVariantOption(value);
      return Result.ok(sid);
    } else {
      return Result.fail(SalesVariantOption.invalid(val));
    }
  }
  private static validate(val: any) {
    if (val?.option === null && val?.enabled === false) {
      return true;
    } else if (
      val.name?.length &&
      val.option?.length &&
      typeof val.enabled === "boolean"
    ) {
      return true;
    }
    return false;
  }

  private static invalid(val: any): ResultError {
    return new InvalidSalesVariantOptionError(
      JSON.stringify(val),
      `SalesVariantOption must be a valid VariantOption, with a name, option, and enabled status.`
    );
  }
}
