import { ValueObject, Result, ResultError } from "@shared/domain";
import { isNaN } from "lodash";

export enum ProductPricingTierError {
  InvalidPricingTier = "InvalidPricingTier",
  MissingPricingTier = "MissingPricingTier",
}

export class InvalidPricingTierError implements ResultError {
  public stack: string;
  public name = ProductPricingTierError.InvalidPricingTier;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}
export class MissingPricingTierError implements ResultError {
  public stack: string;
  public name = ProductPricingTierError.MissingPricingTier;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${this.name} '${value}': ${reason}`;
  }
}

export class PricingTier extends ValueObject<string> {
  static from(value: string): Result<PricingTier> {
    if ([null, undefined, ""].includes(value)) {
      return Result.fail(
        new MissingPricingTierError(
          value,
          `PricingTier should not be null, undefined, or empty.`
        )
      );
    }
    if (!["1", "2", "3"].includes(value)) {
      return Result.fail(
        new InvalidPricingTierError(
          value,
          `PricingTier should be one of '1', '2', or '3'.`
        )
      );
    }

    return Result.ok(new PricingTier({ value }));
  }
}
