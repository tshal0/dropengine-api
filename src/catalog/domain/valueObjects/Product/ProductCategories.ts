import { ValueObject } from "@shared/domain";
import { uniq } from "lodash";

export class ProductCategories extends ValueObject<string[]> {
  static from(value: string | string[]): ProductCategories {
    if (typeof value == "string") {
      const categories = value.split(",");
      return new ProductCategories(categories);
    } else if (Array.isArray(value)) {
      return new ProductCategories(value);
    }
  }
  add(value: string) {
    let elements = [...this._props];
    elements.push(value);
    elements = uniq(elements);
    return new ProductCategories(elements);
  }
  remove(value: string) {
    let elements = [...this._props];
    elements = elements.filter((t) => t != value);
    elements = uniq(elements);
    return new ProductCategories(elements);
  }
  public value(): string[] {
    return [...this._props];
  }
}
