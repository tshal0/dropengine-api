import { Result, ValueObject } from "@shared/domain";

export class ProductImage extends ValueObject<string> {
  static from(value: string): Result<ProductImage> {
    let val = new ProductImage({ value });
    return Result.ok(val);
  }
}
