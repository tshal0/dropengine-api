import { ValueObject } from "@shared/domain";

export class ProductSvg extends ValueObject<string> {
  static from(value: string): ProductSvg {
    return new ProductSvg({ value });
  }
}
