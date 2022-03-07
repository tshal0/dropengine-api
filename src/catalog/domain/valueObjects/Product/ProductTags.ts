import { ValueObject } from "@shared/domain";
import { trim, uniq } from "lodash";

export class ProductTags extends ValueObject<string[]> {
  static from(value: string | string[]): ProductTags {
    if (typeof value == "string") {
      const tags = value.split(",").map((t) => trim(t));
      return new ProductTags(tags);
    } else if (Array.isArray(value)) {
      return new ProductTags(value);
    }
  }
  add(value: string) {
    let elements = [...this._props];
    elements.push(value);
    elements = uniq(elements);
    return new ProductTags(elements);
  }
  remove(value: string) {
    let elements = [...this._props];
    elements = elements.filter((t) => t != value);
    elements = uniq(elements);
    return new ProductTags(elements);
  }
  public value(): string[] {
    return [...this._props];
  }
}
