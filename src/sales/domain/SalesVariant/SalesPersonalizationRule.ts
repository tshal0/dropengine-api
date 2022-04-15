import { Result, ResultError, ValueObject } from "@shared/domain";
export interface ISalesPersonalizationRule {
  [prop: string]: any;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: string;
  maxLength: number;
  pattern: string;
  options: string;
}
export enum SalesPersonalizationRuleError {
  InvalidSalesPersonalizationRule = "InvalidSalesPersonalizationRule",
}

export class InvalidSalesPersonalizationRuleError implements ResultError {
  public stack: string;
  public name = SalesPersonalizationRuleError.InvalidSalesPersonalizationRule;
  public message: string;
  public inner: ResultError[];

  constructor(public value: any, public reason: string) {
    this.message = `${this.name} '${value?.label}': ${reason}`;
  }
}
export class SalesPersonalizationRule extends ValueObject<ISalesPersonalizationRule> {
  static from(val: any): Result<SalesPersonalizationRule> {
    if ([null, undefined].includes(val)) {
      return Result.fail(SalesPersonalizationRule.invalid(val));
    } else if (SalesPersonalizationRule.validate(val)) {
      let value: ISalesPersonalizationRule = {
        name: val.name,
        label: val.label,
        placeholder: val.placeholder,
        required: val.required,
        type: val.type,
        maxLength: val?.maxLength,
        pattern: val?.pattern,
        options: val?.options,
      };
      let sid = new SalesPersonalizationRule(value);
      return Result.ok(sid);
    } else {
      return Result.fail(SalesPersonalizationRule.invalid(val));
    }
  }
  private static validate(val: ISalesPersonalizationRule) {
    if ([null, undefined, ""].includes(val.label)) {
      return false;
    }
    return true;
  }

  private static invalid(val: any): ResultError {
    return new InvalidSalesPersonalizationRuleError(
      val,
      `SalesPersonalizationRule must be a valid CustomOption.`
    );
  }
}
