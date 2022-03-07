import { Result, ResultError, ValueObject } from "@shared/domain";

import { isFinite } from "lodash";
export enum VariantSKUError {
  InvalidVariantSKU = "InvalidVariantSKU",
}

export class InvalidVariantSKU implements ResultError {
  public stack: string;
  public name = VariantSKUError.InvalidVariantSKU;
  public message: string;
  public inner: ResultError[];

  constructor(public value: string, public reason: string) {
    this.message = `${VariantSKUError.InvalidVariantSKU} '${value}': ${reason}`;
  }
}

export class VariantSKU extends ValueObject<string> {
  /**
   *Returns new ProductSku instance with value generated from Product
   * @static
   * @return {*} {ProductSku}
   * @memberof ValueObject
   *
   */
  static generate(): VariantSKU {
    return new VariantSKU({ value: "NA-000-00-Size-Color" });
  }

  static from(value: string): Result<VariantSKU> {
    if ([null, undefined].includes(value)) {
      return Result.fail(
        new InvalidVariantSKU(value, `Expected valid SKU, received '${value}'.`)
      );
    }
    if ([""].includes(value)) {
      return Result.fail(
        new InvalidVariantSKU(
          value,
          `Expected non-empty SKU, received '${value}'.`
        )
      );
    }
    let skuArray = value?.split("-");
    const expectedSkuElements = 5;
    if (!skuArray?.length || skuArray?.length < expectedSkuElements) {
      return Result.fail(
        new InvalidVariantSKU(
          value,
          `Expected at least ${expectedSkuElements} SKU elements, received ${skuArray?.length}.`
        )
      );
    }
    let val = new VariantSKU({ value });
    return Result.ok(val);
  }
}
