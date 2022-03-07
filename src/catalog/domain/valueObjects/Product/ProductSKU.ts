import { ValueObject } from "@shared/domain";


export class ProductSKU extends ValueObject<string> {
  /**
   *Returns new ProductSKU instance with value generated from Product
   * @static
   * @return {*} {ProductSKU}
   * @memberof ValueObject
   *
   */
  static generate(): ProductSKU {
    return new ProductSKU({ value: "" });
  }

  static from(value: string): ProductSKU {
    return new ProductSKU({ value });
  }
}
